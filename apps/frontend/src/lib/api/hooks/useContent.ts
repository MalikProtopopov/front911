'use client'

/**
 * SWR hooks for Content (SSR-first mode)
 * Uses server-provided initial data, fetches client-side if SSR data is empty
 */

import useSWR, { type SWRConfiguration } from 'swr'
import {
  contentService,
  type GetAdvantagesParams,
  type GetMetricsParams,
  type GetContactsParams,
} from '../services'
import { QUERY_KEYS, getSWRConfig } from '@/lib/config/constants'
import type { Advantage, Metric, AppLink, Contact } from '../generated'

interface HookOptions<T> {
  fallbackData?: T
}

/**
 * Hook to fetch advantages
 * @param params - Query parameters
 * @param options - SWR options including fallbackData for SSR
 */
export function useAdvantages(
  params?: GetAdvantagesParams,
  options?: HookOptions<Advantage[]>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const advantagesKey = QUERY_KEYS?.ADVANTAGES?.ALL ?? 'advantages'
  
  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData || fallbackData.length === 0

  const { data, error, isLoading, isValidating, mutate } = useSWR<Advantage[]>(
    [advantagesKey, params],
    () => contentService.getAdvantages(params),
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<Advantage[]>
  )

  return {
    advantages: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch metrics
 * @param params - Query parameters
 * @param options - SWR options including fallbackData for SSR
 */
export function useMetrics(
  params?: GetMetricsParams,
  options?: HookOptions<Metric[]>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const metricsKey = QUERY_KEYS?.METRICS?.ALL ?? 'metrics'
  
  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData || fallbackData.length === 0

  const { data, error, isLoading, isValidating, mutate } = useSWR<Metric[]>(
    [metricsKey, params],
    () => contentService.getMetrics(params),
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<Metric[]>
  )

  return {
    metrics: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch app links
 * @param options - SWR options including fallbackData for SSR
 */
export function useAppLinks(options?: HookOptions<AppLink[]>) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const appLinksKey = QUERY_KEYS?.APP_LINKS?.ALL ?? 'app-links'
  
  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData || fallbackData.length === 0

  const { data, error, isLoading, isValidating, mutate } = useSWR<AppLink[]>(
    appLinksKey,
    () => contentService.getAppLinks(),
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<AppLink[]>
  )

  return {
    appLinks: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch contacts
 * @param params - Query parameters (contactType for filtering)
 * @param options - SWR options including fallbackData for SSR
 */
export function useContacts(
  params?: GetContactsParams,
  options?: HookOptions<Contact[]>
) {
  // Create unique cache key based on params with fallback
  const contactsKey = QUERY_KEYS?.CONTACTS?.ALL ?? 'contacts'
  const cacheKey = params?.contactType 
    ? [contactsKey, params.contactType]
    : contactsKey
  
  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData || fallbackData.length === 0

  const { data, error, isLoading, isValidating, mutate } = useSWR<Contact[]>(
    cacheKey,
    () => contentService.getContacts(params),
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<Contact[]>
  )

  return {
    contacts: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
