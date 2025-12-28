/**
 * Typography Components
 * Consistent text styling across the application
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* =============================================================================
   HEADING COMPONENT
============================================================================= */

const headingVariants = cva(
  'font-heading font-bold leading-tight text-[var(--color-secondary)]',
  {
    variants: {
      level: {
        h1: 'text-4xl md:text-5xl lg:text-6xl',
        h2: 'text-3xl md:text-4xl lg:text-5xl',
        h3: 'text-2xl md:text-3xl',
        h4: 'text-xl md:text-2xl',
        h5: 'text-lg md:text-xl',
        h6: 'text-base md:text-lg',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      level: 'h2',
      align: 'left',
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function Heading({
  className,
  level = 'h2',
  align,
  as,
  children,
  ...props
}: HeadingProps) {
  const Component = as ?? level ?? 'h2'
  
  return (
    <Component
      className={cn(headingVariants({ level, align }), className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/* =============================================================================
   TEXT COMPONENT
============================================================================= */

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    textColor: {
      default: 'text-[var(--foreground)]',
      secondary: 'text-[var(--foreground-secondary)]',
      primary: 'text-[var(--color-primary)]',
      success: 'text-[var(--color-success)]',
      error: 'text-[var(--color-error)]',
      inverse: 'text-white',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    textColor: 'default',
    align: 'left',
  },
})

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

export function Text({
  className,
  size,
  weight,
  textColor,
  align,
  as: Component = 'p',
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ size, weight, textColor, align }), className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/* =============================================================================
   LEAD TEXT - For subtitles and intro paragraphs
============================================================================= */

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  align?: 'left' | 'center' | 'right'
}

export function Lead({ className, align = 'left', children, ...props }: LeadProps) {
  return (
    <p
      className={cn(
        'text-lg md:text-xl text-[var(--foreground-secondary)] leading-relaxed',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

