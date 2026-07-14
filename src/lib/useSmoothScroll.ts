import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { prefersReducedMotion, scrollSignal } from './motion'

gsap.registerPlugin(ScrollTrigger)

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
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', (event: { progress: number; velocity: number }) => {
      scrollSignal.progress = event.progress
      scrollSignal.velocity = event.velocity
      ScrollTrigger.update()
    })

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
