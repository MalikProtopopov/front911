'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { 
  TwoColumnLayout,
  Breadcrumbs,
  PageHeader,
  Button,
  Badge
} from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle,
  ChevronDown,
  Truck
} from 'lucide-react'
import { useCityService } from '@/lib/api/hooks'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { LeadForm } from '@/components/forms/LeadForm'
import type { CityServiceOption } from '@/lib/api/services'

interface CityServiceContentProps {
  citySlug: string
  serviceSlug: string
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

// Format price
function formatPrice(amount: string): string {
  const num = parseFloat(amount)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

// Option Row Component - минималистичная строка услуги
function OptionRow({ option, showCategory = false }: { option: CityServiceOption; showCategory?: boolean }) {
  return (
    <div className="option-row-item flex items-center justify-between gap-4 py-3.5 md:py-4 min-h-[56px] hover:bg-slate-50 transition-colors">
      {/* Левая часть: название + подпись */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] md:text-base font-semibold text-[var(--foreground)] leading-tight truncate">
          {option.title}
        </h4>
        {showCategory && option.price?.technic_category && (
          <p className="text-xs text-[var(--foreground-secondary)]/70 mt-0.5 leading-tight">
            {option.price.technic_category}
          </p>
        )}
      </div>
      
      {/* Правая часть: цена */}
      {option.price ? (
        <span className="text-[15px] md:text-base font-semibold text-[var(--color-primary)] flex-shrink-0 tabular-nums">
          {formatPrice(option.price.amount)}
        </span>
      ) : (
        <Badge variant="secondary" size="sm">По запросу</Badge>
      )}
    </div>
  )
}

// Category Section Component - Карточка-аккордеон
function CategorySection({ 
  title, 
  options,
  defaultExpanded = true 
}: { 
  title: string
  options: CityServiceOption[]
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="overflow-hidden">
      {/* Заголовок аккордеона - кликабельная зона */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="category-accordion-button w-full flex items-center justify-between gap-6 pl-12 pr-8 md:pl-16 md:pr-10 py-4 md:py-5 min-h-[64px] md:min-h-[72px] transition-colors duration-150 bg-slate-100 hover:bg-slate-200"
      >
        {/* Левая часть: иконка + название с количеством */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <span className="font-semibold text-[15px] md:text-base text-[var(--foreground)] truncate">
            {title} ({options.length} {options.length === 1 ? 'опция' : options.length < 5 ? 'опции' : 'опций'})
          </span>
        </div>
        
        {/* Chevron с анимацией поворота */}
        <ChevronDown 
          className={`
            w-6 h-6 text-[var(--foreground-secondary)] flex-shrink-0
            transition-transform duration-200
            ${isExpanded ? 'rotate-180' : 'rotate-0'}
          `} 
        />
      </button>
      
      {/* Тело аккордеона с анимацией */}
      <div 
        className={`
          overflow-hidden transition-all duration-200 ease-out
          ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="divide-y divide-[var(--border)]/30 bg-white">
          {options.map(option => (
            <OptionRow key={option.id} option={option} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CityServiceContent({ citySlug, serviceSlug }: CityServiceContentProps) {
  const { 
    city, 
    service, 
    options, 
    content, 
    seo,
    isLoading, 
    isError, 
    error 
  } = useCityService(citySlug, serviceSlug)

  // Group options by category
  const { grouped, uncategorized } = useMemo(() => {
    return groupOptionsByCategory(options)
  }, [options])

  const categoryNames = Object.keys(grouped).sort()

  if (isLoading) {
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
      <section id="city-service-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[
              { label: 'Все города', href: '/cities' },
              { label: city.title, href: `/cities/${citySlug}` },
              { label: service.title }
            ]} 
          />
          
          <PageHeader
            id="service-heading"
            title={pageTitle}
            subtitle={content?.meta_description || 
              `Закажите ${service.title.toLowerCase()} в ${city.title}. Быстрый выезд мастера, прозрачные цены, работаем 24/7.`
            }
          />

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-10">
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
                  serviceId={service.id}
                  title={`Заказать ${service.title.toLowerCase()}`}
                  noBorder
                  cardClassName="-mt-6"
                />
              </div>
            }
            sidebarPosition="right"
          >
            {/* Options with prices */}
            <div className="pb-8 md:pb-12 pt-8 md:pt-12">
              {/* Заголовок секции с badge */}
              <div className="service-prices-section flex items-baseline gap-3 mb-8">
                <h2 className="service-prices-heading text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                  Цены на {service.title.toLowerCase()}
                </h2>
                <Badge 
                  variant="secondary" 
                  size="sm" 
                  className="bg-slate-100 text-slate-600 hidden"
                >
                  {options.length} {options.length === 1 ? 'опция' : options.length < 5 ? 'опции' : 'опций'}
                </Badge>
              </div>

              {options.length === 0 ? (
                <div className="text-center py-12 bg-[var(--background-secondary)] rounded-xl">
                  <p className="text-[var(--foreground-secondary)]">
                    Цены для данной услуги в этом городе пока не указаны.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/contacts">Узнать цены</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Options grouped by category */}
                  {categoryNames.map((category, index) => (
                    <CategorySection
                      key={category}
                      title={category}
                      options={grouped[category] ?? []}
                      defaultExpanded={index === 0}
                    />
                  ))}

                  {/* Uncategorized options */}
                  {uncategorized.length > 0 && (
                    <CategorySection
                      title="Прочие услуги"
                      options={uncategorized}
                      defaultExpanded={categoryNames.length === 0}
                    />
                  )}
                </div>
              )}

              {/* Service description */}
              {content?.description && (
                <div className="mt-20 md:mt-24 pt-12 md:pt-16 pb-8 md:pb-12">
                  <h2 className="service-description-heading text-2xl md:text-3xl font-bold mb-8">
                    Подробнее об услуге
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-[var(--foreground-secondary)]
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                      [&_li]:leading-relaxed
                      [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold
                      [&_details]:mb-6 [&_details]:md:mb-8
                      [&_summary]:pb-2 [&_summary]:cursor-pointer 
                      [&_summary]:font-semibold [&_summary]:text-base [&_summary]:md:text-lg [&_summary]:text-[var(--foreground)]
                      [&_summary]:list-none [&_summary]:transition-colors [&_summary]:duration-150
                      [&_summary]:hover:text-[var(--color-primary)]
                      [&_summary::-webkit-details-marker]:hidden
                      [&_details>div]:pt-1 [&_details>div]:pb-0
                      [&_details>p]:pt-1 [&_details>p]:pb-0 [&_details>p]:mb-0
                      [&_.service-intro]:pb-10
                      [&_.service-advantages]:mb-6
                      [&_.service-pricing]:mb-6
                      [&_.service-how-it-works]:mb-6
                      [&_.service-faq]:mb-8
                      [&_.service-faq_h3]:!mt-10 [&_.service-faq_h3]:md:!mt-12 [&_.service-faq_h3]:!mb-6 [&_.service-faq_h3]:md:!mb-8
                      [&_.service-faq_details]:!mb-8 [&_.service-faq_details]:md:!mb-10"
                    dangerouslySetInnerHTML={{ __html: content.description }}
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
              Нужна помощь с выбором?
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Позвоните нам или оставьте заявку — мы поможем подобрать оптимальный вариант для вашего автомобиля.
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
                <Link href={`/cities/${citySlug}`}>
                  <MapPin className="w-5 h-5 mr-2" />
                  Все услуги в {city.title}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

