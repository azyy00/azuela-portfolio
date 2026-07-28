import { motion, useReducedMotion, type Variants } from 'motion/react'

import { experience } from '../content/content'
import { SectionHeading } from './ui/section-heading'

const rowReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function Experience() {
  const reduce = useReducedMotion()

  return (
    <section id="experience" className="brand-section brand-section--experience">
      <div className="brand-shell">
        <SectionHeading
          heading={experience.heading}
          signal={experience.signal}
          note={experience.note}
          aside={
            <div className="xp-education">
              <p className="meta">{experience.education.label}</p>
              <p className="xp-education__degree">{experience.education.degree}</p>
              <p className="xp-education__school">{experience.education.school}</p>
              <p className="xp-education__year">{experience.education.year}</p>
            </div>
          }
        />

        <ol className="xp-ledger">
          {experience.roles.map((role, index) => {
            const present = /present|now/i.test(role.period)
            return (
              <motion.li
                key={`${role.org}-${role.title}`}
                className="xp-row"
                custom={index}
                variants={reduce ? undefined : rowReveal}
                initial={reduce ? false : 'hidden'}
                whileInView={reduce ? undefined : 'show'}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              >
                <div className="xp-row__rail">
                  <span className="xp-row__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="xp-row__period">{role.period}</span>
                  {present ? (
                    <span className="xp-live">
                      <span className="xp-live__dot" aria-hidden="true" />
                      Current
                    </span>
                  ) : null}
                </div>

                <div className="xp-row__main">
                  <h3 className="xp-row__title display">{role.title}</h3>
                  <div className="xp-row__org">
                    <img
                      src={role.logo}
                      alt={`${role.org} logo`}
                      className="xp-row__logo"
                      loading="lazy"
                    />
                    <span>{role.org}</span>
                  </div>
                  <p className="xp-row__body">{role.body}</p>
                </div>

                <span className="xp-row__marker" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H8.5M17 7v8.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
