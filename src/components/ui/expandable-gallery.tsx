'use client'

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react'

import { useOutsideClick } from '../../hooks/use-outside-click'
import { cn } from '@/lib/utils'
import type { Project } from '../../content/content'
import { GlassButton, GlassButtonLink } from './glass-button'

// Fan-out transforms for the three cards shown while collapsed.
const STACK = [
  { rotation: -14, x: -110, y: 12, zIndex: 10 },
  { rotation: -2, x: 0, y: -14, zIndex: 20 },
  { rotation: 13, x: 110, y: 6, zIndex: 30 },
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
        className="relative mx-auto my-4 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-surface shadow-2xl md:my-8"
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const reduced = useReducedMotion()
  const layoutGroupId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeTriggerRef = useRef<HTMLElement | null>(null)

  useOutsideClick(containerRef, () => {
    if (isExpanded && !selectedProject) setIsExpanded(false)
  })

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
      <LayoutGroup id={layoutGroupId}>
        <div className="flex w-full flex-col items-center">
        <div className="mb-2 flex h-12 w-full items-center justify-start">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="back-button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="z-50"
              >
                <GlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  contentClassName="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Back to stack</span>
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          ref={containerRef}
          layout
          className={cn(
            'relative w-full',
            isExpanded
              ? 'grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3'
              : 'flex flex-col items-center justify-start pt-4',
          )}
          transition={transition}
        >
          <div
            className={cn(
              // `relative` must stay in both states: collapsed cards are
              // absolutely positioned and centre via this flex parent's static
              // position, so they need a positioned ancestor.
              'relative',
              isExpanded ? 'contents' : 'mb-10 flex h-[420px] w-full items-center justify-center',
            )}
          >
            {projects.map((project, index) => {
              const isPrimary = index < 3
              if (!isPrimary && !isExpanded) return null
              const stack = STACK[index] ?? { rotation: 0, x: 0, y: 0, zIndex: index }

              const card = (
                <motion.button
                  key={`card-${project.slug}`}
                  type="button"
                  aria-label={`View ${project.title}`}
                  aria-haspopup="dialog"
                  layoutId={`card-container-${project.slug}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: isExpanded ? 0 : stack.rotation,
                    x: isExpanded ? 0 : stack.x,
                    y: isExpanded ? 0 : stack.y,
                    zIndex: isExpanded ? 10 : stack.zIndex,
                  }}
                  transition={transition}
                  whileHover={
                    isExpanded
                      ? { scale: 1.02 }
                      : {
                          scale: 1.05,
                          y: stack.y - 16,
                          rotate: stack.rotation * 0.7,
                          zIndex: 50,
                          transition: { type: 'spring', stiffness: 400, damping: 25 },
                        }
                  }
                  onClick={() => openProject(project)}
                  className={cn(
                    'cursor-pointer overflow-hidden bg-surface text-left',
                    isExpanded
                      ? 'relative aspect-square rounded-[1.75rem] border border-line md:rounded-[2.25rem]'
                      : 'absolute h-44 w-44 rounded-[2.25rem] border border-line md:h-56 md:w-56',
                  )}
                >
                  <motion.div
                    layoutId={`image-inner-${project.slug}`}
                    layout="position"
                    className="relative h-full w-full"
                    transition={transition}
                  >
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
                          'h-full w-full select-none',
                          project.mediaFit === 'contain'
                            ? 'bg-bone object-contain'
                            : 'object-cover',
                        )}
                        aria-label={`${project.title} preview`}
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={cn(
                          'h-full w-full brightness-[0.72] saturate-[0.4] select-none',
                          project.mediaFit === 'contain'
                            ? 'bg-bone object-contain'
                            : 'object-cover',
                        )}
                        draggable={false}
                      />
                    )}
                  </motion.div>
                </motion.button>
              )

              if (!isExpanded) return card

              return (
                <div key={project.slug} className="flex flex-col">
                  {card}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mt-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="display text-xl md:text-2xl">{project.title}</h3>
                      <span className="meta shrink-0">{project.year}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.live ? <ProjectLink href={project.live}>Live</ProjectLink> : null}
                      {project.source ? (
                        <ProjectLink href={project.source}>Source</ProjectLink>
                      ) : null}
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>

          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                key="stack-cta"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <GlassButton
                  onClick={() => setIsExpanded(true)}
                  aria-label="Explore all projects"
                  variant="accent"
                  contentClassName="group flex items-center gap-2"
                >
                  Explore all projects
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </div>
      </LayoutGroup>

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
