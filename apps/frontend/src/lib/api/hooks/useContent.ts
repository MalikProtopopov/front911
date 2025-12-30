'use client'

/**
 * SWR hooks for Content (Client-side only)
 * Support server-provided initial data for SSR hydration
 */

import useSWR, { type SWRConfiguration } from 'swr'
import {
  contentService,
  type GetAdvantagesParams,
  type GetMetricsParams,
  type GetContactsParams,
} from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<Advantage[]>(
    [advantagesKey, params],
    () => contentService.getAdvantages(params),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<Advantage[]>
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<Metric[]>(
    [metricsKey, params],
    () => contentService.getMetrics(params),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<Metric[]>
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<AppLink[]>(
    appLinksKey,
    () => contentService.getAppLinks(),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<AppLink[]>
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<Contact[]>(
    cacheKey,
    () => contentService.getContacts(params),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<Contact[]>
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
