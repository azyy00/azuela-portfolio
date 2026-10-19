import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { site } from '../content/content'
import { GlassButtonLink } from './ui/glass-button'
import { ShaderBackground } from './ui/hero'
import cutoutSrc from '../assets/hero-portrait-cutout.webp'

const ease = [0.16, 1, 0.3, 1] as const
const NAME_WORDS = ['Anthony', 'Azuela']

/**
 * Three layers: a plasma shader for the backdrop, the name set enormous, and a
 * cut-out of the portrait in front, so the letters pass behind the head.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.28])

  const portraitStyle = reduced ? undefined : { y: portraitY, scale: portraitScale }

  return (
    <section id="top" ref={sectionRef} className="home-hero relative overflow-hidden">
      <div className="hero-shader" aria-hidden="true">
        <ShaderBackground />
      </div>

      <motion.h1
        className="hero-name"
        aria-label={site.name}
        style={reduced ? undefined : { y: nameY, opacity: copyOpacity }}
      >
        {NAME_WORDS.map((word, i) => (
          <span key={word} className="hero-name__clip" aria-hidden="true">
            <motion.span
              className="hero-name__word"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.1 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.div className="hero-portrait" style={portraitStyle} aria-hidden="true">
        <img className="hero-portrait__img" src={cutoutSrc} alt="" draggable={false} />
      </motion.div>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.7 }}
      >
        <GlassButtonLink href="#work" variant="accent" contentClassName="flex items-center gap-2">
          View work
          <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
        </GlassButtonLink>
        <GlassButtonLink href="#contact" variant="ghost" contentClassName="flex items-center gap-2">
          Start a project
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </GlassButtonLink>
      </motion.div>
    </section>
  )
}
