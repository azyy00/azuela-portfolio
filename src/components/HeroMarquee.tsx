import { skills } from '../content/content'
import { BrandIcon, brandIcon, skillColor, skillIcon } from '../lib/skillIcons'
import { PerspectiveMarquee } from './ui/perspective-marquee'

// Every skill in the stack, flattened into one scrolling strip.
const items = skills.groups.flatMap((group) => group.items)

export function HeroMarquee() {
  return (
    <section className="hero-marquee relative z-10" aria-label="Tools and technologies">
      <PerspectiveMarquee speed={40} rotateY={-16} rotateX={7} perspective={1200}>
        {items.map((item) => {
          const Icon = skillIcon(item)
          const brand = brandIcon(item)
          return (
            <span
              key={item}
              className="hero-marquee__item"
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
            </span>
          )
        })}
      </PerspectiveMarquee>
    </section>
  )
}
