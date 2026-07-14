import { motion } from 'motion/react'

import { experience } from '../content/content'
import { rise } from '../lib/motion'

export function Experience() {
  return (
    <section id="experience" className="relative z-10 border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 md:py-32">
        <div className="col-span-full md:col-span-4">
          <motion.h2 {...rise} className="display text-4xl md:text-5xl">
            {experience.heading}
          </motion.h2>

          <motion.div
            {...rise}
            transition={{ ...rise.transition, delay: 0.1 }}
            className="mt-10 border-t border-line pt-6"
          >
            <p className="meta">{experience.education.label}</p>
            <p className="mt-3 text-base text-ink">{experience.education.degree}</p>
            <p className="mt-1 text-sm text-ink-soft">{experience.education.school}</p>
            <p className="mt-1 text-sm text-muted">{experience.education.year}</p>
          </motion.div>
        </div>

        <ol className="col-span-full md:col-span-7 md:col-start-6">
          {experience.roles.map((role, i) => (
            <motion.li
              key={role.title + i}
              {...rise}
              transition={{ ...rise.transition, delay: i * 0.08 }}
              className="border-b border-line py-10 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span className="meta">{role.period}</span>
              <h3 className="mt-3 text-xl text-ink md:text-2xl">{role.title}</h3>
              <p className="mt-1 text-sm text-accent">{role.org}</p>
              <p className="mt-4 max-w-prose text-base text-ink-soft">{role.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
