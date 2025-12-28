/**
 * Leads API Service
 * Handles lead form submissions
 */

import { Service } from '../client'
import type { Lead, LeadCreateRequest } from '../client'
import { ApiError } from '@/lib/errors'

export interface CreateLeadData {
  name?: string
  phone: string
  email?: string
  city?: number
  service?: number
  message?: string
  source_page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export const leadsService = {
  /**
   * Create a new lead
   */
  create: async (data: CreateLeadData): Promise<Lead> => {
    try {
      const requestBody: LeadCreateRequest = {
        name: data.name ?? '',
        phone: data.phone,
        email: data.email,
        city: data.city,
        service: data.service,
        message: data.message,
        source_page: data.source_page,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
      }

      return await Service.websiteLeadsCreate(requestBody)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

/**
 * Utility to capture UTM parameters from URL
 */
export function captureUtmParams(): Partial<CreateLeadData> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const utmParams: Partial<CreateLeadData> = {}

  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ] as const

  utmKeys.forEach((key) => {
    const value = params.get(key)
    if (value) {
      utmParams[key] = value
    }
  })

  return utmParams
}

/**
 * Get current page URL for source_page
 */
export function getCurrentPageUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.pathname + window.location.search
}

