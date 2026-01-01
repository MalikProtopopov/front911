'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useServices } from "@/lib/api/hooks"
import { SkeletonServiceCard } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { Section, SectionHeader, ServiceList, Button } from "@/components/ui"
import type { ServiceList as ServiceListType } from "@/lib/api/generated"

interface ServicesProps {
  initialServices?: ServiceListType[]
}

export function Services({ initialServices = [] }: ServicesProps) {
  // SSR-only mode: uses server data, no client revalidation
  const { services, isLoading, isError } = useServices(
    { limit: 4 },
    { fallbackData: initialServices.length > 0 ? initialServices : undefined }
  )

  // Use SSR data (services from hook includes fallbackData)
  const displayServices = services.length > 0 ? services : initialServices
  
  // Only show loading if no data at all
  const showLoading = isLoading && displayServices.length === 0
  // Only show error if no data to display
  const showError = isError && displayServices.length === 0

  return (
    <Section id="services" bg="secondary" spacing="md">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Что мы делаем"
          subtitle="Полный спектр услуг автопомощи для любых ситуаций"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {showLoading ? (
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex flex-col gap-3 md:gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonServiceCard key={i} />
              ))}
            </div>
          </div>
        ) : showError ? (
          <ErrorMessage 
            title="Не удалось загрузить услуги"
            message="Попробуйте обновить страницу"
          />
        ) : displayServices.length === 0 ? (
          <EmptyState
            title="Услуги не найдены"
            description="На данный момент услуги недоступны."
          />
        ) : (
          <ServiceList 
            services={displayServices}
            className="max-w-5xl mx-auto w-full"
          />
        )}

        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/services">
              <span className="leading-none">Все услуги</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
