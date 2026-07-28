import { experience } from '../content/content'
import { Timeline, type TimelineEntry } from './ui/timeline'

export function Experience() {
  const entries: TimelineEntry[] = experience.roles.map((role) => ({
    title: role.period,
    content: (
      <div className="border-t border-line pt-6">
        <div className="flex items-start gap-4">
          <img
            src={role.logo}
            alt={`${role.org} logo`}
            className="h-12 w-12 shrink-0 rounded-xl border border-line bg-white object-contain p-1.5"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="meta text-accent">{role.org}</p>
            <h3 className="mt-1.5 text-2xl font-medium tracking-[-0.025em] text-ink md:text-3xl">
              {role.title}
            </h3>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">{role.body}</p>
      </div>
    ),
  }))

  return (
    <section id="experience" className="relative z-10 border-t border-line">
      <Timeline
        heading={experience.heading}
        data={entries}
        intro={
          <div className="border-t border-line pt-6">
            <p className="meta">{experience.education.label}</p>
            <p className="mt-3 text-base text-ink">{experience.education.degree}</p>
            <p className="mt-1 text-sm text-ink-soft">{experience.education.school}</p>
            <p className="mt-1 text-sm text-muted">{experience.education.year}</p>
          </div>
        }
      />
    </section>
  )
}
