/**
 * City Grid Component
 * Unified grid of city cards, reusable on all pages
 */

'use client'

import { CityCard } from './city-card'
import type { CityList } from '@/lib/api/generated'

export interface CityGridProps {
  /** Array of cities to display */
  cities: CityList[]
  /** Number of columns on desktop (default: 4) */
  columns?: 2 | 3 | 4 | 5
  /** Base URL pattern for city links (default: /cities/{slug}) */
  baseHref?: string
  /** Custom href builder function */
  getHref?: (city: CityList) => string
  /** Additional className for the container */
  className?: string
  /** Show services count in cards */
  showServicesCount?: boolean
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
}

export function CityGrid({
  cities,
  columns = 4,
  baseHref = '/cities',
  getHref,
  className,
  showServicesCount = false,
}: CityGridProps) {
  if (cities.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className={`grid ${columnClasses[columns]} gap-3 md:gap-4`}>
        {cities.map((city) => {
          const href = getHref 
            ? getHref(city) 
            : `${baseHref}/${city.slug}`
          
          return (
            <CityCard
              key={city.slug}
              city={city}
              href={href}
              showServicesCount={showServicesCount}
            />
          )
        })}
      </div>
    </div>
  )
}

