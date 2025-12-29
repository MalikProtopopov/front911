import { MetadataRoute } from 'next'
import { citiesService, servicesService } from '@/lib/api/services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'

  // Fetch all cities and services from API in parallel
  let cities: { slug: string }[] = []
  let services: { slug: string }[] = []
  
  try {
    const [citiesData, servicesData] = await Promise.all([
      citiesService.getAll(),
      servicesService.getAll()
    ])
    cities = citiesData
    services = servicesData
  } catch (error) {
    console.error('Failed to fetch data for sitemap:', error)
    // Fallback to hardcoded values if API fails
    cities = [
      { slug: 'moskva' },
      { slug: 'sankt-peterburg' },
      { slug: 'ekaterinburg' },
      { slug: 'kazan' },
      { slug: 'novosibirsk' },
    ]
    services = [
      { slug: 'shinomontazh' },
      { slug: 'fuel-delivery' },
      { slug: 'evacuator' },
      { slug: 'auto-lift' },
    ]
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/cities',
    '/partners',
    '/about',
    '/contacts',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Service pages
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // City pages
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cities/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // City-service combination pages (all cities × all services)
  const cityServicePages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    services.map((service) => ({
      url: `${baseUrl}/cities/${city.slug}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [...staticPages, ...servicePages, ...cityPages, ...cityServicePages]
}
