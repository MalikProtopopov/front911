import { OpenAPI } from './generated'
import { config } from '../config'

// Configure the OpenAPI client with the base URL
// This must be set before any API calls are made
// The BASE URL is required for server-side requests in Next.js
// Fallback to production URL if config is not set
const baseUrl = config.api.baseUrl || 'http://45.144.221.92'
OpenAPI.BASE = baseUrl

// Export everything from generated client
export * from './generated'

// Export services (these now import Service from '../client' which ensures BASE is set)
export * from './services'

// Export hooks
export * from './hooks'

// Export the configured client instance
export { OpenAPI }

