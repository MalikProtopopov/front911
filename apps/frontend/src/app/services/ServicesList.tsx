'use client'

import { Section, ServiceRow } from "@/components/ui"
import { useServices } from "@/lib/api/hooks"
import { SkeletonServiceCard } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { getServiceIcon } from "./serviceIcons"

export function ServicesList() {
  const { services, isLoading, isError, error, mutate } = useServices()

  if (isLoading) {
    return (
      <Section spacing="lg">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white overflow-hidden flex flex-col gap-2 md:gap-3">
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
        <div className="bg-white overflow-hidden flex flex-col gap-2 md:gap-3">
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

