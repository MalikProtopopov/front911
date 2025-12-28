'use client'

import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { useClientCities } from "@/lib/api/hooks"
import { SkeletonCityCard, SkeletonGrid } from "@/components/common/Skeleton"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { EmptyState } from "@/components/common/EmptyState"
import { Section, SectionHeader, Grid, Button } from "@/components/ui"
import { Card, CardContent } from "@/components/ui/card"
import type { CityList } from "@/lib/api/generated"


interface CityCardProps {
  city: CityList | { name: string; slug: string; partners?: number }
}

function CityCard({ city }: CityCardProps) {
  const title = 'title' in city ? city.title : city.name
  const slug = city.slug

  return (
    <Link href={`/cities/${slug}`} className="group">
      <Card className="hover:shadow-lg transition-all border-transparent h-full flex">
        <CardContent 
          className="flex items-center gap-3 h-full w-full"
          style={{ padding: '24px 20px', paddingTop: '24px', paddingBottom: '24px' }}
        >
          <MapPin 
            className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" 
            style={{ marginRight: '4px' }}
          />
          <span className="font-medium text-lg group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

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
          <Grid cols={5} gap="md">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </Grid>
        )}

        <div className="flex justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/cities" className="gap-2">
              Все города
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
