import { Metadata } from 'next'
import { CityServiceContent } from './CityServiceContent'
import { citiesService, servicesService, contentService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import type { CityServiceResponse } from '@/lib/api/services'
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
    
    // Use SEO data from API if available
    const seoTitle = cityService.seo?.title || cityService.content?.meta_title
    const seoDescription = cityService.seo?.meta_description || cityService.content?.meta_description
    
    const title = seoTitle || `${serviceTitle} в ${cityTitle} — цены, вызов мастера 24/7 | 911`
    const description = seoDescription || `${serviceTitle} в ${cityTitle}: быстрый выезд мастера, прозрачные цены. Работаем круглосуточно.`
    
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
  
  // Fetch city service data and contacts for SSR
  let initialData: CityServiceResponse | null = null
  let initialContacts: Contact[] = []
  
  try {
    const [cityServiceData, contactsData] = await Promise.all([
      citiesService.getServiceByCity(slug, serviceSlug),
      contentService.getContacts(),
    ])
    initialData = cityServiceData
    initialContacts = contactsData
  } catch (error) {
    logServerError(error, 'Failed to fetch city service data for SSR', {
      page: '/cities/[slug]/services/[serviceSlug]',
      params: { slug, serviceSlug },
    })
    // Continue - client will try to fetch
  }
  
  return (
    <CityServiceContent 
      citySlug={slug} 
      serviceSlug={serviceSlug}
      initialData={initialData}
      initialContacts={initialContacts}
    />
  )
}
