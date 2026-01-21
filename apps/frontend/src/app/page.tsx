import { Metadata } from 'next'
import { Hero } from "@/components/sections/Hero"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Services } from "@/components/sections/Services"
import { Advantages } from "@/components/sections/Advantages"
import { TrustBar } from "@/components/sections/TrustBar"
import { Reviews } from "@/components/sections/Reviews"
import { Geography } from "@/components/sections/Geography"
import { CTASection } from "@/components/sections/CTASection"
import { servicesService, contentService, citiesService, seoService } from "@/lib/api/services"
import { generatePageSeo } from "@/lib/api/hooks"
import { logServerError } from "@/lib/utils/serverLogger"
import type { SeoMetaPublic } from "@/lib/api/generated"

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/', {
    title: '911 — Экстренная автопомощь за 15 минут',
    description: 'Шиномонтаж, эвакуатор, доставка топлива — проверенные мастера приедут к вам. 82 города России. Работаем 24/7.',
    h1Title: 'Экстренная автопомощь за 15 минут',
  })
  return seo.metadata
}

/**
 * Home Page
 * Main landing page with all sections
 * Uses design system for consistent spacing and layout
 * All data is fetched on the server for SSR
 */
export default async function Home() {
  // Fetch all data on the server in parallel (including SEO)
  const [initialServices, initialAdvantages, initialMetrics, initialCities, initialAppLinks, seoData] = await Promise.all([
    servicesService.getAll({ limit: 4 }).catch((error) => {
      logServerError(error, 'Failed to fetch services for home page SSR', { page: '/' })
      return []
    }),
    contentService.getAdvantages({ targetAudience: 'client', limit: 6 }).catch((error) => {
      logServerError(error, 'Failed to fetch advantages for home page SSR', { page: '/' })
      return []
    }),
    contentService.getMetrics().catch((error) => {
      logServerError(error, 'Failed to fetch metrics for home page SSR', { page: '/' })
      return []
    }),
    citiesService.getAll({ limit: 10 }).catch((error) => {
      logServerError(error, 'Failed to fetch cities for home page SSR', { page: '/' })
      return []
    }),
    contentService.getAppLinks().catch((error) => {
      logServerError(error, 'Failed to fetch app links for home page SSR', { page: '/' })
      return []
    }),
    seoService.getBySlug('/').catch((error) => {
      logServerError(error, 'Failed to fetch SEO for home page SSR', { page: '/' })
      return null
    }) as Promise<SeoMetaPublic | null>,
  ])

  // Get h1_title from SEO API or use default
  const heroTitle = seoData?.h1_title || 'Экстренная автопомощь за 15 минут'

  return (
    <>
      {/* JSON-LD Schema from SEO API */}
      {seoData?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema_json) }}
        />
      )}
      
      <main className="min-h-screen overflow-hidden">
        {/* Hero Section - Full height with gradient background */}
        <Hero title={heroTitle} initialAppLinks={initialAppLinks} />
        
        {/* Services Section - Subtle gray background for contrast */}
        <Services initialServices={initialServices} />
        
        {/* How It Works Section - Clean white background */}
        <HowItWorks />
        
        {/* Advantages Section - Back to white */}
        <Advantages initialAdvantages={initialAdvantages} />
        
        {/* Trust Bar Section - Gradient background with metrics */}
        <TrustBar initialMetrics={initialMetrics} />
        
        {/* Reviews Section - Gray background */}
        <Reviews />
        
        {/* Geography Section - White background */}
        <Geography initialCities={initialCities} />
        
        {/* CTA Section - Final call to action with extra spacing */}
        <CTASection initialAppLinks={initialAppLinks} />
      </main>
    </>
  )
}
