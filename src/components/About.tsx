import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import aboutPortrait from '../assets/about-me.png'
import { about, site } from '../content/content'
import { useReducedMotion } from '../lib/motion'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDListElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return

    const context = gsap.context(() => {
      gsap.fromTo(
        wordRef.current,
        { yPercent: 18, scale: 0.9, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.8,
          },
        },
      )

      gsap.fromTo(
        [portraitRef.current, headingRef.current, copyRef.current, factsRef.current],
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            end: 'top 18%',
            scrub: 0.8,
          },
        },
      )
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] md:h-[100svh] md:min-h-[44rem]"
    >
      <div className="cinematic-about relative flex min-h-[100svh] flex-col overflow-hidden md:fixed md:inset-x-0 md:bottom-0 md:h-[100svh] md:min-h-[44rem]">
        <div className="cinematic-about-aurora" aria-hidden="true" />
        <div className="cinematic-about-vignette" aria-hidden="true" />
        <div ref={wordRef} className="cinematic-section-word cinematic-about-word" aria-hidden="true">
          ABOUT
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center items-center gap-10 px-6 pb-36 pt-28 md:grid-cols-12 md:gap-14 md:py-24">
          {/* Portrait — the human presence the section was missing */}
          <div
            ref={portraitRef}
            className="order-1 col-span-full mx-auto w-full max-w-[16rem] md:col-span-5 md:mx-0 md:max-w-none"
          >
            <figure className="about-portrait">
              <img
                src={aboutPortrait}
                alt={`${site.name}, full-stack developer, in a studio portrait`}
                className="about-portrait__img"
              />
              <span className="about-portrait__wash" aria-hidden="true" />
            </figure>
          </div>

          {/* Story */}
          <div className="order-2 col-span-full md:col-span-6 md:col-start-7">
            <h2
              ref={headingRef}
              className="quote max-w-[16ch] text-3xl text-ink md:text-[2.6rem] md:leading-[1.15]"
            >
              {about.lead}
            </h2>

            <div ref={copyRef} className="mt-7">
              {about.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 max-w-[62ch] text-sm leading-relaxed text-ink-soft last:mb-0 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <dl ref={factsRef} className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5">
              {about.facts.map((fact) => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="meta">{fact.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex items-baseline gap-3">
              <span className="quote text-2xl text-ink md:text-[1.75rem]">{site.name}</span>
              <span className="meta">{site.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
