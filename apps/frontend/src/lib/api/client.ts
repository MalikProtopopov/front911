import { OpenAPI } from './generated'
import { config } from '../config'

// Configure the OpenAPI client with the base URL
// This must be set before any API calls are made
// The BASE URL is required for server-side requests in Next.js
const baseUrl = config.api.baseUrl
if (!baseUrl) {
  throw new Error('API base URL is not configured. NEXT_PUBLIC_API_URL must be set.')
}
OpenAPI.BASE = baseUrl

// Export everything from generated client
export * from './generated'

// Export services (these now import Service from '../client' which ensures BASE is set)
export * from './services'

// Export hooks
export * from './hooks'

// Export the configured client instance
export { OpenAPI }

