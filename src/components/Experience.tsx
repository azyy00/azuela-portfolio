import { experience } from '../content/content'
import { SectionHeading } from './ui/section-heading'
import Timeline, { type JourneyItem, type Month } from './ui/timeline'

const MONTHS: Month[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Each role becomes a milestone at its start date ("Dec 2025 - Present" →
 * 2025 December). Oldest first, alternating above and below the line.
 */
const milestones: JourneyItem[] = experience.roles
  .map((role) => {
    const [mon = '', year = ''] = role.period.split(/\s+-\s+/)[0]!.trim().split(/\s+/)
    const month = MONTHS.find((m) => m.startsWith(mon)) ?? 'January'
    return {
      id: `${year}-${month.toLowerCase()}-${role.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      year,
      month,
      content: `${role.title}, ${role.org}`,
      position: 'top' as const,
    }
  })
  .sort((a, b) => Number(a.year) - Number(b.year) || MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month))
  .map((item, i) => ({ ...item, position: i % 2 === 0 ? ('top' as const) : ('bottom' as const) }))

const firstYear = milestones[0]?.year ?? ''

export function Experience() {
  return (
    <section id="experience" className="brand-section brand-section--experience">
      <div className="brand-shell xp-shell">
        <SectionHeading
          index="04"
          heading={
            <>
              Work <em className="sh-accent">Experience</em>
            </>
          }
          signal="Career"
          note={experience.note}
          aside={
            <div className="xp-education">
              <p className="meta">{experience.education.label}</p>
              <p className="xp-education__degree">{experience.education.degree}</p>
              <p className="xp-education__school">{experience.education.school}</p>
              <p className="xp-education__year">{experience.education.year}</p>
            </div>
          }
        />
      </div>

      {/* Pinned horizontal scroll: the section scrolls sideways through the roles. */}
      <Timeline
        title="Career path"
        periodLabel={`${firstYear} — Present`}
        items={milestones}
        textColor="var(--color-ink)"
        mutedTextColor="var(--color-ink-soft)"
        activeColor="var(--color-accent)"
        backgroundColor="var(--color-bone)"
        imageUrl=""
        duration={1.4}
        className="xp-timeline-pin"
      />
    </section>
  )
}
