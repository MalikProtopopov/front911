'use client'

import Link from 'next/link'
import { 
  TwoColumnLayout,
  ServiceList,
  Button
} from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { Phone, Clock, Star } from 'lucide-react'
import { useCityDetail, useCityServices } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { HeroSection, PageCTA, RichText, FormSidebar } from '@/components/patterns'
import type { CityDetail, ServiceList as ServiceListType, Contact } from '@/lib/api/generated'

interface CityDetailContentProps {
  slug: string
  initialCity?: CityDetail | null
  initialServices?: ServiceListType[]
  initialContacts?: Contact[]
}

export function CityDetailContent({ 
  slug, 
  initialCity,
  initialServices = [],
  initialContacts = [],
}: CityDetailContentProps) {
  // Use SWR with server-provided initial data for hydration
  const { 
    city, 
    isLoading: cityLoading, 
    isError: cityError, 
    error: cityErrorData 
  } = useCityDetail(slug, {
    fallbackData: initialCity ?? undefined
  })
  
  const { 
    cityServices: services, 
    isLoading: servicesLoading, 
    isError: servicesError 
  } = useCityServices(slug, {
    fallbackData: initialServices.length > 0 ? initialServices : undefined
  })

  // If we have initial data, don't show loading state on first render
  const showCityLoading = cityLoading && !initialCity
  const showServicesLoading = servicesLoading && initialServices.length === 0
  const isLoading = showCityLoading || showServicesLoading

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
      <HeroSection
        id="city-detail-hero-section"
        title={cityContent?.h1_title || `Автопомощь в ${city.title}`}
        subtitle={cityContent?.short_description || 
          `Вызовите мастера для шиномонтажа, эвакуации или доставки топлива в ${city.title}. Работаем круглосуточно, приедем за 15-30 минут.`
        }
        breadcrumbs={[
          { label: 'Все города', href: '/cities' },
          { label: city.title }
        ]}
        containerSize="wide"
      >
        {/* Quick stats */}
        <div className="flex flex-wrap gap-6">
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
      </HeroSection>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <TwoColumnLayout
            sidebar={
              <FormSidebar 
                cityId={city.id} 
                title={`Заказать в ${city.title}`}
              />
            }
            sidebarPosition="right"
          >
            {/* Services */}
            <div className="space-y-10 md:space-y-12 pb-12 md:pb-16 pt-8 md:pt-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Услуги в {city.title}
              </h2>
              
              {showServicesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : servicesError ? (
                <ErrorMessage message="Не удалось загрузить услуги" />
              ) : services.length > 0 ? (
                <ServiceList
                  services={services}
                  getHref={(service) => `/cities/${slug}/services/${service.slug}`}
                />
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
                <div className="mt-20 md:mt-24 pt-16 md:pt-20 pb-8 md:pb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-8">
                    О сервисе в {city.title}
                  </h2>
                  <RichText 
                    content={cityContent.full_description}
                    variant="city"
                  />
                </div>
              )}
            </div>
          </TwoColumnLayout>
        </div>
      </section>

      {/* CTA Section */}
      <PageCTA
        title={`Нужна помощь на дороге в ${city.title}?`}
        description="Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки."
        actions={[
          { label: 'Позвонить', showPhoneIcon: true },
          { label: 'Все города', href: '/cities', variant: 'outline' }
        ]}
        initialContacts={initialContacts}
      />
    </PageLayout>
  )
}
