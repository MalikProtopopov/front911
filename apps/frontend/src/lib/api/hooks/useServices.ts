'use client'

/**
 * SWR hooks for Services (Client-side only)
 */

import useSWR from 'swr'
import { servicesService, type GetServicesParams } from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import type { ServiceList, ServiceDetail } from '../generated'

/**
 * Hook to fetch all services
 */
export function useServices(params?: GetServicesParams) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    [QUERY_KEYS.SERVICES.ALL, params],
    async () => {
      try {
        const result = await servicesService.getAll(params)
        // Log for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[useServices] Fetched services:', result?.length || 0, result)
        }
        return result
      } catch (err) {
        // Log error for debugging
        console.error('[useServices] Error fetching services:', err)
        throw err
      }
    },
    {
      ...SWR_CONFIG,
      fallbackData: undefined, // Don't use fallback to properly detect errors
      onError: (error) => {
        console.error('[useServices] SWR error:', error)
      },
    }
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
 */
export function useServiceDetail(slug: string | null | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    slug ? QUERY_KEYS.SERVICES.DETAIL(slug) : null,
    slug ? () => servicesService.getBySlug(slug) : null,
    SWR_CONFIG
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
 */
export function useServiceOptions(slug: string | null | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceDetail>(
    slug ? QUERY_KEYS.SERVICES.OPTIONS(slug) : null,
    slug ? () => servicesService.getOptions(slug) : null,
    SWR_CONFIG
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
