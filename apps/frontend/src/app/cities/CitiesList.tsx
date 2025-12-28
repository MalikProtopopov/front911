'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button, Breadcrumbs, PageHeader } from "@/components/ui"
import { PageLayout } from '@/components/layout'
import { MapPin, Phone } from "lucide-react"
import { useCities } from "@/lib/api/hooks"
import { LoadingSpinner, ErrorMessage } from "@/components/common"
import type { CityList } from "@/lib/api/generated"

export function CitiesList() {
  const { cities, isLoading, isError, error } = useCities({ limit: 1000, ordering: 'display_order,title' })

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

  return (
    <PageLayout>
      {/* Hero */}
      <section id="cities-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[{ label: 'Города' }]} 
          />
          <PageHeader
            id="cities-heading"
            title="Города присутствия"
            subtitle={`Работаем в ${cities.length > 0 ? cities.length : 82} городах России. Найдите услуги автопомощи в вашем городе.`}
          />
        </div>
      </section>

      {/* Cities List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
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
                <div key={letter} className="pt-8 pb-8" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                  <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
                    {letter}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupedCities[letter]?.map((city) => (
                      <Link key={city.slug} href={`/cities/${city.slug}`} className="group">
                        <Card className="hover:shadow-lg transition-all border-transparent h-full flex">
                          <CardContent 
                            className="flex items-center gap-3 h-full w-full"
                            style={{ padding: '24px 20px', paddingTop: '24px', paddingBottom: '24px' }}
                          >
                            <MapPin 
                              className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" 
                              style={{ marginRight: '4px' }}
                            />
                            <span className="font-medium text-lg group-hover:text-[var(--color-primary)] transition-colors">{city.title}</span>
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
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Не нашли свой город?
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Мы постоянно расширяем географию. Оставьте заявку, и мы сообщим о запуске в вашем городе.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <a href="tel:+79991234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Позвонить
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <Link href="/contacts">Связаться с нами</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

