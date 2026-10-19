import { useEffect, useState } from 'react'

import HalftoneWordmarkFooter, { type FooterColumn } from './ui/halftone-wordmark-footer'
import { site } from '../content/content'
import { scrollToSection } from '../lib/useSmoothScroll'

const columns: FooterColumn[] = [
  {
    title: 'Navigate',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experience' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Certificates', href: '#certificates' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'GitHub', href: site.github },
      { label: 'LinkedIn', href: site.linkedin },
      { label: 'Email', href: `mailto:${site.email}` },
    ],
  },
]

/** Below 768px the nav is a pill floating over the bottom of the screen. */
const PILL_NAV = '(max-width: 767px)'

function usePillNav() {
  const [pill, setPill] = useState(() => window.matchMedia(PILL_NAV).matches)
  useEffect(() => {
    const mq = window.matchMedia(PILL_NAV)
    const sync = () => setPill(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return pill
}

/** The site's own tokens (--color-bone / ink / accent) and faces, so the footer reads as part of the page. */
export function SiteFooter() {
  const pill = usePillNav()

  return (
    // On phones, leave room under the footer for the nav pill so it never sits on the wordmark.
    <div className="relative z-10 bg-bone pb-24 md:pb-0">
      <HalftoneWordmarkFooter
        wordmark="Azuela"
        label={site.name}
        meta={`© ${new Date().getFullYear()} · ${site.location}`}
        columns={columns}
        onBackToTop={() => scrollToSection('#top')}
        palette={{ background: '#0a0a0b', ink: '#edebe6', warm: '#e5484d' }}
        fontFamily="'Geist Variable', 'Helvetica Neue', sans-serif"
        monoFamily="'Geist Mono Variable', 'SF Mono', monospace"
        // The word is sized to the width, so on a phone it is short: show all of it rather than cropping.
        crop={pill ? 0 : 0.2}
        height="clamp(420px, 46vw, 640px)"
      />
    </div>
  )
}
