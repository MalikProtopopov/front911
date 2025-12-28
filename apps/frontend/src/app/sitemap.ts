import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'

  // Static pages
  const staticPages = [
    '',
    '/services',
    '/cities',
    '/partners',
    '/about',
    '/contacts',
    '/faq',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Services pages
  const services = ['shinomontazh', 'fuel-delivery', 'evacuator', 'auto-lift']
  const servicePages = services.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Cities pages (top 10 for example)
  const cities = ['moskva', 'sankt-peterburg', 'ekaterinburg', 'kazan', 'novosibirsk']
  const cityPages = cities.map((slug) => ({
    url: `${baseUrl}/cities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...cityPages]
}

