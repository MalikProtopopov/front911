'use client'

/**
 * SWR hooks for Cities (Client-side only)
 */

import useSWR from 'swr'
import { citiesService, type GetCitiesParams, type CityServiceResponse } from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import type { CityList, CityDetail, ServiceList } from '../generated'

/**
 * Hook to fetch all cities
 */
export function useCities(params?: GetCitiesParams) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CityList[]>(
    [QUERY_KEYS.CITIES.ALL, params],
    () => citiesService.getAll(params),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
 */
export function useCityDetail(slug: string | null | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CityDetail>(
    slug ? QUERY_KEYS.CITIES.DETAIL(slug) : null,
    () => (slug ? citiesService.getBySlug(slug) : Promise.reject('No slug')),
    SWR_CONFIG
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
 */
export function useCityServices(slug: string | null | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ServiceList[]>(
    slug ? QUERY_KEYS.CITIES.SERVICES(slug) : null,
    () => (slug ? citiesService.getServices(slug) : Promise.reject('No slug')),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
 */
export function useCityService(
  citySlug: string | null | undefined,
  serviceSlug: string | null | undefined
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CityServiceResponse>(
    citySlug && serviceSlug
      ? QUERY_KEYS.CITY_SERVICE.DETAIL(citySlug, serviceSlug)
      : null,
    () =>
      citySlug && serviceSlug
        ? citiesService.getServiceByCity(citySlug, serviceSlug)
        : Promise.reject('Missing slugs'),
    SWR_CONFIG
  )

  return {
    cityService: data,
    city: data?.city,
    service: data?.service,
    options: data?.options ?? [],
    content: data?.content,
    seo: data?.seo,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
