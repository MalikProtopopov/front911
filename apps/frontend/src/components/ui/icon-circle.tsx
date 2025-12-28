/**
 * Icon Circle Component
 * Consistent icon containers with colored backgrounds
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconCircleVariants = cva(
  'rounded-full flex items-center justify-center flex-shrink-0 transition-transform',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white',
        secondary: 'bg-[var(--color-secondary)] text-white',
        success: 'bg-[var(--color-success)] text-white',
        accent: 'bg-[var(--color-accent)] text-[var(--foreground)]',
        'primary-soft': 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
        'secondary-soft': 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]',
        'success-soft': 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
        muted: 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)]',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
        '2xl': 'w-20 h-20',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      shadow: 'none',
    },
  }
)

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
}

export interface IconCircleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconCircleVariants> {
  icon: React.ReactNode
  hoverScale?: boolean
}

export function IconCircle({
  className,
  variant,
  size = 'lg',
  shadow,
  icon,
  hoverScale = false,
  ...props
}: IconCircleProps) {
  return (
    <div
      className={cn(
        iconCircleVariants({ variant, size, shadow }),
        hoverScale && 'group-hover:scale-110',
        className
      )}
      {...props}
    >
      <div className={cn(iconSizes[size ?? 'lg'], '[&>svg]:w-full [&>svg]:h-full')}>
        {icon}
      </div>
    </div>
  )
}

/* =============================================================================
   NUMBERED CIRCLE - For step indicators
============================================================================= */

export interface NumberedCircleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof iconCircleVariants> {
  number: number
}

export function NumberedCircle({
  className,
  variant = 'primary',
  size = 'md',
  number,
  ...props
}: NumberedCircleProps) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  }

  return (
    <div
      className={cn(
        iconCircleVariants({ variant, size }),
        'font-bold',
        textSizes[size ?? 'md'],
        className
      )}
      {...props}
    >
      {number}
    </div>
  )
}

