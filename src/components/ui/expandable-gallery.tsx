'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Project } from '../../content/content'
import { brandIcon, skillColor } from '../../lib/skillIcons'
import { GlassButton, GlassButtonLink } from './glass-button'

const transition = { type: 'spring', stiffness: 160, damping: 20, mass: 1 } as const

// Per-project gradient wash for the preview card. Deep, saturated pairs so white
// copy stays legible over them — the "colorful" cue without turning pastel.
const ACCENTS: Array<[string, string]> = [
  ['#c81e4a', '#4f0f2b'], // rose → wine
  ['#2f6df0', '#4a27b8'], // blue → indigo
  ['#0f8a7e', '#0b3f49'], // teal → deep teal
  ['#d9662a', '#7c1d2c'], // amber → maroon
  ['#7b3ff0', '#33217f'], // violet
]

// Spring pop used as each project scrolls into view.
const reveal = {
  hidden: { opacity: 0, y: 44, scale: 0.975 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 130, damping: 18, mass: 0.9 },
  },
} as const

function ProjectLink({ href, children }: { href: string; children: string }) {
  return (
    <GlassButtonLink
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={children}
      size="sm"
      variant="ghost"
      contentClassName="flex items-center gap-1.5"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </GlassButtonLink>
  )
}

function ProjectDetailDialog({
  project,
  reduced,
  onClose,
}: {
  project: Project
  reduced: boolean | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto bg-bone/90 p-4 backdrop-blur-md md:p-8"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-title-${project.slug}`}
        className="project-dialog relative mx-auto my-4 w-full max-w-6xl overflow-hidden border border-line bg-surface md:my-8"
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={reduced ? { duration: 0 } : transition}
      >
        <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
          <GlassButton
            ref={closeButtonRef}
            type="button"
            size="icon"
            variant="ghost"
            aria-label={`Close ${project.title}`}
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </GlassButton>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
          <div className="flex min-h-64 items-center justify-center overflow-hidden bg-bone lg:min-h-[38rem]">
            {project.video ? (
              <video
                src={project.video}
                poster={project.image}
                autoPlay={!reduced}
                loop
                muted
                controls
                playsInline
                preload="metadata"
                className={cn(
                  'h-full max-h-[75dvh] w-full',
                  project.mediaFit === 'contain' ? 'object-contain' : 'object-cover',
                )}
                aria-label={`${project.title} preview`}
              />
            ) : (
              <img
                src={project.image}
                alt={`${project.title} project preview`}
                className={cn(
                  'h-full max-h-[75dvh] w-full',
                  project.mediaFit === 'contain' ? 'object-contain' : 'object-cover',
                )}
              />
            )}
          </div>

          <div className="flex flex-col justify-between p-6 pt-20 md:p-10 md:pt-24 lg:p-10 lg:pt-24">
            <div>
              <div className="meta flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>{project.role}</span>
                <span>{project.year}</span>
              </div>
              <h3
                id={`project-title-${project.slug}`}
                className="display mt-4 text-3xl md:text-5xl"
              >
                {project.title}
              </h3>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-2" aria-label="Technology stack">
                {project.stack.map((technology) => (
                  <span
                    key={technology}
                    className="tag border border-line bg-surface-alt text-ink-soft"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
              {project.live ? <ProjectLink href={project.live}>Live</ProjectLink> : null}
              {project.source ? <ProjectLink href={project.source}>Source</ProjectLink> : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WorkCard({
  project,
  index,
  reduced,
  onOpen,
}: {
  project: Project
  index: number
  reduced: boolean | null
  onOpen: (project: Project) => void
}) {
  const [from, to] = ACCENTS[index % ACCENTS.length]
  const fit = project.mediaFit === 'contain' ? 'object-contain' : 'object-cover object-top'

  return (
    <motion.article
      className="work-item__inner"
      variants={reduced ? undefined : reveal}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'show'}
      viewport={{ once: true, margin: '0px 0px -14% 0px' }}
    >
        <header className="work-item__meta">
          <span className="work-item__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="work-item__cat">{project.role}</span>
          <span className="work-item__year">© {project.year}</span>
        </header>

        <h3 className="work-item__title display">{project.title}</h3>

        <button
          type="button"
          aria-label={`View ${project.title}`}
          aria-haspopup="dialog"
          onClick={() => onOpen(project)}
          className="work-card group"
          style={{ ['--wk-from' as string]: from, ['--wk-to' as string]: to }}
        >
          <span className="work-card__wash" aria-hidden="true" />

          <span className="work-card__head">
            <span className="work-card__desc">{project.summary}</span>
            <span className="work-card__arrow" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>

          <span className="work-card__shot">
            {project.video ? (
              <video
                src={project.video}
                poster={project.image}
                autoPlay={!reduced}
                loop
                muted
                playsInline
                preload="metadata"
                className={cn('work-card__media', fit)}
                aria-label={`${project.title} preview`}
              />
            ) : (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                draggable={false}
                className={cn('work-card__media', fit)}
              />
            )}
          </span>
        </button>

        <ul className="work-stack" aria-label={`${project.title} technology stack`}>
          {project.stack.map((tech) => {
            const icon = brandIcon(tech)
            return (
              <li key={tech} className="work-chip">
                {icon ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ color: skillColor(tech) }}>
                    <path d={icon.path} fill="currentColor" />
                  </svg>
                ) : null}
                {tech}
              </li>
            )
          })}
        </ul>
    </motion.article>
  )
}

export function ExpandableGallery({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const reduced = useReducedMotion()
  const activeTriggerRef = useRef<HTMLElement | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Drive the accent rail from the section's scroll progress — the "timeline"
  // fills as you move down through the projects.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 22%', 'end 78%'],
  })
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  const openProject = (project: Project) => {
    activeTriggerRef.current = document.activeElement as HTMLElement | null
    setSelectedProject(project)
  }

  const closeProject = () => {
    setSelectedProject(null)
    window.requestAnimationFrame(() => activeTriggerRef.current?.focus())
  }

  // Alternate projects into two columns; the centre rail runs between them.
  const items = projects.map((project, index) => ({ project, index }))
  const columns: Array<{ side: 'left' | 'right'; items: typeof items }> = [
    { side: 'left', items: items.filter((it) => it.index % 2 === 0) },
    { side: 'right', items: items.filter((it) => it.index % 2 === 1) },
  ]

  return (
    <>
      <div className="wtl" ref={timelineRef}>
        <div className="wtl__line" aria-hidden="true">
          <motion.div
            className="wtl__progress"
            style={{
              scaleY: reduced ? 1 : scrollYProgress,
              opacity: reduced ? 1 : lineOpacity,
            }}
          />
        </div>

        <div className="wtl__columns">
          {columns.map((column) => (
            <div className={`wtl__col wtl__col--${column.side}`} key={column.side}>
              {column.items.map(({ project, index }) => (
                <div
                  className={`wtl__item wtl__item--${column.side}`}
                  style={{ order: index }}
                  key={`card-${project.slug}`}
                >
                  <span className="wtl__node" aria-hidden="true" />
                  <WorkCard
                    project={project}
                    index={index}
                    reduced={reduced}
                    onOpen={openProject}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {selectedProject ? (
                <ProjectDetailDialog
                  key={selectedProject.slug}
                  project={selectedProject}
                  reduced={reduced}
                  onClose={closeProject}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}

export default ExpandableGallery
