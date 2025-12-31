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

  // Show loading only if we don't have initial data
  if (showCityLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (cityError || !city) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <ErrorMessage 
          message="Не удалось загрузить информацию о городе"
          error={cityErrorData}
        />
      </div>
    )
  }

  // Extract city content
  const cityContent = city.content as {
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
                cityId={city.id} 
                title={`Заказать в ${city.title}`}
              />
            }
            sidebarPosition="right"
          >
            {/* Services */}
            <div className="space-y-10 md:space-y-12 pb-12 md:pb-16 pt-4 md:pt-6">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Услуги в {city.title}
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
    </>
  )
}
