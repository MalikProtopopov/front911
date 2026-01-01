'use client'

/**
 * SWR hooks for Services (SSR-only mode)
 * Uses server-provided initial data, no client-side revalidation
 * Data is loaded on server, client uses SSR data without making API requests
 */

import useSWR, { type SWRConfiguration } from 'swr'
import { servicesService, type GetServicesParams } from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    [servicesKey, params],
    () => servicesService.getAll(params),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
    } as SWRConfiguration<ServiceList[]>
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    cacheKey,
    slug ? () => servicesService.getBySlug(slug) : null,
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
    } as SWRConfiguration<ServiceDetail>
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

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    cacheKey,
    slug ? () => servicesService.getOptions(slug) : null,
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
    } as SWRConfiguration<ServiceDetail>
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
