'use client'

/**
 * Client-only hooks for components that need client-side data fetching
 */

import useSWR from 'swr'
import { contentService, citiesService } from '../services'
import { QUERY_KEYS, SWR_CONFIG, PAGINATION } from '@/lib/config/constants'
import type { AppLink, CityList } from '../generated'

/**
 * Helper to find app link by app_type and platform
 */
function findAppLink(
  links: AppLink[],
  appType: 'client' | 'partner',
  platform: 'ios' | 'android'
): AppLink | undefined {
  return links.find(
    (link) => link.app_type === appType && link.platform === platform
  )
}

/**
 * Client-side hook for app links
 * For use in client components only
 */
export function useClientAppLinks() {
  const { data, error, isLoading } = useSWR<AppLink[]>(
    QUERY_KEYS.APP_LINKS.ALL,
    () => contentService.getAppLinks(),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
  )

  const appLinks = data ?? []

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[useClientAppLinks] data:', data, 'error:', error, 'isLoading:', isLoading)
  }

  // Pre-filtered links for client apps (most common use case)
  const clientIosLink = findAppLink(appLinks, 'client', 'ios')
  const clientAndroidLink = findAppLink(appLinks, 'client', 'android')

  return {
    appLinks,
    // Client app links
    clientIosLink,
    clientAndroidLink,
    // Helper function for custom filtering
    getAppLink: (appType: 'client' | 'partner', platform: 'ios' | 'android') =>
      findAppLink(appLinks, appType, platform),
    isLoading,
    isError: !!error,
  }
}

/**
 * Client-side hook for featured cities
 * For use in client components only
 */
export function useClientCities(limit: number = PAGINATION.CITIES_PAGE_SIZE) {
  const { data, error, isLoading } = useSWR<CityList[]>(
    [QUERY_KEYS.CITIES.ALL, { limit }],
    () => citiesService.getAll({ limit }),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
  )

  return {
    cities: data ?? [],
    isLoading,
    isError: !!error,
  }
}

