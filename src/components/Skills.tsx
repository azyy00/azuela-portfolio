import { Globe } from '@/components/ui/cobe-globe'
import { skills } from '../content/content'
import { BrandIcon, brandIcon, skillColor, skillIcon } from '../lib/skillIcons'
import { SectionHeading } from './ui/section-heading'

/**
 * Skills stand in for cities: each is a marker at a spread-out coordinate so
 * the labels do not overlap as the globe turns.
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
    <section id="skills" className="brand-section brand-section--skills">
      <div className="brand-shell">
        <SectionHeading
          signal="Tooling and practice"
          heading={skills.heading}
          note={skills.note}
          aside={<span className="meta">Interface / server / design</span>}
        />

        <div className="skills-system">
          <div className="skills-board">
            {skills.groups.map((group, index) => (
              <article key={group.label} className="skills-board__group">
                <header>
                  <span className="skills-board__index">0{index + 1}</span>
                  <h3>{group.label}</h3>
                </header>

                <ul>
                  {group.items.map((item) => {
                    const Icon = skillIcon(item)
                    const brand = brandIcon(item)

                    return (
                      <li key={item} className="group/skill">
                        {brand ? (
                          <BrandIcon icon={brand} />
                        ) : (
                          <Icon
                            className="shrink-0 transition-[filter] duration-200 group-hover/skill:brightness-125"
                            style={{ color: skillColor(item) }}
                            aria-hidden="true"
                          />
                        )}
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </article>
            ))}
          </div>

          <aside className="skills-globe-panel">
            <div className="brand-panel-bar">
              <span>stack-map.glb</span>
              <span>interactive</span>
            </div>
            <div className="skills-globe-panel__body">
              <Globe markers={skillMarkers} className="w-full" />
            </div>
            <p className="skills-globe-panel__caption">
              <span aria-hidden="true" />
              Drag to map the stack
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
