/**
 * JSON-LD Structured Data Components
 * For SEO rich snippets and better search engine understanding
 */

import type { CityDetail } from '@/lib/api/client'

// Base JSON-LD component
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization schema - use in root layout
export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '911',
        alternateName: '911 Автопомощь',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Экстренная автопомощь: шиномонтаж, эвакуатор, доставка топлива. Работаем 24/7 в 82 городах России.',
        areaServed: {
          '@type': 'Country',
          name: 'Россия',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          areaServed: 'RU',
          availableLanguage: 'Russian',
        },
        sameAs: [
          // Add social media links here when available
        ],
      }}
    />
  )
}

// LocalBusiness schema - use on city pages
export interface LocalBusinessJsonLdProps {
  city: CityDetail
  services?: string[]
}

export function LocalBusinessJsonLd({ city, services = [] }: LocalBusinessJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/cities/${city.slug}`,
        name: `911 Автопомощь — ${city.title}`,
        description: `Экстренная автопомощь в ${city.title}: эвакуатор, шиномонтаж, доставка топлива. Выезд за 15 минут.`,
        url: `${baseUrl}/cities/${city.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.title,
          addressCountry: 'RU',
        },
        areaServed: {
          '@type': 'City',
          name: city.title,
        },
        ...(services.length > 0 && {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Услуги автопомощи',
            itemListElement: services.map((service, index) => ({
              '@type': 'Offer',
              position: index + 1,
              itemOffered: {
                '@type': 'Service',
                name: service,
              },
            })),
          },
        }),
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
        priceRange: '₽₽',
      }}
    />
  )
}

// Service schema - use on service pages
export interface ServiceJsonLdProps {
  name: string
  slug: string
  description: string
  areaServed?: string
}

export function ServiceJsonLd({ name, slug, description, areaServed }: ServiceJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${baseUrl}/services/${slug}`,
        name,
        description,
        url: `${baseUrl}/services/${slug}`,
        provider: {
          '@type': 'Organization',
          name: '911 Автопомощь',
          url: baseUrl,
        },
        ...(areaServed && {
          areaServed: {
            '@type': 'City',
            name: areaServed,
          },
        }),
        serviceType: name,
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: baseUrl,
          availableLanguage: 'Russian',
        },
      }}
    />
  )
}

// BreadcrumbList schema - use on all pages with navigation
export interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  // Ensure all URLs are absolute
  const absoluteItems = items.map((item) => ({
    ...item,
    url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
  }))
  
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: absoluteItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

// FAQ schema - use on FAQ page
export interface FAQItem {
  question: string
  answer: string
}

export function FAQPageJsonLd({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}

// WebSite schema with search - use in root layout
export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: '911 Автопомощь',
        url: baseUrl,
        description: 'Экстренная автопомощь: шиномонтаж, эвакуатор, доставка топлива в 82 городах России.',
        inLanguage: 'ru-RU',
      }}
    />
  )
}

