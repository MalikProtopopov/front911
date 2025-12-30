import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/layout'
import { TwoColumnLayout } from '@/components/ui'
import { CheckCircle, MapPin, Clock, DollarSign, Phone, ChevronRight } from 'lucide-react'
import { servicesService, citiesService, contentService } from '@/lib/api/services'
import type { Contact } from '@/lib/api/generated'
import { prefetchServices } from '@/lib/api/hooks'
import { PageCTA, HeroSection, RichText, FormSidebar } from '@/components/patterns'
import { ServiceJsonLd, BreadcrumbJsonLd, RelatedCities } from '@/components/seo'

// Interface for the content object from API
interface ServiceContent {
  meta_title?: string | null
  meta_description?: string | null
  h1_title?: string | null
  description?: string | null
  how_it_works_html?: string | null
  benefits_html?: string | null
  icon_url?: string | null
  cover_image_url?: string | null
  city_slug?: string | null
  city_title?: string | null
  updated_at?: string | null
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

// ISR: revalidate every hour
export const revalidate = 3600

// Allow dynamic params
export const dynamicParams = true

// Generate static paths
export async function generateStaticParams() {
  try {
    const services = await prefetchServices()
    return services.map((service) => ({
      slug: service.slug,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return [
      { slug: 'shinomontazh' },
      { slug: 'fuel-delivery' },
      { slug: 'evacuator' },
      { slug: 'auto-lift' },
    ]
  }
}

// Generate metadata
export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  try {
    const service = await servicesService.getBySlug(slug)
    
    // Parse content for meta data
    let content: ServiceContent | null = null
    if (service.content) {
      if (typeof service.content === 'string') {
        try {
          const parsed = JSON.parse(service.content)
          if (typeof parsed === 'object' && parsed !== null) {
            content = parsed as ServiceContent
          }
        } catch {
          // Not JSON, skip
        }
      } else if (typeof service.content === 'object') {
        content = service.content as unknown as ServiceContent
      }
    }
    
    const title = content?.meta_title || `${service.title} — вызов мастера 24/7 | 911`
    const description = content?.meta_description || 
      `Заказать ${service.title.toLowerCase()} онлайн. Быстрый отклик, проверенные мастера, прозрачные цены.`
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      alternates: {
        canonical: `${baseUrl}/services/${slug}`,
      },
    }
  } catch {
    return {
      title: 'Услуга — 911 Автопомощь',
      description: 'Заказать услугу автопомощи онлайн. Быстрый отклик, проверенные мастера, прозрачные цены.',
    }
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  let service
  let cities: { slug: string; title: string }[] = []
  let initialContacts: Contact[] = []
  
  try {
    service = await servicesService.getBySlug(slug)
  } catch (error) {
    console.error('[ServiceDetailPage] Error loading service:', error)
    notFound()
  }

  if (!service) {
    notFound()
  }
  
  // Fetch cities and contacts for SSR (non-blocking)
  try {
    const [allCities, contactsData] = await Promise.all([
      citiesService.getAll(),
      contentService.getContacts(),
    ])
    cities = allCities.map(c => ({ slug: c.slug, title: c.title }))
    initialContacts = contactsData
  } catch {
    // Continue without cities/contacts
  }

  // Parse content - API returns string that can be JSON or HTML
  let content: ServiceContent | null = null
  if (service.content) {
    if (typeof service.content === 'string') {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(service.content)
        // Check if it's an object with expected structure
        if (typeof parsed === 'object' && parsed !== null) {
          content = parsed as ServiceContent
        } else {
          // If parsed value is not an object, treat original as HTML
          content = { description: service.content }
        }
      } catch {
        // If parsing fails, treat it as HTML description
        content = { description: service.content }
      }
    } else if (typeof service.content === 'object' && service.content !== null) {
      content = service.content as unknown as ServiceContent
    }
  }

  // Get page title and subtitle from content or defaults
  const pageTitle = content?.h1_title || service.title
  const pageSubtitle = content?.meta_description || 
    'Профессиональная помощь на дороге круглосуточно. Быстрый выезд мастера с профессиональным оборудованием.'

  return (
    <>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={service.title}
        slug={slug}
        description={pageSubtitle}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Главная', url: baseUrl },
          { name: 'Услуги', url: `${baseUrl}/services` },
          { name: service.title, url: `${baseUrl}/services/${slug}` },
        ]}
      />
      
      <PageLayout>
        {/* Hero */}
        <HeroSection
          id="service-detail-hero-section"
          title={pageTitle}
          subtitle={pageSubtitle}
          breadcrumbs={[
            { label: 'Услуги', href: '/services' },
            { label: service.title }
          ]}
          containerSize="wide"
        >
          {/* Quick stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Выезд за 15–30 мин</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Работаем 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Фиксированная цена</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
              <span>{Number(service.options_count) || 0} опций доступно</span>
            </div>
          </div>
        </HeroSection>

        {/* Content */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <TwoColumnLayout
              sidebar={
                <FormSidebar 
                  serviceId={service.id} 
                  title={`Заказать ${service.title.toLowerCase()}`}
                />
              }
              sidebarPosition="right"
            >
              <div className="space-y-10 md:space-y-12">
                {/* Service Description from API */}
                {content?.description && (
                  <RichText 
                    content={content.description}
                    variant="default"
                  />
                )}

                {/* Benefits from API */}
                {content?.benefits_html && (
                  <div className="mt-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--foreground)]">
                      Преимущества
                    </h2>
                    <RichText 
                      content={content.benefits_html}
                      variant="default"
                    />
                  </div>
                )}

                {/* How It Works from API */}
                {content?.how_it_works_html && (
                  <div className="mt-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--foreground)]">
                      Как это работает
                    </h2>
                    <RichText 
                      content={content.how_it_works_html}
                      variant="default"
                    />
                  </div>
                )}

                {/* Pricing Info - Static fallback */}
                <Card className="border-0 shadow-none hover:shadow-none">
                  <CardHeader>
                    <CardTitle>Цена и условия</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-[var(--foreground-secondary)]">
                        Стоимость услуги рассчитывается индивидуально и зависит от нескольких факторов:
                      </p>
                      <ul className="space-y-2 text-[var(--foreground-secondary)]">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-1" />
                          <span>Удаленность от города</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-1" />
                          <span>Сложность выполняемых работ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-1" />
                          <span>Время суток (ночной тариф)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-1" />
                          <span>Необходимость дополнительного оборудования</span>
                        </li>
                      </ul>
                    </div>
                    <p className="font-semibold text-lg mt-10">
                      💡 Фиксированная цена согласовывается заранее, до выезда мастера. Оплата только после выполнения работ.
                    </p>
                  </CardContent>
                </Card>

                {/* Cities - Internal Linking for SEO */}
                <Card className="border-0 shadow-none hover:shadow-none">
                  <CardHeader>
                    <CardTitle>Доступно в городах</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-[var(--foreground-secondary)]">
                        Работаем в {cities.length || 82} городах России
                      </span>
                    </div>
                    <p className="text-[var(--foreground-secondary)]">
                      Наши мастера готовы помочь вам в любом из городов, где мы работаем.
                    </p>
                    
                    {/* Related Cities Links */}
                    <RelatedCities
                      cities={cities}
                      serviceSlug={slug}
                      serviceName={service.title}
                      maxItems={12}
                    />
                    
                    <div className="mt-6">
                      <Button variant="outline" asChild>
                        <Link href="/cities">
                          Посмотреть все города
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TwoColumnLayout>
          </div>
        </section>

        {/* CTA Section */}
        <PageCTA
          title={`Готовы заказать услугу ${service.title}?`}
          description="Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки."
          actions={[
            { label: 'Позвонить', showPhoneIcon: true },
            { label: 'Выбрать город', href: '/cities', variant: 'outline' },
          ]}
          initialContacts={initialContacts}
        />
      </PageLayout>
    </>
  )
}
