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
  const { data, error, isLoading, isValidating, mutate } = useSWR<Advantage[]>(
    [QUERY_KEYS.ADVANTAGES.ALL, params],
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
  const { data, error, isLoading, isValidating, mutate } = useSWR<Metric[]>(
    [QUERY_KEYS.METRICS.ALL, params],
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
  const { data, error, isLoading, isValidating, mutate } = useSWR<AppLink[]>(
    QUERY_KEYS.APP_LINKS.ALL,
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
  // Create unique cache key based on params
  const cacheKey = params?.contactType 
    ? [QUERY_KEYS.CONTACTS.ALL, params.contactType]
    : QUERY_KEYS.CONTACTS.ALL

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
