import { motion } from 'motion/react'

import { Globe } from '@/components/ui/cobe-globe'
import { skills } from '../content/content'
import { rise } from '../lib/motion'
import { BrandIcon, brandIcon, skillColor, skillIcon } from '../lib/skillIcons'

/**
 * Skills stand in for cities: each is a marker at a spread-out coordinate so
 * the labels do not overlap as the globe turns. Defined at module scope so the
 * reference stays stable — the globe re-initialises if this array changes.
 */
const skillMarkers = [
  { id: 'react', location: [37.77, -122.42] as [number, number], label: 'React' },
  { id: 'typescript', location: [51.51, -0.13] as [number, number], label: 'TypeScript' },
  { id: 'node', location: [35.68, 139.65] as [number, number], label: 'Node' },
  { id: 'next', location: [48.85, 2.35] as [number, number], label: 'Next.js' },
  { id: 'tailwind', location: [1.35, 103.82] as [number, number], label: 'Tailwind' },
  { id: 'supabase', location: [-33.87, 151.21] as [number, number], label: 'Supabase' },
  { id: 'vite', location: [25.2, 55.27] as [number, number], label: 'Vite' },
  { id: 'vercel', location: [40.71, -74.01] as [number, number], label: 'Vercel' },
  { id: 'canva', location: [-23.55, -46.63] as [number, number], label: 'Canva' },
  { id: 'motion', location: [-33.92, 18.42] as [number, number], label: 'Motion' },
  { id: 'gemini', location: [19.43, -99.13] as [number, number], label: 'Gemini' },
]

export function Skills() {
  return (
    <section id="skills" className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.h2 {...rise} className="display text-4xl md:text-5xl">
            {skills.heading}
          </motion.h2>
          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.08 }}
            className="max-w-sm text-sm text-muted"
          >
            {skills.note}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {skills.groups.map((group, i) => (
              <motion.div
                key={group.label}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.06 }}
                className="bg-surface p-7 md:p-9"
              >
                <h3 className="meta">{group.label}</h3>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                  {group.items.map((item) => {
                  const Icon = skillIcon(item)
                    const brand = brandIcon(item)
                    return (
                      <li
                        key={item}
                        className="group/skill flex items-center gap-2 text-base text-ink-soft transition-colors duration-200 hover:text-ink"
                      >
                        {brand ? (
                          <BrandIcon icon={brand} />
                        ) : (
                          <Icon
                            className="h-4 w-4 shrink-0 transition-[filter] duration-200 group-hover/skill:brightness-125"
                            style={{ color: skillColor(item) }}
                            aria-hidden="true"
                          />
                        )}
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...rise}
            transition={{ ...rise.transition, delay: 0.1 }}
            className="mx-auto w-full max-w-[320px]"
          >
            <Globe markers={skillMarkers} className="w-full" />
            <p className="meta mt-4 text-center">Drag to spin — my stack</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
