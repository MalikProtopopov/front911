'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useClientCities } from "@/lib/api/hooks"
import { SkeletonCityCard, SkeletonGrid } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { Section, SectionHeader, Button, CityGrid } from "@/components/ui"

export function Geography() {
  const { cities, isLoading, isError } = useClientCities(10)

  return (
    <Section id="geography">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Работаем в 82 городах России"
          subtitle="От Калининграда до Владивостока — мы рядом в любом уголке страны"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {isLoading ? (
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
