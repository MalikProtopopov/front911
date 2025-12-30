'use client'

/**
 * SWR hooks for Cities (Client-side only)
 * Support server-provided initial data for SSR hydration
 */

import useSWR, { type SWRConfiguration } from 'swr'
import { citiesService, type GetCitiesParams, type CityServiceResponse } from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import type { CityList, CityDetail, ServiceList } from '../generated'

interface HookOptions<T> {
  fallbackData?: T
}

/**
 * Hook to fetch all cities
 * @param params - Query parameters for filtering/sorting
 * @param options - SWR options including fallbackData for SSR
 */
export function useCities(
  params?: GetCitiesParams,
  options?: HookOptions<CityList[]>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const citiesKey = QUERY_KEYS?.CITIES?.ALL ?? 'cities'
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<CityList[]>(
    [citiesKey, params],
    () => citiesService.getAll(params),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<CityList[]>
  )

  return {
    cities: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch city detail by slug
 * @param slug - City slug
 * @param options - SWR options including fallbackData for SSR
 */
export function useCityDetail(
  slug: string | null | undefined,
  options?: HookOptions<CityDetail>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const cacheKey = slug
    ? (QUERY_KEYS?.CITIES?.DETAIL 
        ? QUERY_KEYS.CITIES.DETAIL(slug)
        : `cities/${slug}`)
    : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<CityDetail>(
    cacheKey,
    () => (slug ? citiesService.getBySlug(slug) : Promise.reject('No slug')),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
    } as SWRConfiguration<CityDetail>
  )

  return {
    city: data,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch services available in a city
 * @param slug - City slug
 * @param options - SWR options including fallbackData for SSR
 */
export function useCityServices(
  slug: string | null | undefined,
  options?: HookOptions<ServiceList[]>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const cacheKey = slug
    ? (QUERY_KEYS?.CITIES?.SERVICES 
        ? QUERY_KEYS.CITIES.SERVICES(slug)
        : `cities/${slug}/services`)
    : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    cacheKey,
    () => (slug ? citiesService.getServices(slug) : Promise.reject('No slug')),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData ?? [],
    } as SWRConfiguration<ServiceList[]>
  )

  return {
    cityServices: data ?? [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch service detail in a specific city
 * @param citySlug - City slug
 * @param serviceSlug - Service slug
 * @param options - SWR options including fallbackData for SSR
 */
export function useCityService(
  citySlug: string | null | undefined,
  serviceSlug: string | null | undefined,
  options?: HookOptions<CityServiceResponse>
) {
  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const cacheKey = citySlug && serviceSlug
    ? (QUERY_KEYS?.CITY_SERVICE?.DETAIL 
        ? QUERY_KEYS.CITY_SERVICE.DETAIL(citySlug, serviceSlug)
        : `cities/${citySlug}/services/${serviceSlug}`)
    : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<CityServiceResponse>(
    cacheKey,
    () =>
      citySlug && serviceSlug
        ? citiesService.getServiceByCity(citySlug, serviceSlug)
        : Promise.reject('Missing slugs'),
    {
      ...SWR_CONFIG,
      fallbackData: options?.fallbackData,
    } as SWRConfiguration<CityServiceResponse>
  )

  // Ensure options is always an array
  const optionsArray = Array.isArray(data?.options) 
    ? data.options 
    : (Array.isArray(options?.fallbackData?.options) 
        ? options.fallbackData.options 
        : [])

  return {
    cityService: data,
    city: data?.city,
    service: data?.service,
    options: optionsArray,
    content: data?.content,
    seo: data?.seo,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
