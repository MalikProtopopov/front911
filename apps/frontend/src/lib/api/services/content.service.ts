/**
 * Content API Service
 * Handles advantages, metrics, contacts, and app links
 */

import { Service } from '../client'
import type {
  Advantage,
  Metric,
  Contact,
  AppLink,
  PaginatedAdvantageList,
  PaginatedMetricList,
  PaginatedContactList,
  PaginatedAppLinkList,
  OptionList,
  OptionDetail,
  TechnicCategory,
  PaginatedOptionListList,
  PaginatedTechnicCategoryList,
} from '../client'
import { ApiError } from '@/lib/errors'

// Advantages
export interface GetAdvantagesParams {
  targetAudience?: 'client' | 'partner' | 'both'
  limit?: number
  offset?: number
}

// Metrics
export interface GetMetricsParams {
  metricType?: 'platform' | 'partner' | 'client'
  isVisibleOnSite?: boolean
  visibleOnly?: boolean
  limit?: number
  offset?: number
}

// Contacts
export interface GetContactsParams {
  contactType?: 'phone' | 'email' | 'telegram' | 'whatsapp' | 'vk' | 'instagram' | 'facebook'
  limit?: number
  offset?: number
}

// App Links
export interface GetAppLinksParams {
  platform?: 'ios' | 'android'
  appType?: 'client' | 'partner'
  limit?: number
  offset?: number
}

// Options
export interface GetOptionsParams {
  service?: number
  serviceSlug?: string
  search?: string
  limit?: number
  offset?: number
}

export const contentService = {
  // ========== Advantages ==========
  
  /**
   * Get all advantages
   */
  getAdvantages: async (params?: GetAdvantagesParams): Promise<Advantage[]> => {
    try {
      const response = await Service.websiteAdvantagesList(
        params?.limit,
        params?.offset,
        undefined,
        params?.targetAudience
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated advantages
   */
  getAdvantagesPaginated: async (
    params?: GetAdvantagesParams
  ): Promise<PaginatedAdvantageList> => {
    try {
      return await Service.websiteAdvantagesList(
        params?.limit,
        params?.offset,
        undefined,
        params?.targetAudience
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  // ========== Metrics ==========

  /**
   * Get all metrics
   */
  getMetrics: async (params?: GetMetricsParams): Promise<Metric[]> => {
    try {
      const response = await Service.websiteMetricsList(
        params?.isVisibleOnSite,
        params?.limit,
        params?.metricType,
        params?.offset,
        undefined,
        params?.visibleOnly
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated metrics
   */
  getMetricsPaginated: async (
    params?: GetMetricsParams
  ): Promise<PaginatedMetricList> => {
    try {
      return await Service.websiteMetricsList(
        params?.isVisibleOnSite,
        params?.limit,
        params?.metricType,
        params?.offset,
        undefined,
        params?.visibleOnly
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  // ========== Contacts ==========

  /**
   * Get all contacts
   */
  getContacts: async (params?: GetContactsParams): Promise<Contact[]> => {
    try {
      const response = await Service.websiteContactsList(
        params?.contactType,
        params?.limit,
        params?.offset
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated contacts
   */
  getContactsPaginated: async (
    params?: GetContactsParams
  ): Promise<PaginatedContactList> => {
    try {
      return await Service.websiteContactsList(
        params?.contactType,
        params?.limit,
        params?.offset
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  // ========== App Links ==========

  /**
   * Get all app links
   */
  getAppLinks: async (params?: GetAppLinksParams): Promise<AppLink[]> => {
    try {
      const response = await Service.websiteAppLinksList(
        params?.appType,
        params?.limit,
        params?.offset,
        params?.platform
      )
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('[contentService.getAppLinks] response:', response)
      }
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        return response
      }
      return response.results ?? []
    } catch (error) {
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.error('[contentService.getAppLinks] error:', error)
      }
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated app links
   */
  getAppLinksPaginated: async (
    params?: GetAppLinksParams
  ): Promise<PaginatedAppLinkList> => {
    try {
      return await Service.websiteAppLinksList(
        params?.appType,
        params?.limit,
        params?.offset,
        params?.platform
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  // ========== Options ==========

  /**
   * Get all options
   */
  getOptions: async (params?: GetOptionsParams): Promise<OptionList[]> => {
    try {
      const response = await Service.websiteOptionsList(
        params?.limit,
        params?.offset,
        undefined,
        params?.search,
        params?.service,
        params?.serviceSlug
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated options
   */
  getOptionsPaginated: async (
    params?: GetOptionsParams
  ): Promise<PaginatedOptionListList> => {
    try {
      return await Service.websiteOptionsList(
        params?.limit,
        params?.offset,
        undefined,
        params?.search,
        params?.service,
        params?.serviceSlug
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get option detail
   */
  getOptionById: async (id: number): Promise<OptionDetail> => {
    try {
      return await Service.websiteOptionsRetrieve(id)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get options by city
   */
  getOptionsByCity: async (
    city: string,
    service?: string
  ): Promise<OptionDetail> => {
    try {
      return await Service.websiteOptionsByCityRetrieve(city, service)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  // ========== Technic Categories ==========

  /**
   * Get technic categories
   */
  getTechnicCategories: async (params?: {
    service?: number
    serviceSlug?: string
    limit?: number
    offset?: number
  }): Promise<TechnicCategory[]> => {
    try {
      const response = await Service.websiteTechnicCategoriesList(
        params?.limit,
        params?.offset,
        params?.service,
        params?.serviceSlug
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated technic categories
   */
  getTechnicCategoriesPaginated: async (params?: {
    service?: number
    serviceSlug?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedTechnicCategoryList> => {
    try {
      return await Service.websiteTechnicCategoriesList(
        params?.limit,
        params?.offset,
        params?.service,
        params?.serviceSlug
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

