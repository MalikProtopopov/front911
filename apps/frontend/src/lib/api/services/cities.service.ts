/**
 * Cities API Service
 * Handles all city-related API calls
 */

import { Service } from '../client'
import type { CityList, CityDetail, PaginatedCityListList, ServiceList, OptionPrice } from '../client'
import { ApiError } from '@/lib/errors'
import { contentService } from './content.service'

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
  // Legacy single price (from base endpoint - only one price per option)
  price: {
    amount: string
    technic_category: string | null
  } | null
  // All prices for this option in the current city (from /api/website/options/{id}/)
  prices: OptionPrice[]
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
   * Loads all options for the service and all prices for each option from /api/website/options/{id}/
   * Shows options even if they don't have prices for this city (with "По запросу")
   */
  getServiceByCity: async (
    citySlug: string,
    serviceSlug: string
  ): Promise<CityServiceResponse> => {
    try {
      // Step 1: Get base information (may not include options if they have no prices)
      const response = await Service.websiteCitiesServicesRetrieve(
        citySlug,
        serviceSlug
      )
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[getServiceByCity] Raw API response:', response)
        console.log('[getServiceByCity] Options in response:', response?.options)
        console.log('[getServiceByCity] Options length:', Array.isArray(response?.options) ? response.options.length : 'not an array')
      }
      
      // Step 2: Load all options for this service (even if they don't have prices for this city)
      let allServiceOptions: any[] = []
      try {
        const optionsResponse = await contentService.getOptions({ serviceSlug })
        allServiceOptions = optionsResponse || []
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[getServiceByCity] All service options loaded:', allServiceOptions.length)
        }
      } catch (error) {
        console.warn('[getServiceByCity] Failed to load all options, using base response options:', error)
        // Fallback to options from base response
        allServiceOptions = Array.isArray(response?.options) ? response.options : []
      }
      
      // Step 3: Load all prices for each option in parallel
      const optionsWithAllPrices = await Promise.all(
        allServiceOptions.map(async (option: any) => {
          try {
            // Get all prices for this option
            const optionDetail = await contentService.getOptionById(option.id)
            
            // Filter prices only for the current city
            const cityPrices = optionDetail.prices.filter(
              (price: OptionPrice) => price.city_slug === citySlug
            )
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`[getServiceByCity] Option ${option.id} (${option.title}):`, {
                allPrices: optionDetail.prices.length,
                cityPrices: cityPrices.length,
                prices: cityPrices
              })
            }
            
            return {
              ...option,
              prices: cityPrices, // All prices for this city (may be empty)
            } as CityServiceOption
          } catch (error) {
            // If we can't load option details, use option without prices
            console.warn(`[getServiceByCity] Failed to load prices for option ${option.id}:`, error)
            return {
              ...option,
              prices: [], // No prices available
            } as CityServiceOption
          }
        })
      )
      
      const mappedResponse: CityServiceResponse = {
        ...response,
        options: optionsWithAllPrices,
      } as CityServiceResponse
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[getServiceByCity] Final response:', mappedResponse)
        console.log('[getServiceByCity] Options with prices:', optionsWithAllPrices)
        console.log('[getServiceByCity] Options with prices count:', optionsWithAllPrices.filter(opt => opt.prices.length > 0).length)
        console.log('[getServiceByCity] Options without prices count:', optionsWithAllPrices.filter(opt => opt.prices.length === 0).length)
      }
      
      return mappedResponse
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

