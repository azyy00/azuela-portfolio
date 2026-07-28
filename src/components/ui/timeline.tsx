import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { SectionHeading } from './section-heading'

export type TimelineEntry = {
  title: string
  content: ReactNode
}

type TimelineProps = {
  data: TimelineEntry[]
  heading: string
  signal: string
  note?: string
  intro?: ReactNode
}

export function Timeline({ data, heading, signal, note, intro }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const entriesRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const entries = entriesRef.current
    if (!entries) return

    const measure = () => setHeight(entries.getBoundingClientRect().height)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(entries)

    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 20%', 'end 65%'],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], [0, height])
  const progressOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1])

  return (
    <div ref={containerRef} className="brand-shell">
      <SectionHeading heading={heading} signal={signal} note={note} aside={intro} />

      <div ref={entriesRef} className="relative mt-16 md:mt-24">
        {data.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] pb-16 last:pb-0 md:grid-cols-[14rem_2.5rem_minmax(0,1fr)] md:pb-28"
          >
            <div className="hidden self-start pr-8 md:sticky md:top-32 md:block">
              <p className="meta text-right">{item.title}</p>
            </div>

            <div className="relative z-10 flex justify-center">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bone">
                <div className="h-2.5 w-2.5 rounded-full border border-accent bg-accent-soft" />
              </div>
            </div>

            <motion.div
              initial={false}
              transition={{
                duration: 0.35,
                delay: 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-0 pl-5 md:pl-8"
            >
              <p className="meta mb-4 md:hidden">{item.title}</p>
              {item.content}
            </motion.div>
          </article>
        ))}

        <div
          aria-hidden="true"
          className="absolute left-[1.21875rem] top-0 w-px overflow-hidden bg-line md:left-[15.21875rem]"
          style={{ height }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-px bg-accent"
            style={{
              height: reduceMotion ? height : progressHeight,
              opacity: reduceMotion ? 1 : progressOpacity,
            }}
          />
        </div>
      </div>
    </div>
  )
}
