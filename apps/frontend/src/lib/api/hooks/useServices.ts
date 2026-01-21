'use client'

/**
 * SWR hooks for Services (SSR-first mode)
 * Uses server-provided initial data, fetches client-side if SSR data is empty
 */

import useSWR, { type SWRConfiguration } from 'swr'
import { servicesService, type GetServicesParams } from '../services'
import { QUERY_KEYS, getSWRConfig } from '@/lib/config/constants'
import type { ServiceList, ServiceDetail } from '../generated'

interface HookOptions<T> {
  fallbackData?: T
}

/**
 * Hook to fetch all services
 * @param params - Query parameters for filtering/sorting
 * @param options - SWR options including fallbackData for SSR
 */
export function useServices(
  params?: GetServicesParams,
  options?: HookOptions<ServiceList[]>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const servicesKey = QUERY_KEYS?.SERVICES?.ALL ?? 'services'
  
  // Check if fallback data is empty (SSR failed or returned empty)
  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData || fallbackData.length === 0

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    [servicesKey, params],
    () => servicesService.getAll(params),
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<ServiceList[]>
  )

  return {
    services: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch service detail by slug
 * @param slug - Service slug
 * @param options - SWR options including fallbackData for SSR
 */
export function useServiceDetail(
  slug: string | null | undefined,
  options?: HookOptions<ServiceDetail>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const cacheKey = slug
    ? (QUERY_KEYS?.SERVICES?.DETAIL 
        ? QUERY_KEYS.SERVICES.DETAIL(slug)
        : `services/${slug}`)
    : null

  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    cacheKey,
    slug ? () => servicesService.getBySlug(slug) : null,
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<ServiceDetail>
  )

  return {
    service: data,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch service options
 * @param slug - Service slug
 * @param options - SWR options including fallbackData for SSR
 */
export function useServiceOptions(
  slug: string | null | undefined,
  options?: HookOptions<ServiceDetail>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const cacheKey = slug
    ? (QUERY_KEYS?.SERVICES?.OPTIONS 
        ? QUERY_KEYS.SERVICES.OPTIONS(slug)
        : `services/${slug}/options`)
    : null

  const fallbackData = options?.fallbackData
  const isEmpty = !fallbackData

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    cacheKey,
    slug ? () => servicesService.getOptions(slug) : null,
    getSWRConfig(fallbackData, isEmpty) as SWRConfiguration<ServiceDetail>
  )

  return {
    options: data,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
