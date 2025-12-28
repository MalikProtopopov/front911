'use client'

import Link from 'next/link'
import { 
  TwoColumnLayout,
  Breadcrumbs,
  PageHeader,
  ServiceRow,
  Button
} from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { Phone, Clock, Star } from 'lucide-react'
import { useCityDetail, useCityServices } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { LeadForm } from '@/components/forms/LeadForm'
import { getServiceIcon } from '@/app/services/serviceIcons'

interface CityDetailContentProps {
  slug: string
}

export function CityDetailContent({ slug }: CityDetailContentProps) {
  const { city, isLoading: cityLoading, isError: cityError, error: cityErrorData } = useCityDetail(slug)
  const { cityServices: services, isLoading: servicesLoading, isError: servicesError } = useCityServices(slug)

  const isLoading = cityLoading || servicesLoading

  if (isLoading) {
    return (
      <PageLayout className="flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </PageLayout>
    )
  }

  if (cityError || !city) {
    return (
      <PageLayout className="flex items-center justify-center px-4">
        <ErrorMessage 
          message="Не удалось загрузить информацию о городе"
          error={cityErrorData}
        />
      </PageLayout>
    )
  }

  // Extract city content
  const cityContent = city.content as {
    h1_title?: string
    short_description?: string
    full_description?: string
    partner_count?: number
    avg_rating?: string
    review_count?: number
  } | undefined

  return (
    <PageLayout>
      {/* Hero Section */}
      <section id="city-detail-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[
              { label: 'Все города', href: '/cities' },
              { label: city.title }
            ]} 
          />
          
          <PageHeader
            id="city-heading"
            title={cityContent?.h1_title || `Автопомощь в ${city.title}`}
            subtitle={cityContent?.short_description || 
              `Вызовите мастера для шиномонтажа, эвакуации или доставки топлива в ${city.title}. Работаем круглосуточно, приедем за 15-30 минут.`
            }
          />

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Круглосуточно</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Приедем за 15-30 мин</span>
            </div>
            {cityContent?.avg_rating && parseFloat(cityContent.avg_rating) > 0 && (
              <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                <Star className="w-5 h-5 text-[var(--color-warning)]" />
                <span>{cityContent.avg_rating} ({cityContent?.review_count || 0} отзывов)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <TwoColumnLayout
            sidebar={
              <div className="space-y-6">
                <LeadForm 
                  cityId={city.id} 
                  title={`Заказать в ${city.title}`}
                  noBorder
                  cardClassName="-mt-6"
                />
              </div>
            }
            sidebarPosition="right"
          >
            {/* Services */}
            <div className="space-y-10 md:space-y-12 pb-12 md:pb-16 pt-8 md:pt-12 services-list-bottom-padding services-list-top-padding">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Услуги в {city.title}
              </h2>
              
              {servicesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : servicesError ? (
                <ErrorMessage message="Не удалось загрузить услуги" />
              ) : services.length > 0 ? (
                <div className="overflow-hidden flex flex-col gap-4 md:gap-5">
                  {services.map((service, index) => (
                    <ServiceRow
                      key={service.slug}
                      service={service}
                      icon={getServiceIcon(service.slug, service.icon_url)}
                      href={`/cities/${slug}/services/${service.slug}`}
                      isLast={index === services.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--background-secondary)] rounded-xl">
                  <p className="text-[var(--foreground-secondary)]">
                    В данный момент услуги в этом городе недоступны.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/contacts">Связаться с нами</Link>
                  </Button>
                </div>
              )}

              {/* City full description */}
              {cityContent?.full_description && (
                <div className="mt-20 md:mt-24 pt-16 md:pt-20 pb-8 md:pb-12 city-description-top-padding">
                  <h2 className="text-2xl md:text-3xl font-bold mb-8">
                    О сервисе в {city.title}
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-[var(--foreground-secondary)] city-description-content
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:mb-3 [&_.city-services_h3]:mt-6 [&_.city-how-works_h3]:mt-6
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:ml-0
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:ml-0
                      [&_li]:my-1 [&_li]:pl-1 [&_li]:leading-relaxed
                      [&_.city-intro]:mb-6
                      [&_.city-intro>h2]:text-xl [&_.city-intro>h2]:font-bold [&_.city-intro>h2]:text-[var(--foreground)] [&_.city-intro>h2]:mt-6 [&_.city-intro>h2]:mb-3
                      [&_.city-services]:mb-6
                      [&_.city-how-works]:mb-6"
                    dangerouslySetInnerHTML={{ __html: cityContent.full_description }}
                  />
                </div>
              )}
            </div>
          </TwoColumnLayout>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Нужна помощь на дороге в {city.title}?
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки.
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
                <Link href="/cities">Все города</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
