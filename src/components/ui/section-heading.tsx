import type { ReactNode } from 'react'

type SectionHeadingProps = {
  heading: string
  note?: string
  signal: string
  aside?: ReactNode
}

/**
 * Shared brand-deck heading used across the portfolio.
 * The signal rail is intentionally consistent; the composition around it is not.
 */
export function SectionHeading({ heading, note, signal, aside }: SectionHeadingProps) {
  return (
    <header className="brand-section-heading">
      <div className="brand-section-heading__signal">
        <span aria-hidden="true" />
        <p>{signal}</p>
      </div>

      <h2 className="brand-section-heading__title display">{heading}</h2>

      {note ? <p className="brand-section-heading__note">{note}</p> : null}

      {aside ? <div className="brand-section-heading__aside">{aside}</div> : null}
    </header>
  )
}
