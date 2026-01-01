'use client'

import { Section, ServiceList } from "@/components/ui"
import { useServices } from "@/lib/api/hooks"
import { SkeletonServiceCard } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import type { ServiceList as ServiceListType } from "@/lib/api/generated"

interface ServicesListProps {
  initialServices?: ServiceListType[]
}

export function ServicesList({ initialServices = [] }: ServicesListProps) {
  // SSR-only mode: uses server data, no client revalidation
  const { services, isLoading, isError } = useServices(
    undefined,
    { fallbackData: initialServices.length > 0 ? initialServices : undefined }
  )

  // Use SSR data (services from hook includes fallbackData)
  const displayServices = services.length > 0 ? services : initialServices

  // Only show loading if no data at all
  const showLoading = isLoading && displayServices.length === 0
  // Only show error if no data to display
  const showError = isError && displayServices.length === 0

  if (showLoading) {
    return (
      <Section spacing="lg">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonServiceCard key={i} />
            ))}
          </div>
        </div>
      </Section>
    )
  }

  if (showError) {
    return (
      <Section spacing="xl">
        <ErrorMessage 
          title="Не удалось загрузить услуги"
          message="Попробуйте обновить страницу"
        />
      </Section>
    )
  }

  if (displayServices.length === 0) {
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
      <ServiceList 
        services={displayServices}
        className="max-w-5xl mx-auto w-full"
      />
    </Section>
  )
}
