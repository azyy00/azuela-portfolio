'use client'

import { forwardRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

type HeroScrollAnimationProps = {
  children: ReactNode
  className?: string
}

/**
 * Gives each page section a short pop-up reveal whenever it re-enters the
 * viewport. Unlike the previous continuous rotation, it settles to a static
 * layer so section edges remain seamless and scrolling stays responsive.
 */
const HeroScrollAnimation = forwardRef<HTMLDivElement, HeroScrollAnimationProps>(
  ({ children, className }, forwardedRef) => {
    const reducedMotion = useReducedMotion()

    return (
      <motion.div
        ref={forwardedRef}
        className={cn('page-scroll-effect', className)}
        initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.08, margin: '0px 0px -5% 0px' }}
        transition={{
          duration: reducedMotion ? 0 : 0.56,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    )
  },
)

HeroScrollAnimation.displayName = 'HeroScrollAnimation'

export default HeroScrollAnimation
