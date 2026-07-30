import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

export type CertSlide = {
  id: string
  number: string
  title: string
  category: string
  year: string
  description: string
  image: string
  href: string
}

// Height of one minimap info block, in px. Must match `.cs-info { height }` in
// index.css — the sync maths below relies on it.
const INFO_H = 84
const DWELL = 3400 // ms an autoplay step rests on each certificate
const LERP = 0.09
const BUFFER = 3 // items rendered above/below the active one

const mod = (n: number, m: number) => ((n % m) + m) % m
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * A section-scoped vertical parallax slider. Unlike the source component it does
 * not hijack window scroll — it autoplays, pauses on hover, and can be dragged
 * with the mouse, so the surrounding one-page scroll (and Lenis) is untouched.
 */
export function CertificateSlider({ slides }: { slides: CertSlide[] }) {
  const reduced = useReducedMotion()
  const count = slides.length
  const [range, setRange] = useState({ min: -BUFFER, max: BUFFER })

  const rootRef = useRef<HTMLDivElement>(null)
  const slideEls = useRef<Map<number, HTMLElement>>(new Map())
  const infoEls = useRef<Map<number, HTMLElement>>(new Map())
  const rendered = useRef({ min: -BUFFER, max: BUFFER })

  const st = useRef({
    currentY: 0,
    targetY: 0,
    projectH: 1,
    dragging: false,
    moved: 0,
    hovering: false,
    dragStartY: 0,
    dragStartTarget: 0,
    activeIndex: 0,
    nextAdvance: 0,
  })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const s = st.current

    const measure = () => {
      s.projectH = root.clientHeight || 1
    }
    measure()
    s.nextAdvance = Date.now() + DWELL

    const parallax = (img: HTMLImageElement | null, index: number) => {
      if (!img) return
      if (reduced) {
        img.style.transform = 'translate3d(0,0,0) scale(1.04)'
        return
      }
      const target = (-s.currentY - index * s.projectH) * 0.14
      const cur = parseFloat(img.dataset.p || '0')
      const next = lerp(cur, target, 0.1)
      img.style.transform = `translate3d(0, ${next}px, 0) scale(1.3)`
      img.dataset.p = String(next)
    }

    const place = () => {
      const infoY = (s.currentY * INFO_H) / s.projectH
      const active = Math.round(-s.currentY / s.projectH)
      slideEls.current.forEach((el, index) => {
        const y = index * s.projectH + s.currentY
        el.style.transform = `translate3d(0, ${y}px, 0)`
        parallax(el.querySelector('img'), index)
      })
      infoEls.current.forEach((el, index) => {
        const y = index * INFO_H + infoY + INFO_H
        el.style.transform = `translate3d(0, ${y}px, 0)`
        el.classList.toggle('is-active', index === active)
      })
    }

    const loop = () => {
      const now = Date.now()
      if (!s.dragging) {
        if (!reduced && !s.hovering && now >= s.nextAdvance) {
          s.activeIndex += 1
          s.nextAdvance = now + DWELL
        }
        s.targetY = -s.activeIndex * s.projectH
      }
      s.currentY = reduced ? s.targetY : lerp(s.currentY, s.targetY, LERP)
      place()

      const active = Math.round(-s.currentY / s.projectH)
      const min = active - BUFFER
      const max = active + BUFFER
      if (min !== rendered.current.min || max !== rendered.current.max) {
        rendered.current = { min, max }
        setRange({ min, max })
      }
      raf = requestAnimationFrame(loop)
    }
    let raf = requestAnimationFrame(loop)

    // Mouse drag only — touch is left to scroll the page so mobile never traps.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      s.dragging = true
      s.moved = 0
      s.hovering = true
      s.dragStartY = e.clientY
      s.dragStartTarget = s.targetY
      root.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const dy = e.clientY - s.dragStartY
      s.moved = Math.max(s.moved, Math.abs(dy))
      s.targetY = s.dragStartTarget + dy
    }
    const onUp = () => {
      if (!s.dragging) return
      s.dragging = false
      s.activeIndex = Math.round(-s.targetY / s.projectH)
      s.nextAdvance = Date.now() + DWELL
      if (s.moved < 6) {
        const slide = slides[mod(s.activeIndex, count)]
        if (slide?.href && slide.href !== '#') {
          window.open(slide.href, '_blank', 'noopener,noreferrer')
        }
      }
    }
    const onEnter = () => {
      s.hovering = true
    }
    const onLeave = () => {
      s.hovering = false
    }

    root.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    root.addEventListener('mouseenter', onEnter)
    root.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('mouseenter', onEnter)
      root.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', measure)
    }
  }, [reduced, count, slides])

  const indices: number[] = []
  for (let i = range.min; i <= range.max; i++) indices.push(i)

  // Seed each element with its current position so a freshly buffered item never
  // paints at y=0 (on top of the active slide) for the frame before the loop runs.
  const s0 = st.current
  const slideStyle = (i: number) => ({
    transform: `translate3d(0, ${i * s0.projectH + s0.currentY}px, 0)`,
  })
  const infoStyle = (i: number) => ({
    transform: `translate3d(0, ${i * INFO_H + (s0.currentY * INFO_H) / s0.projectH + INFO_H}px, 0)`,
  })

  return (
    <div
      className="cert-slider"
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="DataCamp certificates"
    >
      <div className="cs-stage" aria-hidden="true">
        {indices.map((i) => {
          const d = slides[mod(i, count)]
          return (
            <div
              key={i}
              className="cs-slide"
              style={slideStyle(i)}
              ref={(el) => {
                if (el) slideEls.current.set(i, el)
                else slideEls.current.delete(i)
              }}
            >
              <img src={d.image} alt="" draggable={false} loading="lazy" />
              <span className="cs-slide__scrim" />
              <div className="cs-slide__caption">
                <span className="cs-slide__num">{d.number}</span>
                <h3 className="cs-slide__title display">{d.title}</h3>
                <span className="cs-slide__meta">
                  {d.category} · {d.year} · {d.description}
                </span>
                <span className="cs-slide__open">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> Open PDF
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="cs-minimap">
        <div className="cs-minimap__window">
          <div className="cs-minimap__track">
            {indices.map((i) => {
              const d = slides[mod(i, count)]
              return (
                <a
                  key={i}
                  href={d.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="cs-info"
                  style={infoStyle(i)}
                  ref={(el) => {
                    if (el) infoEls.current.set(i, el)
                    else infoEls.current.delete(i)
                  }}
                >
                  <span className="cs-info__row">
                    <span className="cs-info__num">{d.number}</span>
                    <span className="cs-info__title">{d.title}</span>
                  </span>
                  <span className="cs-info__row cs-info__metarow">
                    <span>{d.category}</span>
                    <span>{d.year}</span>
                  </span>
                  <span className="cs-info__desc">{d.description}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <span className="cs-hint" aria-hidden="true">
        Auto-loops · hover to pause · click to open
      </span>
    </div>
  )
}
