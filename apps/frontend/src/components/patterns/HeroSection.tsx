import * as React from 'react'
import { Breadcrumbs, PageHeader, type BreadcrumbItem } from '@/components/ui'
import { cn } from '@/lib/utils'

/* =============================================================================
   HERO SECTION COMPONENT
   Unified hero section for all pages with breadcrumbs and title
============================================================================= */

export interface HeroSectionProps {
  /** Section ID for navigation and styling */
  id: string
  /** Page title */
  title: string
  /** Page subtitle/description */
  subtitle?: string
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[]
  /** Center text alignment */
  centered?: boolean
  /** Container max width */
  containerSize?: 'default' | 'narrow' | 'wide'
  /** Additional content (quick stats, etc.) */
  children?: React.ReactNode
  /** Additional class names for section */
  className?: string
}

export function HeroSection({
  id,
  title,
  subtitle,
  breadcrumbs,
  centered = false,
  containerSize = 'default',
  children,
  className,
}: HeroSectionProps) {
  const containerClasses = {
    default: 'container mx-auto px-4',
    narrow: 'container mx-auto px-4 max-w-3xl',
    wide: 'container mx-auto px-4 max-w-7xl',
  }

  return (
    <section 
      id={id}
      className={cn(
        'hero-section',
        className
      )}
    >
      <div className={cn(containerClasses[containerSize], centered && 'text-center')}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs 
            items={breadcrumbs}
            className={centered ? 'justify-center' : undefined}
          />
        )}
        
        <PageHeader
          id={`${id.replace('-hero-section', '')}-heading`}
          title={title}
          subtitle={subtitle}
          align={centered ? 'center' : 'left'}
        />
        
        {children && (
          <div className="hero-section__content">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

