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
