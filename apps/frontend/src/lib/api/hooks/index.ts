/**
 * API Hooks Index
 * 
 * Client-side hooks should be imported in 'use client' components only.
 * Server-side prefetch functions can be used anywhere.
 */

// Server-side prefetch functions (can be used in Server Components)
export {
  // Services
  prefetchServices,
  prefetchServiceDetail,
  prefetchServiceOptions,
  // Cities
  prefetchCities,
  prefetchCityDetail,
  prefetchCityService,
  // Content
  prefetchAdvantages,
  prefetchMetrics,
  prefetchAppLinks,
  prefetchContacts,
  // SEO
  prefetchSeoMeta,
  generatePageMetadata,
} from './prefetch'

// Re-export client hooks (these will only work in 'use client' components)
// Note: Components importing these must have 'use client' directive
export { useServices, useServiceDetail, useServiceOptions } from './useServices'
export { useCities, useCityDetail, useCityServices, useCityService } from './useCities'
export { useAdvantages, useMetrics, useAppLinks, useContacts } from './useContent'
export { useSeoMeta } from './useSeo'
export { useLeadForm } from './useLeadForm'
export { useClientAppLinks, useClientCities } from './useClientData'
