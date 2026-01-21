/**
 * Leads API Service
 * Handles lead form submissions
 */

import { Service } from '../client'
import type { Lead, LeadCreateRequest } from '../client'
import { ApiError } from '@/lib/errors'

/**
 * Lead types for different form contexts
 * - service: Service request from service pages
 * - feedback: Feedback/contact form submissions
 * - partnership: Partnership inquiries
 */
export type LeadType = 'service' | 'feedback' | 'partnership'

export interface CreateLeadData {
  name?: string
  phone: string
  email?: string
  city?: number
  service?: number
  message?: string
  lead_type?: LeadType
  page_url?: string
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
      // Build request body with all available fields
      // Note: lead_type may not be in generated types yet, but API supports it
      const requestBody: LeadCreateRequest & { lead_type?: string; page_url?: string } = {
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
      
      // Add lead_type if provided (defaults to 'service' on backend)
      if (data.lead_type) {
        requestBody.lead_type = data.lead_type
      }
      
      // Add page_url if provided (full URL with query params)
      if (data.page_url) {
        requestBody.page_url = data.page_url
      }

      return await Service.websiteLeadsCreate(requestBody as LeadCreateRequest)
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
 * Get current page path for source_page (path + query params)
 */
export function getCurrentPageUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.pathname + window.location.search
}

/**
 * Get full page URL for page_url (protocol + domain + path + query params)
 */
export function getFullPageUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.href
}

