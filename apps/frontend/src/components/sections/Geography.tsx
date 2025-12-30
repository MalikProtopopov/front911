'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useCities } from "@/lib/api/hooks"
import { SkeletonCityCard, SkeletonGrid } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { Section, SectionHeader, Button, CityGrid } from "@/components/ui"
import type { CityList } from "@/lib/api/generated"

interface GeographyProps {
  initialCities?: CityList[]
}

export function Geography({ initialCities = [] }: GeographyProps) {
  // Use SWR with server-provided initial data for hydration
  const { cities, isLoading, isError } = useCities(
    { limit: 10 },
    { fallbackData: initialCities.length > 0 ? initialCities : undefined }
  )

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && initialCities.length === 0

  return (
    <Section id="geography">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Работаем в 82 городах России"
          subtitle="От Калининграда до Владивостока — мы рядом в любом уголке страны"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {showLoading ? (
          <SkeletonGrid count={10} columns={5} CardComponent={SkeletonCityCard} />
        ) : isError ? (
          <ErrorMessage 
            title="Не удалось загрузить города"
            message="Попробуйте обновить страницу"
          />
        ) : cities.length === 0 ? (
          <EmptyState
            title="Города не найдены"
            description="На данный момент города недоступны."
          />
        ) : (
          <CityGrid 
            cities={cities} 
            columns={5}
          />
        )}

        <div className="flex justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/cities">
              <span className="leading-none">Все города</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
