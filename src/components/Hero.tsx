import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { hero, site } from '../content/content'
import { GlassButtonLink } from './ui/glass-button'
import { HeroReveal } from './HeroReveal'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -44])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.28])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="home-hero relative flex overflow-hidden"
    >
      <HeroReveal style={reduced ? undefined : { y: portraitY, scale: portraitScale }} />

      <motion.div
        className="hero-shell pointer-events-none relative z-10"
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          className="hero-availability"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_1.2rem_var(--color-accent)]" />
          <span className="font-medium text-ink">{site.availability}</span>
          <span className="h-4 w-px bg-line" aria-hidden="true" />
          <span>{site.location}</span>
        </motion.div>

        <motion.p
          className="hero-kicker meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {site.name} / {site.role}
        </motion.p>

        <h1 className="hero-heading display">
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`hero-text-line block${i === hero.lines.length - 1 ? ' hero-text-line--muted' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease, delay: 0.15 + i * 0.09 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.6 }}
        >
          {hero.intro}
        </motion.p>

        <motion.div
          className="hero-actions pointer-events-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.72 }}
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
      </motion.div>
    </section>
  )
}
