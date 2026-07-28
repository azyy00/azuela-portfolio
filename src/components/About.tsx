import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import aboutPortrait from '../assets/about-me.png'
import { about, site } from '../content/content'
import { useReducedMotion } from '../lib/motion'
import Lanyard from './ui/Lanyard'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const lanyardRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const factsRef = useRef<HTMLDListElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return

    const context = gsap.context(() => {
      gsap.fromTo(
        [lanyardRef.current, headingRef.current, factsRef.current],
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            end: 'top 18%',
            scrub: 0.18,
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
        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-center items-center gap-10 px-6 pb-36 pt-28 md:grid-cols-12 md:gap-14 md:py-24">
          {/* Lanyard — a draggable ID badge carrying the portrait */}
          <div
            ref={lanyardRef}
            className="order-1 col-span-full h-[24rem] w-full md:col-span-5 md:h-[36rem]"
          >
            <Lanyard
              position={[0, 0, 13]}
              gravity={[0, -40, 0]}
              frontImage={aboutPortrait}
              imageFit="cover"
            />
          </div>

          {/* Story */}
          <div className="order-2 col-span-full md:col-span-6 md:col-start-7">
            <div className="about-signal">
              <span aria-hidden="true" />
              Builder profile / Goa, Camarines Sur
            </div>
            <h2
              ref={headingRef}
              className="quote max-w-[16ch] text-4xl text-ink md:text-[3.1rem] md:leading-[1.12]"
            >
              {about.lead}
            </h2>

            <dl ref={factsRef} className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5">
              {about.facts.map((fact) => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="meta">{fact.label}</dt>
                  <dd className="mt-1.5 text-base leading-snug text-ink md:text-lg">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex items-baseline gap-3">
              <span className="quote text-[1.75rem] text-ink md:text-[2.15rem]">{site.name}</span>
              <span className="meta">{site.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
