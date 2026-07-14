import { Marquee } from './ui/marquee'
import { skills } from '../content/content'
import { BrandIcon, brandIcon, skillColor, skillIcon } from '../lib/skillIcons'

// Every skill in the stack, flattened into one scrolling strip.
const items = skills.groups.flatMap((group) => group.items)

export function HeroMarquee() {
  return (
    <div className="relative z-10 border-y border-line bg-surface/40 py-4">
      <Marquee speed={45}>
        {items.map((item) => {
          const Icon = skillIcon(item)
          const brand = brandIcon(item)
          return (
            <span
              key={item}
              className="mx-5 inline-flex shrink-0 items-center gap-2 font-mono text-xs tracking-widest text-ink-soft uppercase"
            >
              {brand ? (
                <BrandIcon icon={brand} />
              ) : (
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: skillColor(item) }}
                  aria-hidden="true"
                />
              )}
              {item}
              <span className="ml-5 text-line" aria-hidden="true">
                /
              </span>
            </span>
          )
        })}
      </Marquee>
    </div>
  )
}
