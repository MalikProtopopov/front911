'use client'

import { PageLayout } from '@/components/layout'
import { CityGrid } from "@/components/ui"
import { useCities } from "@/lib/api/hooks"
import { LoadingSpinner, ErrorMessage } from "@/components/common"
import { HeroSection, PageCTA } from "@/components/patterns"
import type { CityList, Contact } from "@/lib/api/generated"

interface CitiesListProps {
  initialCities?: CityList[]
  initialContacts?: Contact[]
}

export function CitiesList({ initialCities = [], initialContacts = [] }: CitiesListProps) {
  // SSR-only mode: uses server data, no client revalidation
  const { cities, isLoading, isError } = useCities(
    { limit: 1000, ordering: 'display_order,title' },
    { fallbackData: initialCities.length > 0 ? initialCities : undefined }
  )

  // Use SSR data (cities from hook includes fallbackData)
  const displayCities = cities.length > 0 ? cities : initialCities

  // Group cities by first letter
  const groupedCities = displayCities.reduce((acc, city) => {
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

  // Only show loading if no data at all
  const showLoading = isLoading && displayCities.length === 0
  // Only show error if no data to display
  const showError = isError && displayCities.length === 0

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
          ) : showError ? (
            <ErrorMessage 
              message="Не удалось загрузить список городов"
            />
          ) : displayCities.length === 0 ? (
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
                  <CityGrid 
                    cities={groupedCities[letter] || []} 
                    columns={4}
                  />
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
        initialContacts={initialContacts}
      />
    </PageLayout>
  )
}
