import type { ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full loop. Lower is faster. */
  speed?: number
  reverse?: boolean
  className?: string
}

/**
 * Seamless CSS marquee: the same content is rendered twice, side by side, and
 * the track is translated by -50% of its own width, so the second copy lands
 * exactly where the first began. Under reduced motion the track sits still
 * (handled in index.css) rather than snapping off-screen.
 */
export function Marquee({ children, speed = 40, reverse = false, className = '' }: MarqueeProps) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex min-w-full shrink-0 items-center"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="animate-marquee flex min-w-full shrink-0 items-center"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {children}
      </div>
    </div>
  )
}
