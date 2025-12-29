/**
 * Application-wide constants
 * Values that don't change based on environment
 */

// API Query Keys for SWR caching
export const QUERY_KEYS = {
  SERVICES: {
    ALL: 'services',
    DETAIL: (slug: string) => `services/${slug}`,
    OPTIONS: (slug: string) => `services/${slug}/options`,
  },
  CITIES: {
    ALL: 'cities',
    DETAIL: (slug: string) => `cities/${slug}`,
    SERVICES: (citySlug: string) => `cities/${citySlug}/services`,
  },
  CITY_SERVICE: {
    DETAIL: (citySlug: string, serviceSlug: string) => 
      `cities/${citySlug}/services/${serviceSlug}`,
  },
  REVIEWS: {
    ALL: 'reviews',
    BY_SERVICE: (serviceSlug: string) => `reviews/service/${serviceSlug}`,
    BY_CITY: (citySlug: string) => `reviews/city/${citySlug}`,
  },
  METRICS: {
    ALL: 'metrics',
  },
  ADVANTAGES: {
    ALL: 'advantages',
  },
  APP_LINKS: {
    ALL: 'app-links',
  },
  CONTACTS: {
    ALL: 'contacts',
  },
  SEO: {
    BY_SLUG: (slug: string) => `seo/${slug}`,
  },
} as const

// SWR Configuration defaults
export const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  CITIES_PAGE_SIZE: 20,
  SERVICES_PAGE_SIZE: 10,
  REVIEWS_PAGE_SIZE: 5,
} as const

// Animation durations (in ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const

// Breakpoints (should match Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: '911-theme',
  STORE: '911-store',
  UTM_PARAMS: '911-utm',
  LEAD_FORM_DRAFT: '911-lead-draft',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  SERVICE_DETAIL: (slug: string) => `/services/${slug}`,
  CITIES: '/cities',
  CITY_DETAIL: (slug: string) => `/cities/${slug}`,
  CITY_SERVICE: (citySlug: string, serviceSlug: string) => 
    `/cities/${citySlug}/services/${serviceSlug}`,
  ABOUT: '/about',
  CONTACTS: '/contacts',
  PARTNERS: '/partners',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
} as const

/**
 * External Links (FALLBACK VALUES)
 * These are used as fallbacks when API is unavailable.
 * Primary source of contacts data is /api/website/contacts/
 */
export const EXTERNAL_LINKS = {
  APP_STORE: 'https://apps.apple.com/app/911',
  GOOGLE_PLAY: 'https://play.google.com/store/apps/details?id=ru.911',
  TELEGRAM: 'https://t.me/service911',
  VK: 'https://vk.com/service911',
  WHATSAPP: '79991234567',
} as const

/**
 * Contact Information (FALLBACK VALUES)
 * These are used as fallbacks when API is unavailable.
 * Primary source of contacts data is /api/website/contacts/
 * @see lib/utils/contacts.ts for fallback utilities
 */
export const CONTACT_INFO = {
  /** Formatted phone for display */
  PHONE: '+7 (999) 123-45-67',
  /** Raw phone for tel: links */
  PHONE_RAW: '+79991234567',
  EMAIL: 'info@911.ru',
  ADDRESS: 'Москва, ул. Примерная, д. 1',
  WHATSAPP: '79991234567',
} as const

// Meta
export const META = {
  VIEWPORT: 'width=device-width, initial-scale=1, maximum-scale=5',
  THEME_COLOR: '#FF5722',
  ROBOTS: {
    INDEX: 'index, follow',
    NOINDEX: 'noindex, nofollow',
  },
} as const

