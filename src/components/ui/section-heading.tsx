import type { ReactNode } from 'react'

type SectionHeadingProps = {
  heading: ReactNode
  note?: string
  signal: string
  /** Two-digit dossier index shown large in accent, e.g. "01". */
  index?: string
  aside?: ReactNode
}

/**
 * Shared section banner: a bold dossier-style masthead — big accent index,
 * heavy uppercase title, hatch rule, and a mono unit label — ruled top and
 * bottom. One system across every section.
 */
export function SectionHeading({ heading, note, signal, index, aside }: SectionHeadingProps) {
  return (
    <header className="brand-banner">
      <div className="brand-banner__bar">
        {index ? (
          <span className="brand-banner__index" aria-hidden="true">
            {index}
          </span>
        ) : null}
        <h2 className="brand-banner__title">{heading}</h2>
        <span className="brand-banner__hatch" aria-hidden="true" />
        <span className="brand-banner__unit">{signal}</span>
      </div>

      {note || aside ? (
        <div className="brand-banner__sub">
          {note ? <p className="brand-banner__note">{note}</p> : null}
          {aside ? <div className="brand-banner__aside">{aside}</div> : null}
        </div>
      ) : null}
    </header>
  )
}
