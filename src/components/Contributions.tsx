import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { github, site } from '../content/content'
import { rise } from '../lib/motion'

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
    <section id="activity" className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.h2 {...rise} className="display text-4xl md:text-5xl">
            {github.heading}
          </motion.h2>
          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.08 }}
            className="max-w-sm text-sm text-muted"
          >
            {github.note}
          </motion.p>
        </div>

        <motion.div
          {...rise}
          transition={{ ...rise.transition, delay: 0.12 }}
          className="mt-14 rounded-xl border border-line bg-surface p-6 md:p-8"
        >
          {state.status === 'loading' ? (
            <p className="meta py-10 text-center">Loading contributions</p>
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
        </motion.div>
      </div>
    </section>
  )
}
