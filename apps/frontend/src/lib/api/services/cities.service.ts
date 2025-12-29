/**
 * Cities API Service
 * Handles all city-related API calls
 */

import { Service } from '../client'
import { OpenAPI } from '../generated'
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
  // All prices for this option in the current city
  // From new endpoint: /api/website/cities/{city_slug}/services/{service_slug}/options/
  prices: Array<{
    amount: string
    technic_category: string | null
  }> | OptionPrice[]
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
   * Get options for service in city using new endpoint
   * GET /api/website/cities/{city_slug}/services/{service_slug}/options/
   */
  getServiceOptionsByCity: async (
    citySlug: string,
    serviceSlug: string,
    technicCategoryId?: number,
    technicCategoryTitle?: string
  ): Promise<CityServiceOption[]> => {
    try {
      const url = `${OpenAPI.BASE}/api/website/cities/${citySlug}/services/${serviceSlug}/options/`
      const queryParams = new URLSearchParams()
      
      if (technicCategoryId) {
        queryParams.append('technic_category', technicCategoryId.toString())
      }
      if (technicCategoryTitle) {
        queryParams.append('technic_category__title', technicCategoryTitle)
      }
      
      const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch options: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform prices from new format to OptionPrice format
      const transformedOptions: CityServiceOption[] = (Array.isArray(data) ? data : []).map((option: any) => {
        // Transform prices array from new format to OptionPrice format
        const transformedPrices: OptionPrice[] = (option.prices || []).map((price: any, index: number) => ({
          id: index, // Temporary ID
          city_slug: citySlug,
          city_title: '', // Will be filled from city data
          technic_category_id: null,
          technic_category_title: price.technic_category || null,
          amount: price.amount,
        }))
        
        return {
          ...option,
          prices: transformedPrices,
        } as CityServiceOption
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[getServiceOptionsByCity] Loaded ${transformedOptions.length} options for ${citySlug}/${serviceSlug}`)
      }
      
      return transformedOptions
    } catch (error) {
      console.error('[getServiceOptionsByCity] Error:', error)
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get service detail in a specific city
   * Uses new endpoint /api/website/cities/{city_slug}/services/{service_slug}/options/ for options
   */
  getServiceByCity: async (
    citySlug: string,
    serviceSlug: string
  ): Promise<CityServiceResponse> => {
    try {
      // Step 1: Get base information (city, service, content, seo)
      const response = await Service.websiteCitiesServicesRetrieve(
        citySlug,
        serviceSlug
      )
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[getServiceByCity] Raw API response:', response)
      }
      
      // Step 2: Load all options with prices using new endpoint
      let optionsWithPrices: CityServiceOption[] = []
      try {
        const url = `${OpenAPI.BASE}/api/website/cities/${citySlug}/services/${serviceSlug}/options/`
        
        const fetchResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!fetchResponse.ok) {
          throw new Error(`Failed to fetch options: ${fetchResponse.status} ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        // Transform prices from new format to OptionPrice format
        const cityTitle = response.city?.title || ''
        optionsWithPrices = (Array.isArray(data) ? data : []).map((option: any) => {
          // Transform prices array from new format to OptionPrice format
          const transformedPrices: OptionPrice[] = (option.prices || []).map((price: any, index: number) => ({
            id: index, // Temporary ID
            city_slug: citySlug,
            city_title: cityTitle,
            technic_category_id: null,
            technic_category_title: price.technic_category || null,
            amount: price.amount,
          }))
          
          return {
            ...option,
            prices: transformedPrices,
          } as CityServiceOption
        })
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[getServiceByCity] Options loaded from new endpoint:', optionsWithPrices.length)
          console.log('[getServiceByCity] Options with prices:', optionsWithPrices)
        }
      } catch (error) {
        console.warn('[getServiceByCity] Failed to load options from new endpoint, falling back to base response:', error)
        // Fallback: use options from base response if available
        const baseOptions = Array.isArray(response?.options) ? response.options : []
        optionsWithPrices = baseOptions.map((option: any) => ({
          ...option,
          prices: option.price ? [{
            id: 0,
            city_slug: citySlug,
            city_title: response.city?.title || '',
            technic_category_id: null,
            technic_category_title: option.price.technic_category,
            amount: option.price.amount,
          }] : [],
        })) as CityServiceOption[]
      }
      
      const mappedResponse: CityServiceResponse = {
        ...response,
        options: optionsWithPrices,
      } as CityServiceResponse
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[getServiceByCity] Final response:', mappedResponse)
        console.log('[getServiceByCity] Options count:', optionsWithPrices.length)
        console.log('[getServiceByCity] Options with prices count:', optionsWithPrices.filter(opt => opt.prices && opt.prices.length > 0).length)
        console.log('[getServiceByCity] Options without prices count:', optionsWithPrices.filter(opt => !opt.prices || opt.prices.length === 0).length)
      }
      
      return mappedResponse
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

