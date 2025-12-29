'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { PageLayout } from '@/components/layout'
import { MapPin, ChevronRight } from "lucide-react"
import { useCities } from "@/lib/api/hooks"
import { LoadingSpinner, ErrorMessage } from "@/components/common"
import { HeroSection, PageCTA } from "@/components/patterns"
import type { CityList } from "@/lib/api/generated"

interface CitiesListProps {
  initialCities?: CityList[]
}

export function CitiesList({ initialCities = [] }: CitiesListProps) {
  // Use SWR with server-provided initial data for hydration
  const { cities, isLoading, isError, error } = useCities(
    { limit: 1000, ordering: 'display_order,title' },
    { fallbackData: initialCities.length > 0 ? initialCities : undefined }
  )

  // Group cities by first letter
  const groupedCities = cities.reduce((acc, city) => {
    const firstLetter = city.title.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(city)
    return acc
  }, {} as Record<string, CityList[]>)

  const sortedLetters = Object.keys(groupedCities).sort((a, b) => 
    a.localeCompare(b, 'ru')
  )

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && initialCities.length === 0

  return (
    <PageLayout>
      {/* Hero */}
      <HeroSection
        id="cities-hero-section"
        title="Города присутствия"
        subtitle={`Работаем в ${cities.length > 0 ? cities.length : 82} городах России. Найдите услуги автопомощи в вашем городе.`}
        breadcrumbs={[{ label: 'Города' }]}
      />

      {/* Cities List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {showLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : isError ? (
            <ErrorMessage 
              message="Не удалось загрузить список городов"
              error={error}
            />
          ) : cities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--foreground-secondary)]">
                Список городов пуст
              </p>
            </div>
          ) : (
            /* All Cities by Letter */
            <div>
              {sortedLetters.map((letter) => (
                <div key={letter} className="py-8">
                  <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
                    {letter}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupedCities[letter]?.map((city) => (
                      <Link 
                        key={city.slug} 
                        href={`/cities/${city.slug}`} 
                        className="group block cursor-pointer"
                      >
                        <Card className="hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all border-[var(--border)] h-full flex">
                          <CardContent className="flex items-center gap-3 h-full w-full p-6">
                            <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                            <span className="font-medium text-lg group-hover:text-[var(--color-primary)] transition-colors flex-1">
                              {city.title}
                            </span>
                            <ChevronRight 
                              className="w-5 h-5 text-[var(--foreground-tertiary)] opacity-70 group-hover:text-[var(--color-primary)] group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" 
                              strokeWidth={2.5}
                            />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <PageCTA
        title="Не нашли свой город?"
        description="Мы постоянно расширяем географию. Оставьте заявку, и мы сообщим о запуске в вашем городе."
      />
    </PageLayout>
  )
}
