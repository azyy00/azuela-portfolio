import { motion } from 'motion/react'

import { testimonials } from '../content/content'
import { rise } from '../lib/motion'

export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.h2 {...rise} className="meta">
          {testimonials.heading}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {testimonials.items.map((item, i) => (
            <motion.figure
              key={item.name + i}
              {...rise}
              transition={{ ...rise.transition, delay: i * 0.08 }}
            >
              <blockquote className="quote text-2xl text-ink md:text-3xl">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="h-px w-6 bg-accent" aria-hidden="true" />
                <span className="text-sm text-ink">{item.name}</span>
                <span className="text-sm text-muted">{item.title}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
