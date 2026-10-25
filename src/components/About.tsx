import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import aboutPortrait from '../assets/about-me.png'
import { about, site } from '../content/content'
import { RotatingRoles } from './ui/rotating-roles'
import { SectionHeading } from './ui/section-heading'

// The lanyard pulls in three.js, a 2 MB physics engine and a 2.5 MB model.
// Load all of it only when the badge comes near the viewport, not on page open.
const Lanyard = lazy(() => import('./ui/Lanyard'))

function useNearViewport(margin = '800px 0px') {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (typeof IntersectionObserver === 'undefined') return setNear(true)
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setNear(true)
        io.disconnect()
      }
    }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin, near])
  return [ref, near] as const
}

export function About() {
  const reduced = useReducedMotion()
  const [badgeRef, badgeNear] = useNearViewport()
  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '0px 0px -12% 0px' },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      }

  return (
    <section id="about" className="brand-section brand-section--about">
      <div className="brand-shell">
        <SectionHeading
          index="05"
          heading="About"
          signal="Builder profile / Camarines Sur"
          note={about.summary}
          aside={<span className="meta">{site.name}</span>}
        />

        <div className="about-layout">
          {/* Lanyard — a draggable ID badge carrying the portrait (unchanged) */}
          <div className="about-layout__badge" ref={badgeRef}>
            {badgeNear ? (
              <Suspense fallback={null}>
                <Lanyard
                  position={[0, 0, 13]}
                  gravity={[0, -40, 0]}
                  frontImage={aboutPortrait}
                  imageFit="cover"
                />
              </Suspense>
            ) : null}
          </div>

          <motion.div className="about-layout__info" {...reveal}>
            <div className="about-identity">
              <h3 className="about-name">{site.name}</h3>
              <RotatingRoles roles={site.roles} className="about-roles" />
            </div>

            <dl className="about-facts">
              {about.facts.map((fact) => (
                <div key={fact.label} className="about-facts__item">
                  <dt className="meta">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="about-education">
              <p className="meta">Education</p>
              <div className="about-education__row">
                <div>
                  <p className="about-education__degree">{about.education.degree}</p>
                  <p className="about-education__school">{about.education.school}</p>
                </div>
                <div className="about-education__meta">
                  <p>{about.education.period}</p>
                  <p>{about.education.note}</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
