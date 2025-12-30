/**
 * City Card Component
 * Unified card for city listings across all pages
 */

import * as React from 'react'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './card'
import type { CityList } from '@/lib/api/generated'

/* =============================================================================
   CITY CARD - Unified city card component
============================================================================= */

export interface CityCardProps {
  /** City object from API */
  city: CityList | { title?: string; name?: string; slug: string }
  /** Override the default href */
  href?: string
  /** Additional className */
  className?: string
  /** Show services count badge (if available) */
  showServicesCount?: boolean
}

export function CityCard({
  city,
  href,
  className,
  showServicesCount = false,
}: CityCardProps) {
  // Handle both API formats (title vs name)
  const title = 'title' in city && city.title ? city.title : ('name' in city ? city.name : '')
  const slug = city.slug
  const finalHref = href || `/cities/${slug}`
  
  // Get services count if available
  const servicesCount = 'services_count' in city ? (city as CityList & { services_count?: number }).services_count : undefined

  return (
    <Link href={finalHref} className="group block cursor-pointer">
      <Card 
        className={cn(
          'hover:shadow-lg hover:border-[var(--color-primary)]/30',
          'transition-all duration-200',
          'border-[var(--border)]',
          'h-full flex',
          className
        )}
      >
        <CardContent className="flex items-center gap-3 h-full w-full p-4 md:p-5">
          {/* Icon */}
          <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="font-medium text-base md:text-lg text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors block truncate">
              {title}
            </span>
            {showServicesCount && servicesCount !== undefined && (
              <span className="text-sm text-[var(--foreground-secondary)]">
                {servicesCount} услуг
              </span>
            )}
          </div>
          
          {/* Chevron */}
          <ChevronRight 
            className={cn(
              'w-5 h-5',
              'text-[var(--foreground-tertiary)] opacity-70',
              'group-hover:text-[var(--color-primary)]',
              'group-hover:opacity-100',
              'group-hover:translate-x-1',
              'transition-all duration-200',
              'flex-shrink-0'
            )}
            strokeWidth={2.5}
          />
        </CardContent>
      </Card>
    </Link>
  )
}

/* =============================================================================
   CITY ROW - Alternative row-style for lists (alias)
============================================================================= */

export const CityRow = CityCard
export type CityRowProps = CityCardProps

