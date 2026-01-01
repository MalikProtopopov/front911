'use client'

import Link from 'next/link'
import { 
  TwoColumnLayout,
  ServiceList,
  Button
} from '@/components/ui'
import { useCityDetail, useCityServices } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { PageCTA, RichText, FormSidebar } from '@/components/patterns'
import type { CityDetail, ServiceList as ServiceListType, Contact } from '@/lib/api/generated'
import type { DeliveryZone } from '@/lib/api/services'

interface CityDetailContentProps {
  slug: string
  initialCity?: CityDetail | null
  initialServices?: ServiceListType[]
  initialContacts?: Contact[]
  deliveryZones?: DeliveryZone[]
}

/**
 * City Detail Content - Client Component
 * Hero is rendered in page.tsx (server) for optimal LCP
 * This component handles interactive content below the fold
 */
// Format delivery zone price for display
function formatDeliveryPrice(price: string): string {
  const numPrice = parseFloat(price)
  if (isNaN(numPrice) || numPrice === 0) {
    return 'бесплатно'
  }
  return `${new Intl.NumberFormat('ru-RU').format(numPrice)} ₽`
}

// Capitalize first letter of zone name
function capitalizeZoneName(name: string): string {
  if (!name) return name
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export function CityDetailContent({ 
  slug, 
  initialCity,
  initialServices = [],
  initialContacts = [],
  deliveryZones = [],
}: CityDetailContentProps) {
  // SSR-only mode: uses server data, no client revalidation
  const { 
    city, 
    isLoading: cityLoading, 
    isError: cityError
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

  // Use SSR data (from hook includes fallbackData)
  const displayCity = city ?? initialCity
  const displayServices = services.length > 0 ? services : initialServices

  // Only show loading if no data at all
  const showCityLoading = cityLoading && !displayCity
  const showServicesLoading = servicesLoading && displayServices.length === 0
  // Only show error if no data to display
  const showCityError = cityError && !displayCity

  // Show loading only if we don't have initial data
  if (showCityLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (showCityError || !displayCity) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <ErrorMessage 
          message="Не удалось загрузить информацию о городе"
        />
      </div>
    )
  }

  // Extract city content
  const cityContent = displayCity.content as {
    short_description?: string
    full_description?: string
  } | undefined

  return (
    <>
      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <TwoColumnLayout
            sidebar={
              <FormSidebar 
                cityId={displayCity.id} 
                title={`Заказать в ${displayCity.title}`}
              />
            }
            sidebarPosition="right"
          >
            {/* Services */}
            <div className="space-y-10 md:space-y-12 pb-12 md:pb-16 pt-4 md:pt-6">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Услуги в {displayCity.title}
                </h2>
                {/* Delivery zones info */}
                {deliveryZones.length > 0 && (
                  <div className="mt-3 text-sm text-[var(--foreground-secondary)]">
                    <span className="font-medium text-[var(--foreground-primary)]">Стоимость выезда мастера:</span>{' '}
                    {deliveryZones.filter(z => parseFloat(z.delivery_price) === 0).length > 0 && (
                      <span>
                        {deliveryZones.filter(z => parseFloat(z.delivery_price) === 0).map(z => capitalizeZoneName(z.zone_name)).join(', ')} — {formatDeliveryPrice('0')}
                      </span>
                    )}
                    {deliveryZones.filter(z => parseFloat(z.delivery_price) === 0).length > 0 && 
                     deliveryZones.filter(z => parseFloat(z.delivery_price) > 0).length > 0 && ', '}
                    {deliveryZones.filter(z => parseFloat(z.delivery_price) > 0).map((zone, index, arr) => (
                      <span key={zone.zone_name}>
                        {capitalizeZoneName(zone.zone_name)} — {formatDeliveryPrice(zone.delivery_price)}
                        {index < arr.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {showServicesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (servicesError && displayServices.length === 0) ? (
                <ErrorMessage message="Не удалось загрузить услуги" />
              ) : displayServices.length > 0 ? (
                <ServiceList
                  services={displayServices}
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
                    О сервисе в {displayCity.title}
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
        title={`Нужна помощь на дороге в ${displayCity.title}?`}
        description="Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки."
        actions={[
          { label: 'Позвонить', showPhoneIcon: true },
          { label: 'Все города', href: '/cities', variant: 'outline' }
        ]}
        initialContacts={initialContacts}
      />
    </>
  )
}
