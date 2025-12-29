/**
 * Section Component
 * Unified section wrapper with consistent spacing and background options
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section ID for navigation */
  id?: string
  /** Background variant */
  bg?: 'white' | 'secondary' | 'tertiary' | 'primary' | 'dark' | 'gradient'
  /** Vertical spacing size */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Container max width */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none'
}

const bgClasses: Record<NonNullable<SectionProps['bg']>, string> = {
  white: 'bg-white',
  secondary: 'bg-[var(--background-secondary)]',
  tertiary: 'bg-[var(--background-tertiary)]',
  primary: 'bg-[var(--color-primary)] text-white',
  dark: 'bg-[var(--background-dark)] text-white',
  gradient: 'bg-gradient-to-b from-white to-[var(--background-secondary)]',
}

const spacingClasses: Record<NonNullable<SectionProps['spacing']>, string> = {
  none: '',
  sm: 'section-spacing-sm',
  md: 'section-spacing-md',
  lg: 'section-spacing-lg',
  xl: 'section-spacing-xl',
}

const containerClasses: Record<NonNullable<SectionProps['containerSize']>, string> = {
  sm: 'container container-sm',
  md: 'container container-md',
  lg: 'container container-lg',
  xl: 'container',
  '2xl': 'container container-2xl',
  full: 'container container-full',
  none: '',
}

export function Section({ 
  id, 
  bg = 'white', 
  spacing = 'lg',
  containerSize = 'xl',
  className, 
  children, 
  ...props 
}: SectionProps) {
  const content = containerSize === 'none' 
    ? children 
    : <div className={containerClasses[containerSize]}>{children}</div>

  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        bgClasses[bg],
        className
      )}
      {...props}
    >
      {content}
    </section>
  )
}

