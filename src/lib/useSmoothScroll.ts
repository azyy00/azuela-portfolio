import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { prefersReducedMotion, scrollSignal } from './motion'

gsap.registerPlugin(ScrollTrigger)

const NAVIGATE_EVENT = 'portfolio:navigate'
const NAV_OFFSET = -72
const NAV_DURATION = 1.15
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

type NavigateDetail = {
  href: string
}

/**
 * Shared section-navigation entry point for controls that are not native links.
 * Native in-page links are captured by the Lenis listener below.
 */
export function scrollToSection(href: string) {
  if (typeof window === 'undefined') return

  const target = document.querySelector<HTMLElement>(href)
  if (!target) return

  if (prefersReducedMotion()) {
    target.scrollIntoView({ block: 'start' })
  } else {
    window.dispatchEvent(
      new CustomEvent<NavigateDetail>(NAVIGATE_EVENT, {
        detail: { href },
      }),
    )
  }

  if (window.location.hash !== href) {
    window.history.pushState(null, '', href)
  }
}

/**
 * Drives Lenis from GSAP's ticker so ScrollTrigger and the smooth-scroll
 * position never disagree by a frame. Skipped entirely under reduced motion,
 * which leaves native scrolling in place.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // ScrollTrigger still needs to run for pinned sections.
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: easeOutExpo,
      smoothWheel: true,
      wheelMultiplier: 0.86,
      syncTouch: false,
      touchMultiplier: 1.2,
      overscroll: true,
    })

    lenis.on('scroll', (event: { progress: number; velocity: number }) => {
      scrollSignal.progress = event.progress
      scrollSignal.velocity = event.velocity
      ScrollTrigger.update()
    })

    const scrollToTarget = (href: string, immediate = false) => {
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return

      lenis.scrollTo(target, {
        offset: href === '#top' ? 0 : NAV_OFFSET,
        duration: NAV_DURATION,
        easing: easeOutExpo,
        immediate,
        onComplete: () => ScrollTrigger.refresh(),
      })
    }

    const handleNavigation = (event: Event) => {
      const { href } = (event as CustomEvent<NavigateDetail>).detail
      scrollToTarget(href)
    }

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return
      }

      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      const href = anchor?.getAttribute('href')
      if (!href || href === '#' || !document.querySelector(href)) return

      event.preventDefault()
      if (window.location.hash !== href) {
        window.history.pushState(null, '', href)
      }
      scrollToTarget(href)
    }

    const handlePopState = () => {
      scrollToTarget(window.location.hash || '#top')
    }

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.addEventListener(NAVIGATE_EVENT, handleNavigation)
    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleAnchorClick)

    const initialHashFrame = window.requestAnimationFrame(() => {
      if (window.location.hash) scrollToTarget(window.location.hash, true)
      ScrollTrigger.refresh()
    })

    return () => {
      window.cancelAnimationFrame(initialHashFrame)
      window.removeEventListener(NAVIGATE_EVENT, handleNavigation)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
