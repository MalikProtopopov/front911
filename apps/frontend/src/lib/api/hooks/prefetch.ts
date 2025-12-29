/**
 * Server-side prefetch functions (for SSR/SSG)
 * These can be used in Server Components
 */

import { servicesService, citiesService, contentService, seoService } from '../services'
import type { GetServicesParams, GetCitiesParams, GetAdvantagesParams, GetMetricsParams, GetContactsParams } from '../services'
import type { Metadata } from 'next'

// Services prefetch
export async function prefetchServices(params?: GetServicesParams) {
  return servicesService.getAll(params)
}

export async function prefetchServiceDetail(slug: string) {
  return servicesService.getBySlug(slug)
}

export async function prefetchServiceOptions(slug: string) {
  return servicesService.getOptions(slug)
}

// Cities prefetch
export async function prefetchCities(params?: GetCitiesParams) {
  return citiesService.getAll(params)
}

export async function prefetchCityDetail(slug: string) {
  return citiesService.getBySlug(slug)
}

export async function prefetchCityService(citySlug: string, serviceSlug: string) {
  return citiesService.getServiceByCity(citySlug, serviceSlug)
}

// Content prefetch
export async function prefetchAdvantages(params?: GetAdvantagesParams) {
  return contentService.getAdvantages(params)
}

export async function prefetchMetrics(params?: GetMetricsParams) {
  return contentService.getMetrics(params)
}

// Reviews prefetch - not available in current API
// export async function prefetchReviews() {
//   return contentService.getReviews()
// }

export async function prefetchAppLinks() {
  return contentService.getAppLinks()
}

export async function prefetchContacts(params?: GetContactsParams) {
  return contentService.getContacts(params)
}

// SEO prefetch
export async function prefetchSeoMeta(slug: string) {
  return seoService.getBySlug(slug)
}

/**
 * Generate page metadata from API SEO data
 */
export async function generatePageMetadata(
  slug: string,
  fallback: { title: string; description?: string }
): Promise<Metadata> {
  try {
    const seo = await seoService.getBySlug(slug)
    if (!seo) {
      return {
        title: fallback.title,
        description: fallback.description,
      }
    }
    return {
      title: seo.title || fallback.title,
      description: seo.meta_description || fallback.description,
      keywords: seo.meta_keywords,
      openGraph: seo.og_title ? {
        title: seo.og_title,
        description: seo.og_description,
        images: seo.og_image_url ? [seo.og_image_url] : undefined,
      } : undefined,
    }
  } catch {
    return {
      title: fallback.title,
      description: fallback.description,
    }
  }
}

