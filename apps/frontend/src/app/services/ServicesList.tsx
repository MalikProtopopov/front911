'use client'

import { Section, ServiceRow } from "@/components/ui"
import { useServices } from "@/lib/api/hooks"
import { SkeletonServiceCard } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { getServiceIcon } from "./serviceIcons"
import type { ServiceList } from "@/lib/api/generated"

interface ServicesListProps {
  initialServices?: ServiceList[]
}

export function ServicesList({ initialServices = [] }: ServicesListProps) {
  // Use SWR with server-provided initial data for hydration
  const { services, isLoading, isError, error, mutate } = useServices(
    undefined,
    { fallbackData: initialServices.length > 0 ? initialServices : undefined }
  )

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && initialServices.length === 0

  if (showLoading) {
    return (
      <Section spacing="lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonServiceCard key={i} />
            ))}
          </div>
        </div>
      </Section>
    )
  }

  if (isError) {
    return (
      <Section spacing="xl">
        <ErrorMessage 
          title="Не удалось загрузить услуги"
          message={error instanceof Error ? error.message : "Попробуйте обновить страницу"}
          showRetry
          onRetry={() => mutate()}
        />
      </Section>
    )
  }

  if (services.length === 0) {
    return (
      <Section spacing="xl">
        <EmptyState
          title="Услуги не найдены"
          description="На данный момент услуги недоступны. Попробуйте обновить страницу позже."
        />
      </Section>
    )
  }

  return (
    <Section spacing="lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-3 md:gap-4">
          {services.map((service, index) => (
            <ServiceRow
              key={service.slug}
              service={service}
              icon={getServiceIcon(service.slug, service.icon_url)}
              href={`/services/${service.slug}`}
              isLast={index === services.length - 1}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
