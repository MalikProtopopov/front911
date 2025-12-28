'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useServices } from "@/lib/api/hooks"
import { SkeletonServiceCard } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { Section, SectionHeader, ServiceRow, Button } from "@/components/ui"
import { getServiceIcon } from "@/app/services/serviceIcons"

export function Services() {
  const { services, isLoading, isError, mutate } = useServices({ limit: 4 })

  return (
    <Section id="services" bg="secondary">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Что мы делаем"
          subtitle="Полный спектр услуг автопомощи для любых ситуаций"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {isLoading ? (
          <div className="max-w-5xl mx-auto">
            <div className="overflow-hidden flex flex-col gap-2 md:gap-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonServiceCard key={i} />
              ))}
            </div>
          </div>
        ) : isError ? (
          <ErrorMessage 
            title="Не удалось загрузить услуги"
            message="Попробуйте обновить страницу"
            showRetry
            onRetry={() => mutate()}
          />
        ) : services.length === 0 ? (
          <EmptyState
            title="Услуги не найдены"
            description="На данный момент услуги недоступны."
          />
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="overflow-hidden flex flex-col gap-2 md:gap-3">
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
        )}

        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/services" className="gap-2">
              Все услуги
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
