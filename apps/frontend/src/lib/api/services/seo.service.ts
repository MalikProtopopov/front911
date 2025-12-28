/**
 * SEO API Service
 * Handles SEO metadata retrieval
 */

import { SeoService } from '../client'
import type { SeoMetaPublic, SeoMeta, PaginatedSeoMetaList } from '../client'
import { ApiError } from '@/lib/errors'

export interface GetSeoMetaParams {
  fullSlug?: string
  pageType?: 'about' | 'city' | 'city_service' | 'contacts' | 'home' | 'service'
  limit?: number
  offset?: number
}

export const seoService = {
  /**
   * Get SEO metadata by slug
   */
  getBySlug: async (slug: string): Promise<SeoMetaPublic | null> => {
    try {
      // Normalize slug
      let normalizedSlug = slug
      if (!normalizedSlug.startsWith('/')) {
        normalizedSlug = '/' + normalizedSlug
      }
      if (!normalizedSlug.endsWith('/')) {
        normalizedSlug = normalizedSlug + '/'
      }

      return await SeoService.websiteSeoMetaBySlugRetrieve(normalizedSlug)
    } catch (error) {
      const apiError = ApiError.fromUnknown(error)
      // Return null for 404 - SEO may not be configured for this page
      if (apiError.isNotFound) {
        return null
      }
      throw apiError
    }
  },

  /**
   * Get SEO metadata by ID
   */
  getById: async (id: number): Promise<SeoMeta> => {
    try {
      return await SeoService.websiteSeoMetaRetrieve(id)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated SEO metadata list
   */
  getList: async (params?: GetSeoMetaParams): Promise<PaginatedSeoMetaList> => {
    try {
      return await SeoService.websiteSeoMetaList(
        params?.fullSlug,
        params?.limit,
        params?.offset,
        undefined,
        params?.pageType
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

