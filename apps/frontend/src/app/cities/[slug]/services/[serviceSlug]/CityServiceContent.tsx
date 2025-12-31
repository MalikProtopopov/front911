'use client'

import Link from 'next/link'
import { useMemo, useRef } from 'react'
import { 
  TwoColumnLayout,
  Button,
  PriceAccordion,
  PriceAccordionCategory,
  PriceRowExpandable,
  PriceSectionHeader,
  PriceEmptyState
} from '@/components/ui'
import { MapPin } from 'lucide-react'
import { useCityService } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { PageCTA, RichText, FormSidebar } from '@/components/patterns'
import type { CityServiceOption, CityServiceResponse, DeliveryZone } from '@/lib/api/services'
import type { Contact } from '@/lib/api/generated'
import type { LeadFormRef } from '@/components/forms/LeadForm'

interface CityServiceContentProps {
  citySlug: string
  serviceSlug: string
  initialData?: CityServiceResponse | null
  initialContacts?: Contact[]
  deliveryZones?: DeliveryZone[]
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
        // Check if price is OptionPrice type (has technic_category_title)
        if ('technic_category_title' in price && price.technic_category_title) {
          categoriesInOption.add(price.technic_category_title)
          categorySet.add(price.technic_category_title)
        } else if ('technic_category' in price && price.technic_category) {
          // Legacy format with technic_category
          categoriesInOption.add(price.technic_category)
          categorySet.add(price.technic_category)
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
        // Option has prices but no categories (or prices without categories)
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
      // No price information at all
      uncategorized.push(option)
    }
  })

  return {
    grouped,
    uncategorized,
    categoryNames: Array.from(categorySet)
  }
}

/**
 * City Service Content - Client Component
 * Hero is rendered in page.tsx (server) for optimal LCP
 * This component handles interactive content (prices, forms)
 */
export function CityServiceContent({ 
  citySlug, 
  serviceSlug,
  initialData,
  initialContacts = [],
  deliveryZones = [],
}: CityServiceContentProps) {
  // Ref for form to set message
  const formRef = useRef<LeadFormRef>(null)

  // Use SWR with server-provided initial data for hydration
  const { 
    city,
    service,
    options,
    content,
    isLoading,
    isError,
    error,
  } = useCityService(citySlug, serviceSlug, {
    fallbackData: initialData ?? undefined
  })

  // Group options by category
  const { grouped, uncategorized, categoryNames } = useMemo(() => {
    return groupOptionsByCategory(options ?? [])
  }, [options])

  // Handler for option/parameter selection
  const handleOptionSelect = (message: string) => {
    formRef.current?.setMessage(message)
  }

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && !initialData

  if (showLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !city || !service) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <ErrorMessage 
          message="Не удалось загрузить информацию об услуге"
          error={error}
        />
      </div>
    )
  }

  return (
    <>
      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <TwoColumnLayout
            sidebar={
              <FormSidebar 
                cityId={city.id} 
                serviceId={service.id}
                title={`Заказать ${service.title.toLowerCase()}`}
                formRef={formRef}
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
                deliveryZones={deliveryZones}
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
                  defaultValue={categoryNames.length > 0 && categoryNames[0] ? [categoryNames[0]] : ['uncategorized']}
                >
                  {/* Render categories */}
                  {categoryNames.map((category) => (
                    <PriceAccordionCategory
                      key={category}
                      value={category}
                      title={category}
                      count={grouped[category]?.length ?? 0}
                    >
                      {grouped[category]?.map((option) => {
                        // Filter prices for this category
                        const categoryPrices = option.prices?.filter(p => {
                          if ('technic_category_title' in p) {
                            return p.technic_category_title === category
                          }
                          if ('technic_category' in p) {
                            return p.technic_category === category
                          }
                          return false
                        }) ?? []

                        // Get min price for display
                        const minPrice = categoryPrices.length > 0 
                          ? Math.min(...categoryPrices.map(p => Number(p.amount)))
                          : Number(option.price?.amount ?? 0)

                        return (
                          <PriceRowExpandable
                            key={option.id}
                            title={option.title}
                            basePrice={minPrice}
                            hasParameters={option.has_parameters}
                            parameterTypes={option.parameter_types}
                            onSelect={handleOptionSelect}
                          />
                        )
                      })}
                    </PriceAccordionCategory>
                  ))}

                  {/* Render uncategorized options */}
                  {uncategorized.length > 0 && (
                    <PriceAccordionCategory
                      value="uncategorized"
                      title="Другие опции"
                      count={uncategorized.length}
                    >
                      {uncategorized.map((option) => {
                        // Get prices without category
                        const pricesWithoutCategory = option.prices?.filter(p => {
                          if ('technic_category_title' in p) {
                            return !p.technic_category_title
                          }
                          if ('technic_category' in p) {
                            return !p.technic_category
                          }
                          return true
                        }) ?? []

                        const minPrice = pricesWithoutCategory.length > 0
                          ? Math.min(...pricesWithoutCategory.map(p => Number(p.amount)))
                          : Number(option.price?.amount ?? 0)

                        return (
                          <PriceRowExpandable
                            key={option.id}
                            title={option.title}
                            basePrice={minPrice}
                            hasParameters={option.has_parameters}
                            parameterTypes={option.parameter_types}
                            onSelect={handleOptionSelect}
                          />
                        )
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
        initialContacts={initialContacts}
      />
    </>
  )
}
