import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'

import { hero, site } from '../content/content'
import { SceneBoundary } from '../three/SceneBoundary'

// Three.js is ~40% of the bundle. Keep it out of the critical path.
const Scene = lazy(() => import('../three/Scene').then((m) => ({ default: m.Scene })))

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      <SceneBoundary>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </SceneBoundary>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-[42svh] pb-32 md:pt-28 md:pb-20">
        <motion.p
          className="meta mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {site.name} — {site.role}
        </motion.p>

        {/* The grotesk sets far wider than the serif did at the same size —
            this stays clear of the knot where a 7rem cap ran under it. */}
        <h1 className="display max-w-3xl text-[clamp(2.5rem,6.2vw,5.5rem)]">
          {hero.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`block ${i === hero.lines.length - 1 ? 'text-muted' : ''}`}
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
          className="mt-12 max-w-xl text-base text-ink-soft"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.6 }}
        >
          {hero.intro}
        </motion.p>
      </div>

      <motion.div
        className="meta absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <span className="flex flex-col items-center gap-2">
          {hero.scrollHint}
          <span className="block h-8 w-px bg-line" />
        </span>
      </motion.div>
    </section>
  )
}
