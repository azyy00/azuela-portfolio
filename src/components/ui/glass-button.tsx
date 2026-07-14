import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const glassButtonVariants = cva(
  'glass-button relative isolate cursor-pointer rounded-full transition-all',
  {
    variants: {
      size: {
        default: 'text-base font-medium',
        sm: 'text-sm font-medium',
        lg: 'text-lg font-medium',
        icon: 'h-10 w-10',
      },
      variant: {
        default: '',
        accent: 'glass-button--accent',
        ghost: 'glass-button--ghost',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
)

const glassButtonTextVariants = cva(
  'glass-button-text relative block select-none tracking-tighter',
  {
    variants: {
      size: {
        default: 'px-6 py-3.5',
        sm: 'px-4 py-2',
        lg: 'px-8 py-4',
        icon: 'flex h-10 w-10 items-center justify-center',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type GlassButtonStyleProps = VariantProps<typeof glassButtonVariants> & {
  contentClassName?: string
}

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    GlassButtonStyleProps {}

export interface GlassButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    GlassButtonStyleProps {}

function GlassButtonShadow() {
  return <span className="glass-button-shadow" aria-hidden="true" />
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, variant, contentClassName, ...props }, ref) => {
    return (
      <span className={cn('glass-button-wrap', className)}>
        <button
          className={cn(glassButtonVariants({ size, variant }))}
          ref={ref}
          data-variant={variant ?? 'default'}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <GlassButtonShadow />
      </span>
    )
  },
)
GlassButton.displayName = 'GlassButton'

const GlassButtonLink = React.forwardRef<HTMLAnchorElement, GlassButtonLinkProps>(
  ({ className, children, size, variant, contentClassName, ...props }, ref) => {
    return (
      <span className={cn('glass-button-wrap', className)}>
        <a
          className={cn(glassButtonVariants({ size, variant }))}
          ref={ref}
          data-variant={variant ?? 'default'}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </a>
        <GlassButtonShadow />
      </span>
    )
  },
)
GlassButtonLink.displayName = 'GlassButtonLink'

export { GlassButton, GlassButtonLink, glassButtonVariants }
