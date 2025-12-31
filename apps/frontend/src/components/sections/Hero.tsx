import { Star } from "lucide-react"
import { DownloadButtons } from "@/components/common"
import { HeroPhoneMockup } from "./HeroPhoneMockup"
import type { AppLink } from "@/lib/api/generated"

interface HeroProps {
  title?: string
  subtitle?: string
  rating?: number
  reviewCount?: number
  initialAppLinks?: AppLink[]
}

/**
 * Hero Section - Server Component for optimal LCP
 * H1 renders immediately without waiting for JS hydration
 * Interactive phone mockup is loaded as client component
 */
export function Hero({
  title = "Экстренная автопомощь за 15 минут",
  subtitle = "Шиномонтаж, эвакуатор, топливо — проверенные мастера приедут к вам. 82 города России.",
  rating = 4.84,
  reviewCount = 2728,
  initialAppLinks = [],
}: HeroProps) {
  return (
    <section 
      id="home-hero-section" 
      className="relative flex items-center pt-20 pb-8 md:pt-24 md:pb-12 lg:pt-28 lg:pb-16 overflow-hidden bg-gradient-to-b from-white to-[var(--background-secondary)]"
    >
      <div className="container mx-auto px-4">
        <div className="grid-12">
          {/* Left Column - Content (columns 1-6 on desktop, full width on mobile/tablet) */}
          <div className="col-span-6 flex flex-col justify-center">
            {/* H1 - Critical for LCP, renders immediately on server */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight section-gap-md">
              {title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--foreground-secondary)] leading-relaxed section-gap-lg">
              {subtitle}
            </p>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-4 section-gap-md">
              <div className="px-4 py-2 text-[var(--foreground-primary)] rounded-full font-bold text-base">
                24/7
              </div>
              <div 
                className="flex items-center gap-2"
                role="img" 
                aria-label={`Рейтинг ${rating} из 5`}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                <span className="font-semibold">{rating}/5</span>
              </div>
              <div className="text-[var(--foreground-secondary)] text-base">
                {reviewCount.toLocaleString('ru-RU')} отзывов
              </div>
            </div>

            {/* App Store Badges */}
            <div className="section-gap-md">
              <DownloadButtons appType="client" initialAppLinks={initialAppLinks} />
            </div>
          </div>

          {/* Right Column - 3D iPhone Mockup (Client Component for interactivity) */}
          <HeroPhoneMockup />
        </div>
      </div>
    </section>
  )
}
