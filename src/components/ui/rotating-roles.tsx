import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Cycles through the roles one at a time — each fades/blurs in, holds, then
 * fades out before the next enters (mode="wait"). Under reduced motion it shows
 * a single static line instead.
 */
export function RotatingRoles({
  roles,
  className,
  interval = 2400,
}: {
  roles: string[]
  className?: string
  interval?: number
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || roles.length < 2) return
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % roles.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduced, roles.length, interval])

  if (reduced) {
    return <span className={className}>{roles.join(' · ')}</span>
  }

  return (
    <span className={className} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          className="inline-block"
          initial={{ opacity: 0, y: '0.4em', filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: '-0.4em', filter: 'blur(5px)' }}
          transition={{ duration: 0.45, ease }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
