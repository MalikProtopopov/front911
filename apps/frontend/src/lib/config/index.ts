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

// Helper to get API base URL
// Default values are set in next.config.ts env section
function getApiBaseUrl(): string {
  // NEXT_PUBLIC_API_URL is set via next.config.ts with default value
  // This ensures it's always available on both server and client
  return getEnvVar('NEXT_PUBLIC_API_URL') || 'http://45.144.221.92'
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

