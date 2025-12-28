/**
 * Badge Components
 * For labels, tags, and status indicators
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* =============================================================================
   BADGE - Small labels and tags
============================================================================= */

const badgeVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white',
        secondary: 'bg-[var(--color-secondary)] text-white',
        success: 'bg-[var(--color-success)] text-white',
        error: 'bg-[var(--color-error)] text-white',
        accent: 'bg-[var(--color-accent)] text-[var(--foreground)]',
        // Soft/light variants
        'primary-soft': 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
        'secondary-soft': 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]',
        'success-soft': 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
        'error-soft': 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
        'accent-soft': 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]',
        // Outline variants
        outline: 'border-2 border-current bg-transparent',
        'outline-primary': 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded',
        md: 'px-3 py-1 text-sm rounded-md',
        lg: 'px-4 py-1.5 text-sm rounded-lg',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary-soft',
      size: 'md',
      shape: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

/* =============================================================================
   STATUS BADGE - For status indicators with dot
============================================================================= */

const statusColors = {
  online: 'bg-[var(--color-success)]',
  offline: 'bg-gray-400',
  busy: 'bg-[var(--color-error)]',
  away: 'bg-[var(--color-accent)]',
}

export interface StatusBadgeProps {
  status: keyof typeof statusColors
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm',
        className
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          statusColors[status]
        )}
      />
      {label && <span className="text-[var(--foreground-secondary)]">{label}</span>}
    </span>
  )
}

/* =============================================================================
   FEATURE BADGE - 24/7, New, etc.
============================================================================= */

export interface FeatureBadgeProps {
  children: React.ReactNode
  className?: string
}

export function FeatureBadge({ children, className }: FeatureBadgeProps) {
  return (
    <span
      className={cn(
        'px-4 py-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full font-semibold text-sm',
        className
      )}
    >
      {children}
    </span>
  )
}

