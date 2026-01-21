import { OpenAPI } from './generated'
import { config } from '../config'

// Configure the OpenAPI client with dynamic BASE URL
// Uses getter from config to ensure correct URL for client/server
// This is called every time OpenAPI.BASE is accessed
Object.defineProperty(OpenAPI, 'BASE', {
  get() {
    return config.api.baseUrl
  },
  configurable: true,
})

// Export everything from generated client
export * from './generated'

// Export services (these now import Service from '../client' which ensures BASE is set)
export * from './services'

// Export hooks
export * from './hooks'

// Export the configured client instance
export { OpenAPI }

