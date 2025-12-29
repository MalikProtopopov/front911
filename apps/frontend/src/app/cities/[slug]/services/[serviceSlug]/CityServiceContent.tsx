'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { 
  TwoColumnLayout,
  Button,
  PriceAccordion,
  PriceAccordionCategory,
  PriceRow,
  PriceSectionHeader,
  PriceEmptyState
} from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle,
  Truck
} from 'lucide-react'
import { useCityService } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { PageCTA, HeroSection, RichText, FormSidebar } from '@/components/patterns'
import type { CityServiceOption, CityServiceResponse } from '@/lib/api/services'

interface CityServiceContentProps {
  citySlug: string
  serviceSlug: string
  initialData?: CityServiceResponse | null
}

// Group options by category
function groupOptionsByCategory(options: CityServiceOption[]) {
  const grouped: Record<string, CityServiceOption[]> = {}
  const uncategorized: CityServiceOption[] = []

  options.forEach(option => {
    if (option.price?.technic_category) {
      const category = option.price.technic_category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(option)
    } else {
      uncategorized.push(option)
    }
  })

  return { grouped, uncategorized }
}


export function CityServiceContent({ 
  citySlug, 
  serviceSlug,
  initialData 
}: CityServiceContentProps) {
  // Use SWR with server-provided initial data for hydration
  const { 
    city, 
    service, 
    options, 
    content, 
    seo,
    isLoading, 
    isError, 
    error 
  } = useCityService(citySlug, serviceSlug, {
    fallbackData: initialData ?? undefined
  })

  // Group options by category
  const { grouped, uncategorized } = useMemo(() => {
    return groupOptionsByCategory(options)
  }, [options])

  const categoryNames = Object.keys(grouped).sort()

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && !initialData

  if (showLoading) {
    return (
      <PageLayout className="flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </PageLayout>
    )
  }

  if (isError || !city || !service) {
    return (
      <PageLayout className="flex items-center justify-center px-4">
        <ErrorMessage 
          message="Не удалось загрузить информацию об услуге"
          error={error}
        />
      </PageLayout>
    )
  }

  const pageTitle = seo?.h1_title || content?.h1_title || `${service.title} в ${city.title}`

  return (
    <PageLayout>
      {/* Hero Section */}
      <HeroSection
        id="city-service-hero-section"
        title={pageTitle}
        subtitle={content?.meta_description || 
          `Закажите ${service.title.toLowerCase()} в ${city.title}. Быстрый выезд мастера, прозрачные цены, работаем 24/7.`
        }
        breadcrumbs={[
          { label: 'Все города', href: '/cities' },
          { label: city.title, href: `/cities/${citySlug}` },
          { label: service.title }
        ]}
        containerSize="wide"
      >
        {/* Quick stats */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Выезд за 20-30 мин</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <Phone className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Работаем 24/7</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
            <span>{options.length} опций с ценами</span>
          </div>
          {categoryNames.length > 0 && (
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Truck className="w-5 h-5 text-[var(--color-primary)]" />
              <span>{categoryNames.length} категорий техники</span>
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
                serviceId={service.id}
                title={`Заказать ${service.title.toLowerCase()}`}
              />
            }
            sidebarPosition="right"
          >
            {/* Options with prices */}
            <div className="py-8 md:py-12">
              {/* Заголовок секции */}
              <PriceSectionHeader 
                title={`Цены на ${service.title}`}
                totalCount={options.length}
              />

              {options.length === 0 ? (
                <PriceEmptyState message="Цены для данной услуги в этом городе пока не указаны.">
                  <Button asChild>
                    <Link href="/contacts">Узнать цены</Link>
                  </Button>
                </PriceEmptyState>
              ) : (
                <PriceAccordion 
                  type="multiple" 
                  defaultValue={categoryNames.length > 0 ? [`category-0`] : ['uncategorized']}
                >
                  {/* Options grouped by category */}
                  {categoryNames.map((category, index) => (
                    <PriceAccordionCategory
                      key={category}
                      value={`category-${index}`}
                      title={category}
                      count={grouped[category]?.length}
                      icon={<Truck />}
                    >
                      {grouped[category]?.map(option => (
                        <PriceRow 
                          key={option.id} 
                          title={option.title}
                          price={option.price?.amount}
                        />
                      ))}
                    </PriceAccordionCategory>
                  ))}

                  {/* Uncategorized options */}
                  {uncategorized.length > 0 && (
                    <PriceAccordionCategory
                      value="uncategorized"
                      title="Прочие услуги"
                      count={uncategorized.length}
                      icon={<Truck />}
                    >
                      {uncategorized.map(option => (
                        <PriceRow 
                          key={option.id} 
                          title={option.title}
                          price={option.price?.amount}
                        />
                      ))}
                    </PriceAccordionCategory>
                  )}
                </PriceAccordion>
              )}

              {/* Service description */}
              {content?.description && (
                <div className="mt-20 md:mt-24 pt-12 md:pt-16 pb-8 md:pb-12">
                  <RichText 
                    content={content.description}
                    variant="service"
                  />
                </div>
              )}
            </div>
          </TwoColumnLayout>
        </div>
      </section>

      {/* CTA Section */}
      <PageCTA
        title="Нужна помощь с выбором?"
        description="Позвоните нам или оставьте заявку — мы поможем подобрать оптимальный вариант для вашего автомобиля."
        actions={[
          { label: 'Позвонить', showPhoneIcon: true },
          { 
            label: `Все услуги в ${city.title}`, 
            href: `/cities/${citySlug}`, 
            variant: 'outline',
            icon: <MapPin className="w-5 h-5 mr-2" />
          },
        ]}
      />
    </PageLayout>
  )
}
