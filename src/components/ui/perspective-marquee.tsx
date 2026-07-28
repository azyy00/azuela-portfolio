import type { CSSProperties, ReactNode } from 'react'

import { Marquee } from './marquee'

export interface PerspectiveMarqueeProps {
  children: ReactNode
  speed?: number
  rotateY?: number
  rotateX?: number
  perspective?: number
  className?: string
}

type PerspectiveStyle = CSSProperties & {
  '--marquee-rotate-x': string
  '--marquee-rotate-y': string
  '--marquee-perspective': string
}

/**
 * Browser-native adaptation of the supplied Remotion marquee.
 * It keeps the same perspective and edge-fade idea without shipping a video
 * renderer in the portfolio bundle.
 */
export function PerspectiveMarquee({
  children,
  speed = 42,
  rotateY = -16,
  rotateX = 7,
  perspective = 1200,
  className = '',
}: PerspectiveMarqueeProps) {
  const style: PerspectiveStyle = {
    '--marquee-rotate-x': `${rotateX}deg`,
    '--marquee-rotate-y': `${rotateY}deg`,
    '--marquee-perspective': `${perspective}px`,
  }

  return (
    <div className={`perspective-marquee ${className}`} style={style}>
      <div className="perspective-marquee__stage">
        <Marquee speed={speed} className="perspective-marquee__track">
          {children}
        </Marquee>
      </div>
    </div>
  )
}
