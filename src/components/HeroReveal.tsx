import { useRef, type PointerEvent } from 'react'

import plainSrc from '../assets/hero-plain.jpg'
import suitSrc from '../assets/hero-suit.png'

/**
 * Two stacked portraits on the right of the hero. The plain shot sits on top;
 * the suited shot sits beneath. A soft circular hole in the top layer tracks
 * the pointer, revealing only a small area of the suit underneath — a
 * flashlight/spotlight reveal. Purely decorative, so it's hidden from a11y.
 *
 * Layers are background images (not <img>) so they can be zoomed past the
 * frame — that gives 2-axis positioning, which is how the two differently
 * framed photos are aligned to each other (see the background-position values
 * in index.css).
 */
export function HeroReveal() {
  const ref = useRef<HTMLDivElement>(null)

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--y', `${event.clientY - rect.top}px`)
    el.style.setProperty('--hole-r', '78px')
  }

  const leave = () => {
    ref.current?.style.setProperty('--hole-r', '0px')
  }

  return (
    <div
      ref={ref}
      className="hero-reveal"
      onPointerMove={move}
      onPointerLeave={leave}
      aria-hidden="true"
    >
      <div className="hero-reveal__suit" style={{ backgroundImage: `url(${suitSrc})` }} />
      <div className="hero-reveal__plain" style={{ backgroundImage: `url(${plainSrc})` }} />
      <span className="hero-reveal__ring" />
    </div>
  )
}
