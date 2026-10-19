import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { github, site } from '../content/content'
import ContributionSkyline, { type ContributionDay } from './ui/contribution-skyline'
import { SectionHeading } from './ui/section-heading'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Payload = { total: Record<string, number>; contributions: Day[] }

type State =
  | { status: 'loading' }
  | { status: 'ready'; days: ContributionDay[] }
  | { status: 'failed' }

/** The site's accent ramp (--color-level-1..4); the empty step comes from the card surface. */
const SKYLINE_PALETTE = ['#3a1c1e', '#6e2b2f', '#ad3a3f', '#e5484d']

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
        setState({
          status: 'ready',
          days: data.contributions.map(({ date, count }) => ({ date, count })),
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
          index="03"
          signal="Public build log"
          heading={
            <>
              Recent <em className="sh-accent">Activity</em>
            </>
          }
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
            <ContributionSkyline
              data={state.days}
              palette={SKYLINE_PALETTE}
              className="activity-skyline"
            />
          ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
