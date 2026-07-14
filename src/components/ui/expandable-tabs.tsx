import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

import { useOutsideClick } from '../../hooks/use-outside-click'
import { cn } from '@/lib/utils'

export interface Tab {
  title: string
  icon: LucideIcon
  type?: never
}

export interface TabSeparator {
  type: 'separator'
  title?: never
  icon?: never
}

export type TabItem = Tab | TabSeparator

interface ExpandableTabsProps {
  tabs: TabItem[]
  className?: string
  activeColor?: string
  onChange?: (index: number | null) => void
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: '.6rem',
    paddingRight: '.6rem',
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? '.45rem' : 0,
    paddingLeft: isSelected ? '.9rem' : '.6rem',
    paddingRight: isSelected ? '.9rem' : '.6rem',
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.06, type: 'spring', bounce: 0, duration: 0.45 } as const

export function ExpandableTabs({
  tabs,
  className,
  activeColor = 'text-accent',
  onChange,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null)
  const outsideClickRef = React.useRef<HTMLDivElement>(null)

  const clearSelection = React.useCallback(() => {
    setSelected(null)
    onChange?.(null)
  }, [onChange])

  useOutsideClick(outsideClickRef, clearSelection)

  const handleSelect = (index: number) => {
    setSelected(index)
    onChange?.(index)
  }

  return (
    <div ref={outsideClickRef} className={cn('expandable-tabs', className)}>
      {tabs.map((tab, index) => {
        if (tab.type === 'separator') {
          return <span key={`separator-${index}`} className="expandable-tabs__separator" aria-hidden="true" />
        }

        const Icon = tab.icon
        const isSelected = selected === index

        return (
          <motion.button
            key={tab.title}
            type="button"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            data-selected={isSelected}
            aria-label={tab.title}
            aria-pressed={isSelected}
            title={tab.title}
            className={cn(
              'expandable-tabs__button',
              isSelected ? activeColor : 'expandable-tabs__button--idle',
            )}
          >
            <Icon aria-hidden="true" />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="expandable-tabs__label"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
