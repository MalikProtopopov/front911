import { Hero } from "@/components/sections/Hero"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Services } from "@/components/sections/Services"
import { Advantages } from "@/components/sections/Advantages"
import { TrustBar } from "@/components/sections/TrustBar"
import { Reviews } from "@/components/sections/Reviews"
import { Geography } from "@/components/sections/Geography"
import { CTASection } from "@/components/sections/CTASection"
import { servicesService, contentService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"

// ISR: revalidate every hour
export const revalidate = 3600

/**
 * Home Page
 * Main landing page with all sections
 * Uses design system for consistent spacing and layout
 * Data is fetched on the server for SSR
 */
export default async function Home() {
  // Fetch data on the server in parallel
  const [initialServices, initialAdvantages, initialMetrics] = await Promise.all([
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
  ])

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section - Full height with gradient background */}
      <Hero />
      
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
      <Geography />
      
      {/* CTA Section - Final call to action with extra spacing */}
      <CTASection />
    </main>
  )
}
