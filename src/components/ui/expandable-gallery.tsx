'use client'

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

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
      size="sm"
      variant="ghost"
      contentClassName="flex items-center gap-1.5"
    >
      {children}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </GlassButtonLink>
  )
}

export function ExpandableGallery({ projects }: { projects: Project[] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const reduced = useReducedMotion()
  const layoutGroupId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef, () => {
    if (isExpanded) setIsExpanded(false)
  })

  return (
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
                <motion.div
                  key={`card-${project.slug}`}
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
                  onClick={() => !isExpanded && setIsExpanded(true)}
                  className={cn(
                    'cursor-pointer overflow-hidden bg-surface',
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
                        className="h-full w-full object-cover select-none"
                        aria-label={`${project.title} preview`}
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover brightness-[0.72] saturate-[0.4] select-none"
                        draggable={false}
                      />
                    )}
                  </motion.div>
                </motion.div>
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
  )
}

export default ExpandableGallery
