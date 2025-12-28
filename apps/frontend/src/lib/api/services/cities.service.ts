/**
 * Cities API Service
 * Handles all city-related API calls
 */

import { Service } from '../client'
import type { CityList, CityDetail, PaginatedCityListList, ServiceList } from '../client'
import { ApiError } from '@/lib/errors'

export interface GetCitiesParams {
  limit?: number
  offset?: number
  ordering?: string
  search?: string
}

// Extended CityDetail with services (for /cities/{slug}/services/ endpoint)
export interface CityDetailWithServices extends CityDetail {
  services?: ServiceList[]
}

export interface CityServiceOption {
  id: number
  title: string
  service_id: number
  service_title: string
  service_slug: string
  is_active: boolean
  price: {
    amount: string
    technic_category: string | null
  } | null
}

export interface CityServiceResponse {
  city: {
    id: number
    title: string
    slug: string
    partner_count: number
  }
  service: {
    id: number
    title: string
    slug: string
    icon_url?: string
    options_count: number
  }
  options: CityServiceOption[]
  content: {
    meta_title?: string
    meta_description?: string
    h1_title?: string
    description?: string
    how_it_works_html?: string
    benefits_html?: string
    icon_url?: string
    cover_image_url?: string
    city_slug?: string
    city_title?: string
    updated_at?: string
  } | null
  seo: {
    page_type?: string
    title?: string
    meta_description?: string
    meta_keywords?: string
    h1_title?: string
    full_slug?: string
    og_title?: string
    og_description?: string
    og_image_url?: string
    schema_json?: Record<string, unknown>
  } | null
}

export const citiesService = {
  /**
   * Get all cities
   */
  getAll: async (params?: GetCitiesParams): Promise<CityList[]> => {
    try {
      const response = await Service.websiteCitiesList(
        params?.limit,
        params?.offset,
        params?.ordering,
        params?.search
      )
      return response.results ?? []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get paginated cities list
   */
  getPaginated: async (params?: GetCitiesParams): Promise<PaginatedCityListList> => {
    try {
      return await Service.websiteCitiesList(
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
   * Get city detail by slug
   */
  getBySlug: async (slug: string): Promise<CityDetail> => {
    try {
      return await Service.websiteCitiesRetrieve(slug)
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get services available in a city
   * API returns array of services directly
   */
  getServices: async (slug: string): Promise<ServiceList[]> => {
    try {
      const response = await Service.websiteCitiesServicesRetrieve2(slug)
      // API returns array directly (cast needed because generated types are incorrect)
      if (Array.isArray(response)) {
        return response as unknown as ServiceList[]
      }
      // Fallback: try to extract from services field if present
      const responseWithServices = response as unknown as CityDetailWithServices
      if (responseWithServices.services && Array.isArray(responseWithServices.services)) {
        return responseWithServices.services
      }
      return []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get service detail in a specific city
   */
  getServiceByCity: async (
    citySlug: string,
    serviceSlug: string
  ): Promise<CityServiceResponse> => {
    try {
      const response = await Service.websiteCitiesServicesRetrieve(
        citySlug,
        serviceSlug
      )
      return response as unknown as CityServiceResponse
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

