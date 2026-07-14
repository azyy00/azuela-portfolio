import { motion } from 'motion/react'

import { about } from '../content/content'
import { rise } from '../lib/motion'

export function About() {
  return (
    <section id="about" className="relative z-10 border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 md:py-32">
        <motion.h2 {...rise} className="display col-span-full text-4xl md:col-span-4 md:text-5xl">
          {about.heading}
        </motion.h2>

        <div className="col-span-full md:col-span-7 md:col-start-6">
          {about.body.map((paragraph, i) => (
            <motion.p
              key={i}
              {...rise}
              transition={{ ...rise.transition, delay: i * 0.08 }}
              className="mb-6 text-lg text-ink-soft last:mb-0"
            >
              {paragraph}
            </motion.p>
          ))}

          <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {about.facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                {...rise}
                transition={{ ...rise.transition, delay: 0.1 + i * 0.06 }}
                className="bg-surface p-6"
              >
                <dt className="meta">{fact.label}</dt>
                <dd className="mt-2 text-sm text-ink">{fact.value}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
