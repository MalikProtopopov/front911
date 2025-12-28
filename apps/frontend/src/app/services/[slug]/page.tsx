import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/layout'
import { Breadcrumbs, TwoColumnLayout, PageHeader } from '@/components/ui'
import { CheckCircle, MapPin, Clock, DollarSign, Phone, ChevronRight } from 'lucide-react'
import { servicesService } from '@/lib/api/services'
import { generatePageMetadata, prefetchServices } from '@/lib/api/hooks'
import { LeadForm } from '@/components/forms/LeadForm'

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
  return generatePageMetadata(`/services/${slug}/`, {
    title: `Услуга — 911 Автопомощь`,
    description: `Заказать услугу автопомощи онлайн. Быстрый отклик, проверенные мастера, прозрачные цены.`,
  })
}

// ISR revalidation - 1 minute for development (allows quick updates from backend)
export const revalidate = 60 // 1 minute

// Enable dynamic rendering for all routes (important for dev mode)
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  
  console.log('[ServiceDetailPage] Loading service with slug:', slug)
  
  let service
  try {
    service = await servicesService.getBySlug(slug)
    console.log('[ServiceDetailPage] Service loaded:', service ? { id: service.id, title: service.title, slug: service.slug } : 'null')
  } catch (error) {
    console.error('[ServiceDetailPage] Error loading service:', error)
    console.error('[ServiceDetailPage] Error details:', error instanceof Error ? error.message : String(error))
    notFound()
  }

  if (!service) {
    console.error('[ServiceDetailPage] Service is null after loading')
    notFound()
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
    <PageLayout>
      {/* Hero */}
      <section id="service-detail-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[
              { label: 'Услуги', href: '/services' },
              { label: service.title }
            ]} 
          />
          
          <PageHeader
            id="service-detail-heading"
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-16 md:mt-20">
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
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <TwoColumnLayout
            sidebar={
              <div className="space-y-6">
                <LeadForm 
                  serviceId={service.id} 
                  title={`Заказать ${service.title.toLowerCase()}`}
                  noBorder
                  cardClassName="-mt-6"
                />
              </div>
            }
            sidebarPosition="right"
          >
            <div className="space-y-10 md:space-y-12">
              {/* Service Description from API */}
              {content?.description && (
                <div 
                  className="prose prose-lg max-w-none text-[var(--foreground-secondary)]
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                    [&_li]:leading-relaxed
                    [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
              )}

              {/* Benefits from API */}
              {content?.benefits_html && (
                <div className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--foreground)]">
                    Преимущества
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-[var(--foreground-secondary)]
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                      [&_li]:leading-relaxed
                      [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: content.benefits_html }}
                  />
                </div>
              )}

              {/* How It Works from API */}
              {content?.how_it_works_html && (
                <div className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--foreground)]">
                    Как это работает
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-[var(--foreground-secondary)]
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
                      [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                      [&_li]:leading-relaxed
                      [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: content.how_it_works_html }}
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
                  <p className="font-semibold text-lg" style={{ marginTop: '2.5rem' }}>
                    💡 Фиксированная цена согласовывается заранее, до выезда мастера. Оплата только после выполнения работ.
                  </p>
                </CardContent>
              </Card>

              {/* Cities */}
              <Card className="border-0 shadow-none hover:shadow-none">
                <CardHeader>
                  <CardTitle>Доступно в городах</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="text-[var(--foreground-secondary)]">
                      Работаем в 82 городах России
                    </span>
                  </div>
                  <p className="text-[var(--foreground-secondary)] mb-4">
                    Наши мастера готовы помочь вам в любом из городов, где мы работаем. Проверьте доступность услуги в вашем городе.
                  </p>
                  <div style={{ marginTop: '2rem' }}>
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
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Готовы заказать услугу {service.title}?
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
                <Link href="/cities">Выбрать город</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
