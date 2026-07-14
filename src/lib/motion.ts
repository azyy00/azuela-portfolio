import { useEffect, useState } from 'react'

/**
 * Mutable scroll signal shared between the DOM and the R3F render loop.
 * Written once per Lenis frame; read inside useFrame without causing renders.
 */
export const scrollSignal = { progress: 0, velocity: 0 }

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** Standard entrance: rise 12px and fade, resolving on an expo curve. */
export const rise = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12% 0px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

/** Cascade children by index. Pass `custom={i}` on each child. */
export const riseStagger = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: (i: number) => ({
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as const,
    delay: i * 0.08,
  }),
}
