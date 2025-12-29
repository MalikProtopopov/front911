/**
 * Related Cities Component
 * Internal linking block for SEO - shows cities where a service is available
 */

import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface City {
  slug: string
  title: string
}

interface RelatedCitiesProps {
  cities: City[]
  serviceSlug?: string
  serviceName?: string
  maxItems?: number
}

export function RelatedCities({
  cities,
  serviceSlug,
  serviceName,
  maxItems = 8,
}: RelatedCitiesProps) {
  if (!cities || cities.length === 0) return null

  const displayCities = cities.slice(0, maxItems)
  const hasMore = cities.length > maxItems

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        {serviceName ? `${serviceName} в городах:` : 'Популярные города:'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayCities.map((city) => (
          <Link
            key={city.slug}
            href={serviceSlug 
              ? `/cities/${city.slug}/services/${serviceSlug}`
              : `/cities/${city.slug}`
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-full text-sm font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            {city.title}
          </Link>
        ))}
        {hasMore && (
          <Link
            href="/cities"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-primary)]/20 transition-colors"
          >
            +{cities.length - maxItems} городов
          </Link>
        )}
      </div>
    </div>
  )
}

