/**
 * Central configuration management
 * All environment variables and app configuration in one place
 */

// Validate required environment variables
function getEnvVar(key: string, required = false): string {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ?? ''
}

// Helper to normalize API URL - use 127.0.0.1 instead of localhost for better server-side compatibility
function getApiBaseUrl(): string {
  const envUrl = getEnvVar('NEXT_PUBLIC_API_URL')
  if (envUrl) {
    return envUrl
  }
  // Fallback only for local development
  // In production, this should never be used - NEXT_PUBLIC_API_URL must be set
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: NEXT_PUBLIC_API_URL is not set in production! This is a configuration error.')
    throw new Error('NEXT_PUBLIC_API_URL must be set in production environment')
  }
  // On server-side (SSR), use 127.0.0.1 instead of localhost for better compatibility
  // On client-side, localhost works fine
  const isServer = typeof window === 'undefined'
  return isServer ? 'http://127.0.0.1:8000' : 'http://localhost:8000'
}

export const config = {
  // API Configuration
  api: {
    baseUrl: getApiBaseUrl(),
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

