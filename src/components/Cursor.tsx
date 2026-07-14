import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../lib/motion'

/**
 * A trailing ring that widens over interactive elements. Suppressed on
 * touch devices and under reduced motion, where the native cursor is fine.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!enabled || reduced) return

    const node = ring.current
    if (!node) return

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let scale = 1

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      const over = (event.target as Element | null)?.closest('a, button, [data-cursor]')
      scale = over ? 2.2 : 1
    }

    const tick = () => {
      x += (targetX - x) * 0.16
      y += (targetY - y) * 0.16
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [enabled, reduced])

  if (!enabled || reduced) return null

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-101 h-3 w-3 rounded-full border border-ink/40 mix-blend-difference"
      style={{ transition: 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)' }}
    />
  )
}
