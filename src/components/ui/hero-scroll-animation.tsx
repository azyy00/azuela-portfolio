'use client'

import { forwardRef, useRef, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'motion/react'

import { cn } from '@/lib/utils'

type HeroScrollAnimationProps = {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right'
}

/**
 * Applies the supplied scale-and-rotate scroll treatment to an outer page
 * section. The section's own content and layout remain completely untouched.
 */
const HeroScrollAnimation = forwardRef<HTMLDivElement, HeroScrollAnimationProps>(
  ({ children, className, direction = 'right' }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()
    const sign = direction === 'right' ? 1 : -1
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start end', 'end start'],
    })

    const scale = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.965, 1, 1, 0.94])
    const rotate = useTransform(
      scrollYProgress,
      [0, 0.16, 0.84, 1],
      [1.6 * sign, 0, 0, -1.8 * sign],
    )
    const y = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [36, 0, 0, -28])

    const style: MotionStyle | undefined = reducedMotion
      ? undefined
      : { scale, rotate, y, transformPerspective: 1400 }

    return (
      <motion.div
        ref={(node) => {
          containerRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        className={cn('page-scroll-effect', className)}
        style={style}
      >
        {children}
      </motion.div>
    )
  },
)

HeroScrollAnimation.displayName = 'HeroScrollAnimation'

export default HeroScrollAnimation
