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
import type { OptionPrice } from '@/lib/api/generated'
import type { OptionPrice } from '@/lib/api/client'

interface CityServiceContentProps {
  citySlug: string
  serviceSlug: string
  initialData?: CityServiceResponse | null
}

// Group options by category based on prices
function groupOptionsByCategory(options: CityServiceOption[]) {
  const grouped: Record<string, CityServiceOption[]> = {}
  const uncategorized: CityServiceOption[] = []
  const categorySet = new Set<string>()

  options.forEach(option => {
    // Check if option has prices
    if (option.prices && option.prices.length > 0) {
      // Group by technic_category_title from prices
      const categoriesInOption = new Set<string>()
      
      option.prices.forEach(price => {
        if (price.technic_category_title) {
          categoriesInOption.add(price.technic_category_title)
          categorySet.add(price.technic_category_title)
        }
      })
      
      // If option has prices with categories, add to those categories
      if (categoriesInOption.size > 0) {
        categoriesInOption.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = []
          }
          // Only add option once per category (avoid duplicates)
          if (!grouped[category].find(opt => opt.id === option.id)) {
            grouped[category].push(option)
          }
        })
      } else {
        // Option has prices but no categories
        uncategorized.push(option)
      }
    } else if (option.price?.technic_category) {
      // Fallback to legacy single price structure
      const category = option.price.technic_category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(option)
      categorySet.add(category)
    } else {
      // Option has no prices or categories
      uncategorized.push(option)
    }
  })

  return { grouped, uncategorized, categoryNames: Array.from(categorySet).sort() }
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
  const { grouped, uncategorized, categoryNames } = useMemo(() => {
    return groupOptionsByCategory(options ?? [])
  }, [options])

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
                totalCount={options?.length ?? 0}
              />

              {!options || options.length === 0 || (categoryNames.length === 0 && uncategorized.length === 0) ? (
                <PriceEmptyState message="Цены для данной услуги в этом городе пока не указаны.">
                  <Button asChild>
                    <Link href="/contacts">Узнать цены</Link>
                  </Button>
                </PriceEmptyState>
              ) : (
                <PriceAccordion 
                  type="multiple" 
                  defaultValue={categoryNames.length > 0 ? [`category-0`] : uncategorized.length > 0 ? ['uncategorized'] : []}
                >
                  {/* Options grouped by category */}
                  {categoryNames.map((category, index) => {
                    const categoryOptions = grouped[category] || []
                    return (
                      <PriceAccordionCategory
                        key={category}
                        value={`category-${index}`}
                        title={category}
                        count={categoryOptions.length}
                        icon={<Truck />}
                      >
                        {categoryOptions.map(option => {
                          // Filter prices for this specific category
                          const categoryPrices = option.prices?.filter(
                            price => price.technic_category_title === category
                          ) || []
                          
                          // If no prices in prices array, fallback to legacy price
                          const pricesToShow: OptionPrice[] = categoryPrices.length > 0 
                            ? categoryPrices 
                            : (option.price?.technic_category === category && option.price 
                                ? [{
                                    id: 0,
                                    city_slug: '',
                                    city_title: '',
                                    technic_category_id: null,
                                    technic_category_title: null,
                                    amount: option.price.amount,
                                  }] 
                                : [])
                          
                          // Show option with all prices for this category (usually one)
                          if (pricesToShow.length === 0) return null
                          
                          return pricesToShow.map((price, priceIndex) => (
                            <PriceRow 
                              key={`${option.id}-${priceIndex}`}
                              title={option.title}
                              price={price.amount}
                            />
                          ))
                        })}
                      </PriceAccordionCategory>
                    )
                  })}

                  {/* Uncategorized options */}
                  {uncategorized.length > 0 && (
                    <PriceAccordionCategory
                      value="uncategorized"
                      title="Прочие услуги"
                      count={uncategorized.length}
                      icon={<Truck />}
                    >
                      {uncategorized.map(option => {
                        // Get prices without category or fallback to legacy price
                        const pricesWithoutCategory = option.prices?.filter(
                          price => !price.technic_category_title
                        ) || []
                        
                        const pricesToShow: OptionPrice[] = pricesWithoutCategory.length > 0
                          ? pricesWithoutCategory
                          : (option.price && !option.price.technic_category
                              ? [{
                                  id: 0,
                                  city_slug: '',
                                  city_title: '',
                                  technic_category_id: null,
                                  technic_category_title: null,
                                  amount: option.price.amount,
                                }]
                              : [])
                        
                        if (pricesToShow.length === 0) return null
                        
                        return pricesToShow.map((price, priceIndex) => (
                          <PriceRow 
                            key={`${option.id}-uncategorized-${priceIndex}`}
                            title={option.title}
                            price={price.amount}
                          />
                        ))
                      })}
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
