/**
 * Services API Service
 * Handles all service-related API calls
 */

import { Service } from '../client'
import type { ServiceList, ServiceDetail, PaginatedServiceListList } from '../client'
import { ApiError } from '@/lib/errors'

export interface GetServicesParams {
  limit?: number
  offset?: number
  ordering?: string
  search?: string
}

export const servicesService = {
  /**
   * Get all services
   */
  getAll: async (params?: GetServicesParams): Promise<ServiceList[]> => {
    try {
      // API возвращает массив напрямую, но сгенерированный клиент типизирован как PaginatedServiceListList
      // Используем type assertion, так как мы знаем реальный формат ответа
      const response = await Service.websiteServicesList(
        params?.limit,
        params?.offset,
        params?.ordering,
        params?.search
      ) as unknown as ServiceList[] | PaginatedServiceListList
      
      // API может возвращать либо массив напрямую, либо PaginatedServiceListList с полем results
      // Проверяем тип ответа и извлекаем массив услуг
      let results: ServiceList[] = []
      
      if (Array.isArray(response)) {
        // API вернул массив напрямую (как в текущей версии API)
        results = response
      } else if (response && typeof response === 'object' && 'results' in response) {
        // API вернул пагинированный ответ с полем results
        results = response.results ?? []
      } else {
        // Неожиданный формат ответа
        console.warn('[servicesService.getAll] Unexpected response format:', response)
        results = []
      }
      
      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[servicesService.getAll] API response:', {
          responseType: Array.isArray(response) ? 'array' : typeof response,
          resultsCount: results.length,
          results: results.map(s => ({ slug: s.slug, title: s.title }))
        })
      }
      
      return results
    } catch (error) {
      // Log error for debugging
      console.error('[servicesService.getAll] Error:', error)
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated services list
   */
  getPaginated: async (params?: GetServicesParams): Promise<PaginatedServiceListList> => {
    try {
      return await Service.websiteServicesList(
        params?.limit,
        params?.offset,
        params?.ordering,
        params?.search
      )
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get service detail by slug
   */
  getBySlug: async (slug: string): Promise<ServiceDetail> => {
    try {
      return await Service.websiteServicesRetrieve(slug)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get service options by slug
   */
  getOptions: async (slug: string): Promise<ServiceDetail> => {
    try {
      return await Service.websiteServicesOptionsRetrieve(slug)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

