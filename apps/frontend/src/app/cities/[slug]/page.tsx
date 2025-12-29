import { Metadata } from 'next'
import { CityDetailContent } from './CityDetailContent'
import { citiesService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo'
import type { CityDetail, ServiceList } from '@/lib/api/generated'

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

// Generate metadata with real city data
export async function generateMetadata({ params }: CityDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const city = await citiesService.getBySlug(slug)
    const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
    
    const title = `Автопомощь в ${city.title} — эвакуатор, шиномонтаж 24/7 | 911`
    const description = `Срочная автопомощь в ${city.title}: эвакуатор, мобильный шиномонтаж, доставка топлива. Выезд за 15 минут. ${city.services_count} услуг.`
    
    return {
      title,
      description,
      openGraph: {
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
  
  // Fetch city and services for SSR
  let city: CityDetail | null = null
  let cityServices: ServiceList[] = []
  
  try {
    // Parallel fetch for better performance
    const [cityData, servicesData] = await Promise.all([
      citiesService.getBySlug(slug),
      citiesService.getServices(slug)
    ])
    city = cityData
    cityServices = servicesData
  } catch (error) {
    logServerError(error, 'Failed to fetch city data for SSR', {
      page: '/cities/[slug]',
      params: { slug },
    })
    // Continue - client will try to fetch
  }
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      {city && (
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
      
      <CityDetailContent 
        slug={slug} 
        initialCity={city}
        initialServices={cityServices}
      />
    </>
  )
}
