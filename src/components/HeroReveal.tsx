import { motion, type MotionStyle } from 'motion/react'

import homeProfileSrc from '../assets/home page profile.png'

/**
 * Single decorative portrait on the right of the hero.
 * The parent still drives the parallax style, but the old two-layer
 * reveal/mask setup has been removed so the new profile stays clean.
 */
export function HeroReveal({ style }: { style?: MotionStyle }) {
  return (
    <motion.div className="hero-reveal" style={style} aria-hidden="true">
      <div className="hero-reveal__halo" />
      <img className="hero-reveal__image" src={homeProfileSrc} alt="" draggable={false} />
    </motion.div>
  )
}
