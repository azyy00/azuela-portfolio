'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Project } from '../../content/content'
import { GlassButton, GlassButtonLink } from './glass-button'

// Gapless bento spans for the expanded grid. lg (3 cols): 2x2 + 1x2 + three
// 1x1 = 9 cells = a perfect 3x3. Mobile (2 cols): the tall card and the last
// card go full-width so it tiles to 2x5. grid-flow-dense backfills odd counts.
const BENTO = [
  'col-span-2 row-span-2',
  'col-span-2 row-span-1 lg:col-span-1 lg:row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1 lg:col-span-1',
]

const transition = { type: 'spring', stiffness: 160, damping: 20, mass: 1 } as const

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

export function ExpandableGallery({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const reduced = useReducedMotion()
  const activeTriggerRef = useRef<HTMLElement | null>(null)

  const openProject = (project: Project) => {
    activeTriggerRef.current = document.activeElement as HTMLElement | null
    setSelectedProject(project)
  }

  const closeProject = () => {
    setSelectedProject(null)
    window.requestAnimationFrame(() => activeTriggerRef.current?.focus())
  }

  return (
    <>
      <div className="grid w-full grid-flow-dense grid-cols-2 auto-rows-[9.5rem] gap-3 sm:auto-rows-[12rem] lg:auto-rows-[13.5rem] lg:grid-cols-3">
        {projects.map((project, index) => {
          const bento = BENTO[index] ?? 'col-span-1 row-span-1'
          const fit = project.mediaFit === 'contain' ? 'bg-bone object-contain' : 'object-cover'

          return (
            <motion.button
              key={`card-${project.slug}`}
              type="button"
              aria-label={`View ${project.title}`}
              aria-haspopup="dialog"
              initial={false}
              onClick={() => openProject(project)}
              className={cn(
                'project-card group relative cursor-pointer overflow-hidden border border-line bg-surface text-left',
                bento,
              )}
            >
              <div className="relative h-full w-full">
                {project.video ? (
                  <video
                    src={project.video}
                    poster={project.image}
                    autoPlay={!reduced}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className={cn(
                      'h-full w-full select-none transition-transform duration-700 ease-out group-hover:scale-105',
                      fit,
                    )}
                    aria-label={`${project.title} preview`}
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className={cn(
                      'h-full w-full select-none brightness-[0.72] saturate-[0.55] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100',
                      fit,
                    )}
                    draggable={false}
                  />
                )}
              </div>

              <div className="project-card__rail pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between">
                <span>{project.role}</span>
                <span>Case {String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="project-card__overlay pointer-events-none absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="display truncate text-lg leading-tight text-white md:text-xl">
                      {project.title}
                    </h3>
                    <p className="meta mt-1 text-white/55">{project.year}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full border border-white/25 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
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
