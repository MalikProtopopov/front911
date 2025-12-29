import { OpenAPI } from './generated'
import { config } from '../config'

// Configure the OpenAPI client with the base URL
// This must be set before any API calls are made
// Default value is set in next.config.ts env section
OpenAPI.BASE = config.api.baseUrl

// Export everything from generated client
export * from './generated'

// Export services (these now import Service from '../client' which ensures BASE is set)
export * from './services'

// Export hooks
export * from './hooks'

// Export the configured client instance
export { OpenAPI }

