import {
  BriefcaseBusiness,
  Code2,
  House,
  Mail,
  ArrowUpRight,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

import { nav, site } from '../content/content'
import { ExpandableTabs, type TabItem } from './ui/expandable-tabs'
import { GlassButtonLink } from './ui/glass-button'

const icons: Record<string, LucideIcon> = {
  '#top': House,
  '#work': BriefcaseBusiness,
  '#skills': Code2,
  '#experience': Trophy,
  '#about': UserRound,
  '#contact': Mail,
}

const expandableTabs: TabItem[] = [
  { title: 'Work', icon: BriefcaseBusiness },
  { title: 'Skills', icon: Code2 },
  { type: 'separator' },
  { title: 'Experience', icon: Trophy },
  { title: 'About', icon: UserRound },
  { type: 'separator' },
  { title: 'Contact', icon: Mail },
]

const tabLinks: Array<string | null> = [
  '#work',
  '#skills',
  null,
  '#experience',
  '#about',
  null,
  '#contact',
]

export function Nav() {
  const mobileItems = [{ label: 'Home', href: '#top' }, ...nav]

  return (
    <header className="site-nav">
      <a href="#top" className="site-nav__logo" aria-label={`${site.name} home`}>
        Azzy
      </a>

      <nav className="site-nav__bar" aria-label="Primary navigation">
        <ExpandableTabs
          tabs={expandableTabs}
          className="site-nav__tabs"
          activeColor="text-accent"
          onChange={(index) => {
            const href = index === null ? null : tabLinks[index]
            if (href) window.location.hash = href
          }}
        />
      </nav>

      <GlassButtonLink href="#contact" className="site-nav__hire" size="sm">
        <span>Hire me</span>
        <ArrowUpRight aria-hidden="true" />
      </GlassButtonLink>

      <nav className="site-nav__dock" aria-label="Quick navigation">
        {mobileItems.map((item, index) => {
          const Icon = icons[item.href] ?? Code2
          const active = index === 0

          return (
            <a
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`site-nav__dock-item${active ? ' site-nav__dock-item--active' : ''}`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
            >
              <Icon aria-hidden="true" />
              {active ? <span>{item.label}</span> : null}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
