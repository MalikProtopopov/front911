import { OpenAPI } from './generated'
import { config } from '../config'

// Configure the OpenAPI client with the base URL
// This must be set before any API calls are made
// Default value is set in next.config.ts env section
OpenAPI.BASE = config.api.baseUrl

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  const location = typeof window === 'undefined' ? 'Server' : 'Client'
  console.log(`[API Client ${location}] ========================================`)
  console.log(`[API Client ${location}] OpenAPI.BASE (final):`, OpenAPI.BASE || '(empty - relative URLs)')
  console.log(`[API Client ${location}] Config API baseUrl:`, config.api.baseUrl || '(empty)')
  console.log(`[API Client ${location}] OpenAPI.BASE type:`, typeof OpenAPI.BASE)
  console.log(`[API Client ${location}] Is relative:`, !OpenAPI.BASE || OpenAPI.BASE.startsWith('/'))
  console.log(`[API Client ${location}] ========================================`)
}

// Export everything from generated client
export * from './generated'

// Export services (these now import Service from '../client' which ensures BASE is set)
export * from './services'

// Export hooks
export * from './hooks'

// Export the configured client instance
export { OpenAPI }

