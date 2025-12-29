import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Environment variables with defaults
  env: {
    // Client-side API base (relative URL для проксирования через Next.js)
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || '/api/website',
    // Internal backend URL (только для сервера Next.js, не попадает в браузер)
    API_INTERNAL_BASE: process.env.API_INTERNAL_BASE || (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8001/api/website'  // Локальный backend (для npm run dev)
        : 'http://45.144.221.92/api/website'  // Production backend
    ),
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN || (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'http://89.169.1.53'
    ),
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '911',
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || (
      process.env.NODE_ENV === 'development' ? 'development' : 'production'
    ),
  },
  
  // SEO: Consistent URL structure (no trailing slash)
  trailingSlash: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '45.144.221.92',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  reactStrictMode: true,
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // SEO: Redirects for canonical URL consistency
  async redirects() {
    return [
      // Redirect trailing slash to non-trailing (permanent 301)
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ]
  },
  
  // API Proxy: Rewrites /api/website/* to backend
  // Это работает на сервере Next.js, браузер видит только /api/website/*
  async rewrites() {
    // Backend base URL (without /api/website, as OpenAPI URLs already include it)
    // В dev: бекенд на хосте localhost:8001, из Docker используем host.docker.internal:8001
    // В prod: бекенд в Docker network backend:8000
    const backendBase = process.env.API_INTERNAL_BASE?.replace(/\/api\/website\/?$/, '') || (
      process.env.NODE_ENV === 'development'
        ? 'http://host.docker.internal:8001'  // Из Docker контейнера к хосту
        : 'http://backend:8000'  // В Docker network
    )

    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Next.js Config] API_INTERNAL_BASE from env:', process.env.API_INTERNAL_BASE)
      console.log('[Next.js Rewrites] Backend base:', backendBase)
      console.log('[Next.js Rewrites] Rewriting /api/website/* to:', `${backendBase}/api/website/*`)
    }

    return [
      {
        source: '/api/website/:path*',
        destination: `${backendBase}/api/website/:path*`,
      },
    ]
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

export default nextConfig
