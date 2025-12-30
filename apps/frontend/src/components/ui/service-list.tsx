/**
 * Service List Component
 * Unified list of service cards, reusable on all pages
 */

'use client'

import { ServiceRow } from './service-card'
import { getServiceIcon } from '@/app/services/serviceIcons'
import type { ServiceList as ServiceListType } from '@/lib/api/generated'

export interface ServiceListProps {
  /** Array of services to display */
  services: ServiceListType[]
  /** Base URL pattern for service links (default: /services/{slug}) */
  baseHref?: string
  /** Custom href builder function */
  getHref?: (service: ServiceListType) => string
  /** Additional className for the container */
  className?: string
}

export function ServiceList({
  services,
  baseHref = '/services',
  getHref,
  className,
}: ServiceListProps) {
  if (services.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 md:gap-4">
        {services.map((service, index) => {
          const href = getHref 
            ? getHref(service) 
            : `${baseHref}/${service.slug}`
          
          return (
            <ServiceRow
              key={service.slug}
              service={service}
              icon={getServiceIcon(service.slug, service.icon_url)}
              href={href}
              isLast={index === services.length - 1}
            />
          )
        })}
      </div>
    </div>
  )
}

