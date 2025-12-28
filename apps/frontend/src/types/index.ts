/**
 * TypeScript types for the 911 Corporate Website
 */

// Service types
export interface Service {
  id: number
  title: string
  slug: string
  icon_url?: string
  short_description?: string
  full_description?: string
  is_active: boolean
  display_order: number
  created_at: string
}

// City types
export interface City {
  id: number
  title: string
  slug: string
  is_active: boolean
  display_order: number
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

// Option types
export interface Option {
  id: number
  title: string
  description?: string
  service_id: number
  service_title: string
  service_slug: string
  is_active: boolean
}

// Price types
export interface Price {
  id: number
  city_slug: string
  city_title: string
  technic_category_id?: number
  technic_category_title?: string
  amount: string
}

// Advantage types
export interface Advantage {
  id: number
  target_audience: 'client' | 'partner' | 'both'
  title: string
  description: string
  icon_name: string
  display_order: number
  is_active: boolean
}

// Metric types
export interface Metric {
  id: number
  metric_key: string
  value: string
  display_label: string
  description?: string
  metric_type: string
  is_visible_on_site: boolean
  icon_name?: string
  display_order: number
  last_updated: string
}

// Contact types
export interface Contact {
  id: number
  contact_type: 'phone' | 'email' | 'telegram' | 'whatsapp' | 'vk' | 'instagram' | 'facebook'
  value: string
  label: string
  icon_name?: string
  is_active: boolean
  display_order: number
}

// App Link types
export interface AppLink {
  id: number
  platform: 'ios' | 'android'
  app_type: 'client' | 'partner'
  store_url: string
  qr_code_url?: string
  version?: string
  is_active: boolean
}

// SEO Meta types
export interface SeoMeta {
  page_type: 'home' | 'city' | 'service' | 'city_service' | 'about' | 'contacts'
  title: string
  meta_description: string
  meta_keywords?: string
  h1_title: string
  full_slug: string
  og_title?: string
  og_description?: string
  og_image_url?: string
  schema_json?: any
}

// Lead types
export interface Lead {
  name: string
  phone: string
  email?: string
  city?: number
  service?: number
  message?: string
  source_page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// City + Service combined page data
export interface CityServiceData {
  city: City
  service: Service
  options: Option[]
  content: any
  seo: SeoMeta | null
}

