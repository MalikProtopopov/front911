/**
 * Central configuration management
 * All environment variables and app configuration in one place
 * 
 * ARCHITECTURE:
 * - Client (browser): uses relative URL /api/website (proxied by Next.js)
 * - Server (SSR): uses internal backend URL (from API_INTERNAL_BASE env)
 * 
 * This ensures:
 * 1. Browser never sees Docker hostnames (no ERR_NAME_NOT_RESOLVED)
 * 2. No CORS issues (same-origin requests)
 * 3. SEO-friendly (data available on server for SSR)
 */

// Validate required environment variables
function getEnvVar(key: string, required = false): string {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ?? ''
}

// Check if running on server (Node.js) or client (browser)
const isServer = typeof window === 'undefined'

// Helper to get API base URL
// Client: direct connection to backend (http://localhost:8001)
// Server: internal backend URL (from API_INTERNAL_BASE env or default)
function getApiBaseUrl(): string {
  if (isServer) {
    // Server-side (SSR): use internal backend URL
    // OpenAPI generated URLs already contain /api/website/ prefix
    // So BASE should be just the backend host without /api/website
    const internalUrl = process.env.API_INTERNAL_BASE?.trim()
    if (internalUrl) {
      // Remove /api/website suffix if present (OpenAPI URLs already have it)
      return internalUrl.replace(/\/api\/website\/?$/, '')
    }
    // Fallback based on environment
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:8001'  // Local backend (without /api/website)
      : 'http://45.144.221.92'  // Production backend (without /api/website)
  } else {
    // Client-side (browser): direct connection to backend
    // OpenAPI generated URLs already contain /api/website/ prefix
    // So BASE should be just the backend host without /api/website
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:8001'  // Direct connection to local backend
      : 'http://45.144.221.92'  // Direct connection to production backend
  }
}

const apiBaseUrl = getApiBaseUrl()

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  const location = isServer ? 'Server' : 'Client'
  console.log(`[Config ${location}] ========================================`)
  console.log(`[Config ${location}] API Base URL (final):`, apiBaseUrl || '(empty - relative URLs)')
  console.log(`[Config ${location}] API_INTERNAL_BASE (raw):`, process.env.API_INTERNAL_BASE || '(not set)')
  console.log(`[Config ${location}] NEXT_PUBLIC_API_BASE:`, process.env.NEXT_PUBLIC_API_BASE || '(not set)')
  console.log(`[Config ${location}] NODE_ENV:`, process.env.NODE_ENV)
  console.log(`[Config ${location}] Is Server:`, isServer)
  console.log(`[Config ${location}] ========================================`)
}

export const config = {
  // API Configuration
  api: {
    baseUrl: apiBaseUrl,
    timeout: parseInt(getEnvVar('NEXT_PUBLIC_API_TIMEOUT') || '30000', 10),
  },

  // Application
  app: {
    name: '911',
    domain: getEnvVar('NEXT_PUBLIC_APP_DOMAIN') || 'https://911.ru',
    env: getEnvVar('NEXT_PUBLIC_APP_ENV') || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  // Analytics
  analytics: {
    yandexMetrikaId: getEnvVar('NEXT_PUBLIC_YM_ID'),
    googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
    enabled: !!getEnvVar('NEXT_PUBLIC_YM_ID') || !!getEnvVar('NEXT_PUBLIC_GA_ID'),
  },

  // Feature Flags
  features: {
    reviews: getEnvVar('NEXT_PUBLIC_FEATURE_REVIEWS') !== 'false',
    analytics: getEnvVar('NEXT_PUBLIC_FEATURE_ANALYTICS') !== 'false',
  },

  // Error Tracking
  errorTracking: {
    sentryDsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
    enabled: !!getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
  },

  // Contact Information (fallback)
  contact: {
    phone: getEnvVar('NEXT_PUBLIC_PHONE') || '+79991234567',
    email: getEnvVar('NEXT_PUBLIC_EMAIL') || 'support@911.ru',
  },

  // SEO Defaults
  seo: {
    defaultTitle: '911 — Экстренная автопомощь за 15 минут',
    defaultDescription: 'Шиномонтаж, эвакуатор, доставка топлива — проверенные мастера приедут к вам. 82 города России. Работаем 24/7.',
    defaultKeywords: ['автопомощь', 'шиномонтаж', 'эвакуатор', 'техпомощь', '911'],
    siteName: '911 Автопомощь',
  },
} as const

export type Config = typeof config
