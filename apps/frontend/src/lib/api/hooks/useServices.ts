'use client'

/**
 * SWR hooks for Services (Client-side only)
 * Support server-provided initial data for SSR hydration
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
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    [QUERY_KEYS.SERVICES.ALL, params],
    async () => {
      try {
        const result = await servicesService.getAll(params)
        // Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[useServices] Fetched services:', result?.length || 0)
        }
        return result
      } catch (err) {
        console.error('[useServices] Error fetching services:', err)
        throw err
      }
    },
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
      onError: (error) => {
        console.error('[useServices] SWR error:', error)
      },
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
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    slug ? QUERY_KEYS.SERVICES.DETAIL(slug) : null,
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
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    slug ? QUERY_KEYS.SERVICES.OPTIONS(slug) : null,
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
