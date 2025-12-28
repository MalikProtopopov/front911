'use client'

/**
 * SWR hooks for SEO (Client-side only)
 */

import useSWR from 'swr'
import { seoService } from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import type { SeoMetaPublic } from '../generated'

/**
 * Hook to fetch SEO metadata by slug
 */
export function useSeoMeta(slug: string | null | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<SeoMetaPublic | null>(
    slug ? QUERY_KEYS.SEO.BY_SLUG(slug) : null,
    slug ? () => seoService.getBySlug(slug) : null,
    SWR_CONFIG
  )

  return {
    seoMeta: data,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
