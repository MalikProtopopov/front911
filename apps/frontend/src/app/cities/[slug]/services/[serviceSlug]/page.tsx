import { Metadata } from 'next'
import { Clock, Phone, CheckCircle } from 'lucide-react'
import { CityServiceContent } from './CityServiceContent'
import { citiesService, servicesService, contentService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { HeroSection } from '@/components/patterns'
import { PageLayout } from '@/components/layout'
import type { CityServiceResponse, DeliveryZone } from '@/lib/api/services'
import type { Contact } from '@/lib/api/generated'

interface CityServicePageProps {
  params: Promise<{ slug: string; serviceSlug: string }>
}

// ISR: revalidate every hour
export const revalidate = 3600

// Allow dynamic params for new city-service combinations
export const dynamicParams = true

// Generate static paths for all city-service combinations
export async function generateStaticParams() {
  try {
    const [cities, services] = await Promise.all([
      citiesService.getAll(),
      servicesService.getAll()
    ])
    
    // Generate all combinations
    const params: { slug: string; serviceSlug: string }[] = []
    for (const city of cities) {
      for (const service of services) {
        params.push({
          slug: city.slug,
          serviceSlug: service.slug,
        })
      }
    }
    
    return params
  } catch (error) {
    logServerError(error, 'Failed to generate static params for city services', {
      page: '/cities/[slug]/services/[serviceSlug]',
    })
    return []
  }
}

// Generate metadata with real data
export async function generateMetadata({ params }: CityServicePageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params
  
  try {
    const cityService = await citiesService.getServiceByCity(slug, serviceSlug)
    const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
    
    const cityTitle = cityService.city?.title || slug
    const serviceTitle = cityService.service?.title || serviceSlug
    
    // Use meta_title and meta_description from content if available, otherwise use SEO or formula
    const title = cityService.content?.meta_title || cityService.seo?.title || 
      `${serviceTitle} в ${cityTitle} — цены, вызов мастера 24/7 | 911`
    const description = cityService.content?.meta_description || cityService.seo?.meta_description || 
      `${serviceTitle} в ${cityTitle}: быстрый выезд мастера, прозрачные цены. Работаем круглосуточно.`
    
    return {
      title,
      description,
      keywords: cityService.seo?.meta_keywords,
      openGraph: {
        title: cityService.seo?.og_title || title,
        description: cityService.seo?.og_description || description,
        images: cityService.seo?.og_image_url ? [cityService.seo.og_image_url] : undefined,
        type: 'website',
      },
      alternates: {
        canonical: `${baseUrl}/cities/${slug}/services/${serviceSlug}`,
      },
    }
  } catch {
    // Fallback metadata
    return {
      title: 'Услуга в городе — 911 Автопомощь',
      description: 'Закажите услугу в вашем городе. Быстрый выезд мастера 24/7. Прозрачные цены.',
    }
  }
}

export default async function CityServicePage({ params }: CityServicePageProps) {
  const { slug, serviceSlug } = await params
  
  // Fetch city service data, contacts, and delivery zones for SSR
  let initialData: CityServiceResponse | null = null
  let initialContacts: Contact[] = []
  let deliveryZones: DeliveryZone[] = []
  
  try {
    const [cityServiceData, contactsData] = await Promise.all([
      citiesService.getServiceByCity(slug, serviceSlug),
      contentService.getContacts(),
    ])
    initialData = cityServiceData
    initialContacts = contactsData
    
    // Fetch delivery zones if we have city ID
    if (cityServiceData?.city?.id) {
      deliveryZones = await citiesService.getDeliveryZones(cityServiceData.city.id)
    }
  } catch (error) {
    logServerError(error, 'Failed to fetch city service data for SSR', {
      page: '/cities/[slug]/services/[serviceSlug]',
      params: { slug, serviceSlug },
    })
    // Continue - client will try to fetch
  }
  
  // Extract data for SSR hero
  const city = initialData?.city
  const service = initialData?.service
  const seo = initialData?.seo
  const content = initialData?.content
  const optionsCount = initialData?.options?.length ?? 0
  
  const pageTitle = seo?.h1_title || content?.h1_title || 
    (city && service ? `${service.title} в ${city.title}` : 'Услуга в городе')
  // Use short_description as HTML subtitle if available, otherwise use plain text fallback
  const heroHtmlSubtitle = content?.short_description || undefined
  const heroSubtitle = !content?.short_description 
    ? (city && service ? `Закажите ${service.title.toLowerCase()} в ${city.title}. Быстрый выезд мастера, прозрачные цены, работаем 24/7.` : undefined)
    : undefined
  
  return (
    <PageLayout>
      {/* Hero Section - Server-rendered for optimal LCP */}
      <HeroSection
        id="city-service-hero-section"
        title={pageTitle}
        subtitle={heroSubtitle}
        htmlSubtitle={heroHtmlSubtitle}
        breadcrumbs={city && service ? [
          { label: 'Все города', href: '/cities' },
          { label: city.title, href: `/cities/${slug}` },
          { label: service.title }
        ] : undefined}
        containerSize="wide"
      >
        {/* Quick stats - also server-rendered */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            <span>Выезд за 20-30 мин</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <Phone className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
            <span>Работаем 24/7</span>
          </div>
          {optionsCount > 0 && (
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)]" aria-hidden="true" />
              <span>{optionsCount} опций с ценами</span>
            </div>
          )}
        </div>
      </HeroSection>
      
      {/* Main Content - Client component for interactivity */}
      <CityServiceContent 
        citySlug={slug} 
        serviceSlug={serviceSlug}
        initialData={initialData}
        initialContacts={initialContacts}
        deliveryZones={deliveryZones}
      />
    </PageLayout>
  )
}
