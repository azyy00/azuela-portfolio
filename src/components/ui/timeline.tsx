import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

export type TimelineEntry = {
  title: string
  content: ReactNode
}

type TimelineProps = {
  data: TimelineEntry[]
  heading: string
  intro?: ReactNode
}

export function Timeline({ data, heading, intro }: TimelineProps) {
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
    <div ref={containerRef} className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="display text-4xl md:text-5xl"
          >
            {heading}
          </motion.h2>
        </div>

        {intro ? <div className="md:col-span-5 md:col-start-7">{intro}</div> : null}
      </div>

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
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{
                duration: 0.6,
                delay: reduceMotion ? 0 : index * 0.06,
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
