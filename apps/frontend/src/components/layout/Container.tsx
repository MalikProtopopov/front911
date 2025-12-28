import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Container Component
 * Provides consistent max-width and horizontal padding across all breakpoints
 */

interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  as?: 'div' | 'section' | 'article' | 'main' | 'aside'
}

const maxWidthClasses = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1240px]',
  '2xl': 'max-w-[1440px]',
  full: 'max-w-full',
}

export function Container({ 
  children, 
  className,
  maxWidth = 'xl',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component 
      className={cn(
        'w-full mx-auto',
        'px-4 md:px-6 lg:px-8 xl:px-10',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Section Component with Container
 * Combines section spacing and container in one component
 */

interface SectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  bg?: 'primary' | 'secondary' | 'tertiary' | 'dark' | 'none'
  id?: string
}

const spacingClasses = {
  none: '',
  sm: 'py-8 md:py-12 lg:py-16',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-20 lg:py-24',
  xl: 'py-20 md:py-24 lg:py-32',
}

const bgClasses = {
  primary: 'bg-white',
  secondary: 'bg-[var(--background-secondary)]',
  tertiary: 'bg-[var(--background-tertiary)]',
  dark: 'bg-[var(--background-dark)] text-white',
  none: '',
}

export function Section({ 
  children, 
  className,
  containerClassName,
  maxWidth = 'xl',
  spacing = 'md',
  bg = 'none',
  id,
}: SectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        spacingClasses[spacing],
        bgClasses[bg],
        className
      )}
    >
      <Container maxWidth={maxWidth} className={containerClassName}>
        {children}
      </Container>
    </section>
  )
}

