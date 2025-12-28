/**
 * Link Button Components
 * Consistent link styles with icons and arrows
 */

import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* =============================================================================
   LINK WITH ARROW - "Подробнее" style links
============================================================================= */

const linkWithArrowVariants = cva(
  'inline-flex items-center font-medium transition-all group',
  {
    variants: {
      variant: {
        default: 'text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]',
        secondary: 'text-[var(--foreground)] hover:text-[var(--color-primary)]',
        muted: 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]',
        inverse: 'text-white hover:text-white/80',
      },
      size: {
        sm: 'text-sm gap-1',
        md: 'text-base gap-1.5',
        lg: 'text-lg gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const arrowSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export interface LinkWithArrowProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkWithArrowVariants> {
  href: string
  icon?: 'arrow' | 'chevron'
  iconPosition?: 'left' | 'right'
  external?: boolean
}

export function LinkWithArrow({
  className,
  href,
  variant,
  size = 'md',
  icon = 'arrow',
  iconPosition = 'right',
  external = false,
  children,
  ...props
}: LinkWithArrowProps) {
  const Icon = icon === 'chevron' ? ChevronRight : ArrowRight
  const iconClass = cn(
    arrowSizes[size ?? 'md'],
    'transition-transform group-hover:translate-x-1'
  )

  const content = (
    <>
      {iconPosition === 'left' && <Icon className={iconClass} />}
      <span>{children}</span>
      {iconPosition === 'right' && <Icon className={iconClass} />}
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkWithArrowVariants({ variant, size }), className)}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(linkWithArrowVariants({ variant, size }), className)}
      {...props}
    >
      {content}
    </Link>
  )
}

/* =============================================================================
   BACK LINK - "← Назад" style links
============================================================================= */

export interface BackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function BackLink({ href, children, className, ...props }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors group',
        className
      )}
      {...props}
    >
      <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
      <span>{children}</span>
    </Link>
  )
}

/* =============================================================================
   TEXT LINK - Simple inline link
============================================================================= */

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  external?: boolean
}

export function TextLink({ href, external, className, children, ...props }: TextLinkProps) {
  const classes = cn(
    'text-[var(--color-primary)] hover:underline underline-offset-4 transition-colors',
    className
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  )
}

