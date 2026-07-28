import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { ExpandableGallery } from './ui/expandable-gallery'
import { projects } from '../content/content'
import laserFlow from '../assets/laser-flow.webm'

export function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })
  const curtainY = useTransform(scrollYProgress, [0, 0.72], ['0%', '-100%'])
  const contentY = useTransform(scrollYProgress, [0.12, 0.76], [36, 0])
  const contentOpacity = useTransform(scrollYProgress, [0.18, 0.7], [0, 1])
  const wordY = useTransform(scrollYProgress, [0.08, 0.78], [90, 0])
  const wordScale = useTransform(scrollYProgress, [0.08, 0.78], [0.9, 1])
  const wordOpacity = useTransform(scrollYProgress, [0.14, 0.74], [0, 1])

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section relative isolate overflow-hidden border-t border-line"
    >
      <video
        className="work-section__laser"
        src={laserFlow}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="work-section__veil" aria-hidden="true" />

      <motion.div
        className="cinematic-section-word cinematic-work-word"
        style={
          reduced
            ? undefined
            : { x: '-50%', y: wordY, scale: wordScale, opacity: wordOpacity }
        }
        aria-hidden="true"
      >
        WORK
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-32"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <h2 className="display text-4xl md:text-5xl">Selected work</h2>
          <span className="meta hidden sm:inline">{projects.length} projects</span>
        </div>

        <ExpandableGallery projects={projects} />
      </motion.div>

      {!reduced ? (
        <motion.div
          className="work-section__curtain"
          style={{ y: curtainY }}
          aria-hidden="true"
        />
      ) : null}
    </section>
  )
}
