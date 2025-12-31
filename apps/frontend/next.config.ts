import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  
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
  
  // Headers for security and caching
  async headers() {
    // API URL for CSP
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://45.144.221.92'
    const apiOrigin = new URL(apiUrl).origin
    
    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://mc.yandex.com`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob: ${apiOrigin} https://mc.yandex.ru`,
      `font-src 'self' data:`,
      `connect-src 'self' ${apiOrigin} https://mc.yandex.ru https://mc.yandex.com`,
      `frame-src 'self' https://mc.yandex.ru`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          // DNS and connection optimization
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          // Permissions Policy (modern Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
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
