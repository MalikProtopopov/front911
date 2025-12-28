/**
 * Grid Components
 * Consistent grid layouts across the application
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* =============================================================================
   GRID - Responsive grid layout
============================================================================= */

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    },
    gap: {
      sm: 'gap-4 md:gap-6',
      md: 'gap-6 md:gap-8',
      lg: 'gap-8 md:gap-10 lg:gap-12',
      xl: 'gap-10 md:gap-12 lg:gap-16',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, gap, children, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props}>
      {children}
    </div>
  )
}

/* =============================================================================
   SECTION - Consistent section wrapper
============================================================================= */

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  bg?: 'white' | 'secondary' | 'primary' | 'gradient'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Section({ 
  id, 
  bg = 'white', 
  spacing = 'lg',
  className, 
  children, 
  ...props 
}: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    secondary: 'bg-[var(--background-secondary)]',
    primary: 'bg-[var(--color-primary)] text-white',
    gradient: 'bg-gradient-to-b from-white to-[var(--background-secondary)]',
  }
  
  const spacingClasses = {
    sm: 'section-spacing-sm',
    md: 'section-spacing-md',
    lg: 'section-spacing-lg',
    xl: 'section-spacing-xl',
  }

  return (
    <section
      id={id}
      className={cn(spacingClasses[spacing], bgClasses[bg], className)}
      {...props}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}

/* =============================================================================
   TWO COLUMN LAYOUT - Common pattern for content + sidebar
============================================================================= */

export interface TwoColumnLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: 'narrow' | 'default' | 'wide'
  className?: string
}

export function TwoColumnLayout({
  children,
  sidebar,
  sidebarPosition = 'right',
  sidebarWidth = 'default',
  className,
}: TwoColumnLayoutProps) {
  const widthClasses = {
    narrow: 'lg:col-span-1',
    default: 'lg:col-span-1',
    wide: 'lg:col-span-2',
  }

  const mainWidthClasses = {
    narrow: 'lg:col-span-3',
    default: 'lg:col-span-2',
    wide: 'lg:col-span-2',
  }

  return (
    <div className={cn('grid lg:grid-cols-3 gap-8 lg:gap-12', className)}>
      {sidebarPosition === 'left' && (
        <aside className={widthClasses[sidebarWidth]}>{sidebar}</aside>
      )}
      <main className={mainWidthClasses[sidebarWidth]}>{children}</main>
      {sidebarPosition === 'right' && (
        <aside className={widthClasses[sidebarWidth]}>
          <div className="sticky top-24 pt-8 md:pt-12">{sidebar}</div>
        </aside>
      )}
    </div>
  )
}

/* =============================================================================
   FLEX STACK - Vertical stack with consistent spacing
============================================================================= */

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export function Stack({ gap = 'md', align = 'stretch', className, children, ...props }: StackProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  return (
    <div
      className={cn('flex flex-col', gapClasses[gap], alignClasses[align], className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* =============================================================================
   FLEX ROW - Horizontal flex with consistent spacing
============================================================================= */

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
}

export function Row({
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...props
}: RowProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div
      className={cn(
        'flex',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

