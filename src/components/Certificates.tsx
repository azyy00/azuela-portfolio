import type { MouseEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Award, ArrowUpRight } from 'lucide-react'

import { certificates } from '../content/content'

// Rendered JPG previews and the source PDFs, keyed by their shared basename.
const images = import.meta.glob('../assets/certificates/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const pdfs = import.meta.glob('../certificate/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function byBasename(map: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(map).map(([path, url]) => {
      const base = path.split('/').pop()!.replace(/\.[^.]+$/, '')
      return [base, url]
    }),
  )
}

const imageByName = byBasename(images)
const pdfByName = byBasename(pdfs)

type Item = (typeof certificates.items)[number]

const ease = [0.16, 1, 0.3, 1] as const

function CertificateCard({ item, index }: { item: Item; index: number }) {
  const reduced = useReducedMotion()
  const image = imageByName[item.file]
  const pdf = pdfByName[item.file]

  // Pointer-driven tilt. Springs smooth the motion; reset to flat on leave.
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 150, damping: 15 })
  const rotateY = useSpring(ry, { stiffness: 150, damping: 15 })

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * 9)
    rx.set(-(py - 0.5) * 9)
    event.currentTarget.style.setProperty('--mx', `${px * 100}%`)
    event.currentTarget.style.setProperty('--my', `${py * 100}%`)
  }

  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.a
      href={pdf ?? image}
      target="_blank"
      rel="noreferrer noopener"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.09 }}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className="cert-card group"
      aria-label={`${item.title} — ${certificates.issuer} certificate (opens PDF)`}
    >
      <div className="cert-card__inner">
        <div className="cert-card__media">
          {image ? (
            <img
              src={image}
              alt={`${item.title} statement of accomplishment from ${certificates.issuer}`}
              loading="lazy"
              className="aspect-[1440/831] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          ) : null}
          <span className="cert-card__badge">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            {certificates.issuer}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base leading-snug text-ink">{item.title}</h3>
            <span className="cert-card__go" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="meta mt-auto pt-4">
            {item.length} · Completed {item.date}
          </p>
        </div>
      </div>

      <span className="cert-card__spot" aria-hidden="true" />
    </motion.a>
  )
}

export function Certificates() {
  return (
    <section id="certificates" className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.6, ease }}
            className="display text-4xl md:text-5xl"
          >
            {certificates.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="max-w-md text-sm text-muted"
          >
            {certificates.note}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.items.map((item, i) => (
            <CertificateCard key={item.file} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
