/**
 * Section Header Component
 * Consistent section headers across the application
 */

import { cn } from '@/lib/utils'
import { Heading, Lead } from './typography'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'w-full max-w-3xl flex flex-col gap-5 md:gap-6 lg:gap-8',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <Heading
        level="h2"
        align={align}
        className={titleClassName}
      >
        {title}
      </Heading>
      {subtitle && (
        <Lead align={align} className={subtitleClassName}>
          {subtitle}
        </Lead>
      )}
    </div>
  )
}

/* =============================================================================
   PAGE HEADER - For page titles (larger, with breadcrumb support)
============================================================================= */

export interface PageHeaderProps {
  title: string
  subtitle?: string
  id?: string
  className?: string
  align?: 'left' | 'center'
}

export function PageHeader({ title, subtitle, id, className, align = 'left' }: PageHeaderProps) {
  return (
    <div 
      className={cn(
        'max-w-3xl mt-8 min-w-0',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <Heading 
        level="h1" 
        id={id}
        align={align}
        className="mb-6 scroll-mt-[120px]"
      >
        {title}
      </Heading>
      {subtitle && (
        <p 
          className={cn(
            'text-base md:text-lg text-[var(--foreground-secondary)] leading-relaxed',
            align === 'center' && 'text-center',
            align === 'left' && 'text-left'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

