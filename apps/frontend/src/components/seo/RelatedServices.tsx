/**
 * Related Services Component
 * Internal linking block for SEO - shows services available in a city
 */

import Link from 'next/link'
import { Wrench } from 'lucide-react'

interface Service {
  slug: string
  title: string
}

interface RelatedServicesProps {
  services: Service[]
  citySlug?: string
  cityName?: string
  maxItems?: number
}

export function RelatedServices({
  services,
  citySlug,
  cityName,
  maxItems = 8,
}: RelatedServicesProps) {
  if (!services || services.length === 0) return null

  const displayServices = services.slice(0, maxItems)

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
        {cityName ? `Услуги в ${cityName}:` : 'Доступные услуги:'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayServices.map((service) => (
          <Link
            key={service.slug}
            href={citySlug 
              ? `/cities/${citySlug}/services/${service.slug}`
              : `/services/${service.slug}`
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-full text-sm font-medium transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" />
            {service.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

