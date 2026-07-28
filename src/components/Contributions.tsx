import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { github, site } from '../content/content'
import { SectionHeading } from './ui/section-heading'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Payload = { total: Record<string, number>; contributions: Day[] }

/** `null` is a pad cell before the first real day — it holds the row alignment. */
type Cell = Day | null

type State =
  | { status: 'loading' }
  | { status: 'ready'; weeks: Cell[][]; total: number; months: { label: string; col: number }[] }
  | { status: 'failed' }

const levelClass = [
  'bg-level-0',
  'bg-level-1',
  'bg-level-2',
  'bg-level-3',
  'bg-level-4',
] as const

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * The API returns a flat list of days starting on some weekday. Bucket it into
 * columns of seven. The pad cells at the head are kept rather than filtered:
 * dropping them top-aligns the first column and every weekday row in it lands
 * one square high.
 */
function toWeeks(days: Day[]): Cell[][] {
  if (days.length === 0) return []
  const weeks: Cell[][] = []
  const lead = new Date(days[0]!.date + 'T00:00:00').getDay()
  const padded: Cell[] = [...Array<null>(lead).fill(null), ...days]

  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }
  return weeks
}

/** One label per month, placed at the column where that month first appears. */
function monthLabels(weeks: Cell[][]) {
  const labels: { label: string; col: number }[] = []
  let last = -1

  weeks.forEach((week, col) => {
    const first = week.find((day): day is Day => day !== null)
    if (!first) return
    const month = new Date(first.date + 'T00:00:00').getMonth()
    if (month !== last) {
      labels.push({ label: MONTHS[month]!, col })
      last = month
    }
  })
  return labels
}

export function Contributions() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://github-contributions-api.jogruber.de/v4/${site.githubUser}?y=last`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status))
        return response.json() as Promise<Payload>
      })
      .then((data) => {
        const weeks = toWeeks(data.contributions)
        setState({
          status: 'ready',
          weeks,
          total: data.total.lastYear ?? 0,
          months: monthLabels(weeks),
        })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setState({ status: 'failed' })
      })

    return () => controller.abort()
  }, [])

  return (
    <section id="activity" className="brand-section brand-section--activity">
      <div className="brand-shell">
        <SectionHeading
          signal="Public build log"
          heading={github.heading}
          note={github.note}
          aside={<span className="meta">@{site.githubUser} / last 12 months</span>}
        />

        <motion.div
          className="activity-console"
          aria-busy={state.status === 'loading'}
        >
          <div className="brand-panel-bar">
            <span>github.com/{site.githubUser}/activity</span>
            <span>{state.status}</span>
          </div>
          <div className="activity-console__body">
          {state.status === 'loading' ? (
            <div className="activity-loading" aria-label="Loading contributions">
              <span />
              <span />
              <span />
            </div>
          ) : null}

          {state.status === 'failed' ? (
            <p className="py-10 text-center text-sm text-muted">
              Could not load the contribution graph.{' '}
              <a href={site.github} className="text-accent hover:underline">
                View it on GitHub
              </a>
              .
            </p>
          ) : null}

          {state.status === 'ready' ? (
            <>
              {/* The grid is decorative repetition; the count below is the real content. */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full" aria-hidden="true">
                  <div className="flex gap-[3px] pl-1">
                    {state.weeks.map((_, col) => {
                      const label = state.months.find((m) => m.col === col)
                      return (
                        <span
                          key={col}
                          className="meta relative h-4 w-[11px] shrink-0 text-[10px]"
                        >
                          {label ? (
                            <span className="absolute left-0 whitespace-nowrap">{label.label}</span>
                          ) : null}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex gap-[3px] pl-1">
                    {state.weeks.map((week, col) => (
                      <div key={col} className="flex shrink-0 flex-col gap-[3px]">
                        {week.map((day, row) =>
                          day ? (
                            <span
                              key={day.date}
                              title={`${day.count} on ${day.date}`}
                              className={`h-[11px] w-[11px] rounded-[2px] ${levelClass[day.level]}`}
                            />
                          ) : (
                            <span key={`pad-${col}-${row}`} className="h-[11px] w-[11px]" />
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <p className="text-sm text-ink-soft">
                  <span className="text-ink">{state.total}</span> contributions in the last year
                </p>

                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="meta">Less</span>
                  {levelClass.map((cls) => (
                    <span key={cls} className={`h-[11px] w-[11px] rounded-[2px] ${cls}`} />
                  ))}
                  <span className="meta">More</span>
                </div>
              </div>
            </>
          ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
