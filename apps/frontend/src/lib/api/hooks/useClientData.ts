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

interface UseClientAppLinksOptions {
  initialData?: AppLink[]
}

/**
 * Client-side hook for app links
 * For use in client components only
 * Supports SSR with initial data
 */
export function useClientAppLinks(options?: UseClientAppLinksOptions) {
  const initialData = options?.initialData

  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const appLinksKey = QUERY_KEYS?.APP_LINKS?.ALL ?? 'app-links'

  const { data, error, isLoading } = useSWR<AppLink[]>(
    appLinksKey,
    () => contentService.getAppLinks(),
    {
      ...SWR_CONFIG,
      fallbackData: initialData && initialData.length > 0 ? initialData : [],
    }
  )

  const appLinks = data ?? []

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && (!initialData || initialData.length === 0)

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
    isLoading: showLoading,
    isError: !!error,
  }
}

interface UseClientCitiesOptions {
  initialData?: CityList[]
}

/**
 * Client-side hook for featured cities
 * For use in client components only
 * Supports SSR with initial data
 */
export function useClientCities(limit: number = PAGINATION.CITIES_PAGE_SIZE, options?: UseClientCitiesOptions) {
  const initialData = options?.initialData

  // Create cache key with fallback in case QUERY_KEYS is not available during SSR
  const citiesKey = QUERY_KEYS?.CITIES?.ALL ?? 'cities'

  const { data, error, isLoading } = useSWR<CityList[]>(
    [citiesKey, { limit }],
    () => citiesService.getAll({ limit }),
    {
      ...SWR_CONFIG,
      fallbackData: initialData && initialData.length > 0 ? initialData : [],
    }
  )

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && (!initialData || initialData.length === 0)

  return {
    cities: data ?? [],
    isLoading: showLoading,
    isError: !!error,
  }
}
