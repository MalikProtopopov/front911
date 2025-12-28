import { Hero } from "@/components/sections/Hero"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Services } from "@/components/sections/Services"
import { Advantages } from "@/components/sections/Advantages"
import { TrustBar } from "@/components/sections/TrustBar"
import { Reviews } from "@/components/sections/Reviews"
import { Geography } from "@/components/sections/Geography"
import { CTASection } from "@/components/sections/CTASection"

/**
 * Home Page
 * Main landing page with all sections
 * Uses design system for consistent spacing and layout
 */
export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section - Full height with gradient background */}
      <Hero />
      
      {/* How It Works Section - Clean white background */}
      <HowItWorks />
      
      {/* Services Section - Subtle gray background for contrast */}
      <Services />
      
      {/* Advantages Section - Back to white */}
      <Advantages />
      
      {/* Trust Bar Section - Gradient background with metrics */}
      <TrustBar />
      
      {/* Reviews Section - Gray background */}
      <Reviews />
      
      {/* Geography Section - White background */}
      <Geography />
      
      {/* CTA Section - Final call to action with extra spacing */}
      <CTASection />
    </main>
  )
}
