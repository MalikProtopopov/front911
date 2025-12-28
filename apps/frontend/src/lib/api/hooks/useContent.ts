'use client'

/**
 * SWR hooks for Content (Client-side only)
 */

import useSWR from 'swr'
import {
  contentService,
  type GetAdvantagesParams,
  type GetMetricsParams,
} from '../services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import type { Advantage, Metric, AppLink, Contact } from '../generated'

/**
 * Hook to fetch advantages
 */
export function useAdvantages(params?: GetAdvantagesParams) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Advantage[]>(
    [QUERY_KEYS.ADVANTAGES.ALL, params],
    () => contentService.getAdvantages(params),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
 */
export function useMetrics(params?: GetMetricsParams) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Metric[]>(
    [QUERY_KEYS.METRICS.ALL, params],
    () => contentService.getMetrics(params),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
 */
export function useAppLinks() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<AppLink[]>(
    QUERY_KEYS.APP_LINKS.ALL,
    () => contentService.getAppLinks(),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
 */
export function useContacts() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Contact[]>(
    QUERY_KEYS.CONTACTS.ALL,
    () => contentService.getContacts(),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
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
