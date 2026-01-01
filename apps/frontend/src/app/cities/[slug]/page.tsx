import { Metadata } from 'next'
import { Clock, Phone, Star } from 'lucide-react'
import { CityDetailContent } from './CityDetailContent'
import { citiesService, contentService, seoService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo'
import { HeroSection } from '@/components/patterns'
import { PageLayout } from '@/components/layout'
import type { CityDetail, ServiceList, Contact, SeoMetaPublic } from '@/lib/api/generated'
import type { DeliveryZone } from '@/lib/api/services'

interface CityDetailPageProps {
  params: Promise<{ slug: string }>
}

// ISR: revalidate every hour
export const revalidate = 3600

// Allow dynamic params for cities not in generateStaticParams
export const dynamicParams = true

// Generate static paths for all cities
export async function generateStaticParams() {
  try {
    const cities = await citiesService.getAll()
    return cities.map((city) => ({
      slug: city.slug,
    }))
  } catch (error) {
    logServerError(error, 'Failed to generate static params for cities', {
      page: '/cities/[slug]',
    })
    // Fallback to empty array - pages will be generated on-demand
    return []
  }
}

// Generate metadata with SEO API priority, then city data, then fallback
export async function generateMetadata({ params }: CityDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  const seoSlug = `/cities/${slug}/`
  
  try {
    // Fetch SEO and city data in parallel
    const [seoData, city] = await Promise.all([
      seoService.getBySlug(seoSlug).catch(() => null),
      citiesService.getBySlug(slug),
    ])
    
    // Use meta_title and meta_description from backend if available
    const cityContent = city.content as {
      meta_title?: string
      meta_description?: string
      partner_count?: number
    } | undefined
    
    const partnerCount = cityContent?.partner_count
    
    // Priority: SEO API > city.content > fallback formula
    const title = seoData?.title || cityContent?.meta_title || `Автопомощь в ${city.title} — эвакуатор, шиномонтаж 24/7 | 911`
    const description = seoData?.meta_description || cityContent?.meta_description || 
      `Срочная автопомощь в ${city.title}: эвакуатор, мобильный шиномонтаж, доставка топлива. Выезд за 15 минут.${partnerCount ? ` ${partnerCount} мастеров.` : ''}`
    
    return {
      title,
      description,
      keywords: seoData?.meta_keywords,
      openGraph: seoData?.og_title ? {
        title: seoData.og_title,
        description: seoData.og_description,
        images: seoData.og_image_url ? [seoData.og_image_url] : undefined,
        type: 'website',
      } : {
        title,
        description,
        type: 'website',
      },
      alternates: {
        canonical: `${baseUrl}/cities/${slug}`,
      },
    }
  } catch {
    // Fallback metadata if city not found
    return {
      title: 'Автопомощь в городе — 911',
      description: 'Шиномонтаж, эвакуатор, доставка топлива. Быстрый выезд мастера 24/7.',
    }
  }
}

export default async function CityPage({ params }: CityDetailPageProps) {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  const seoSlug = `/cities/${slug}/`
  
  // Fetch city, services, contacts, delivery zones and SEO for SSR
  let city: CityDetail | null = null
  let cityServices: ServiceList[] = []
  let initialContacts: Contact[] = []
  let deliveryZones: DeliveryZone[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    // Parallel fetch for better performance
    const [cityData, servicesData, contactsData, seoResult] = await Promise.all([
      citiesService.getBySlug(slug),
      citiesService.getServices(slug),
      contentService.getContacts(),
      seoService.getBySlug(seoSlug).catch(() => null),
    ])
    city = cityData
    cityServices = servicesData
    initialContacts = contactsData
    seoData = seoResult
    
    // Fetch delivery zones if we have city ID
    if (cityData?.id) {
      deliveryZones = await citiesService.getDeliveryZones(cityData.id)
    }
  } catch (error) {
    logServerError(error, 'Failed to fetch city data for SSR', {
      page: '/cities/[slug]',
      params: { slug },
    })
    // Continue - client will try to fetch
  }
  
  // Extract city content for SSR hero
  const cityContent = city?.content as {
    h1_title?: string
    short_description?: string
    avg_rating?: string
    review_count?: number
  } | undefined
  
  // Priority: SEO API > city.content > fallback
  const heroTitle = seoData?.h1_title || cityContent?.h1_title || (city ? `Автопомощь в ${city.title}` : 'Автопомощь в городе')
  // Use short_description as HTML subtitle if available, otherwise use plain text fallback
  const heroHtmlSubtitle = cityContent?.short_description || undefined
  const heroSubtitle = !cityContent?.short_description 
    ? (city ? `Вызовите мастера для шиномонтажа, эвакуации или доставки топлива в ${city.title}. Работаем круглосуточно, приедем за 15-30 минут.` : undefined)
    : undefined
  
  return (
    <>
      {/* JSON-LD Schema from SEO API (priority) */}
      {seoData?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema_json) }}
        />
      )}
      
      {/* Fallback JSON-LD Structured Data */}
      {city && !seoData?.schema_json && (
        <>
          <LocalBusinessJsonLd city={city} services={cityServices.map(s => s.title)} />
          <BreadcrumbJsonLd
            items={[
              { name: 'Главная', url: baseUrl },
              { name: 'Города', url: `${baseUrl}/cities` },
              { name: city.title, url: `${baseUrl}/cities/${slug}` },
            ]}
          />
        </>
      )}
      
      <PageLayout>
        {/* Hero Section - Server-rendered for optimal LCP */}
        <HeroSection
          id="city-detail-hero-section"
          title={heroTitle}
          subtitle={heroSubtitle}
          htmlSubtitle={heroHtmlSubtitle}
          breadcrumbs={city ? [
            { label: 'Все города', href: '/cities' },
            { label: city.title }
          ] : undefined}
          containerSize="wide"
        >
          {/* Quick stats - also server-rendered */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Круглосуточно</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
              <Phone className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Приедем за 15-30 мин</span>
            </div>
            {cityContent?.avg_rating && parseFloat(cityContent.avg_rating) > 0 && (
              <div 
                className="flex items-center gap-2 text-[var(--foreground-secondary)]"
                role="img"
                aria-label={`Рейтинг ${cityContent.avg_rating} из 5`}
              >
                <Star className="w-5 h-5 text-[var(--color-warning)]" aria-hidden="true" />
                <span>{cityContent.avg_rating} ({cityContent?.review_count || 0} отзывов)</span>
              </div>
            )}
          </div>
        </HeroSection>
        
        {/* Main Content - Client component for interactivity */}
        <CityDetailContent 
          slug={slug} 
          initialCity={city}
          initialServices={cityServices}
          initialContacts={initialContacts}
          deliveryZones={deliveryZones}
        />
      </PageLayout>
    </>
  )
}
