"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { DownloadButtons } from "@/components/common"

interface HeroProps {
  title?: string
  subtitle?: string
  rating?: number
  reviewCount?: number
}

export function Hero({
  title = "Экстренная автопомощь за 15 минут",
  subtitle = "Шиномонтаж, эвакуатор, топливо — проверенные мастера приедут к вам. 82 города России.",
  rating = 4.84,
  reviewCount = 2728,
}: HeroProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x: x * 20, y: y * 20 })
  }

  return (
    <section id="home-hero-section" className="relative min-h-screen flex items-center pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-white to-[var(--background-secondary)]">
      <div className="container mx-auto px-4">
        <div className="grid-12">
          {/* Left Column - Content (columns 1-6 on desktop, full width on mobile/tablet) */}
          <div className="col-span-6 flex flex-col justify-center animate-fade-in">
            {/* H1 */}
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
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{rating}/5</span>
              </div>
              <div className="text-[var(--foreground-secondary)] text-base">
                {reviewCount.toLocaleString('ru-RU')} отзывов
              </div>
            </div>

            {/* App Store Badges */}
            <div className="section-gap-md">
              <DownloadButtons appType="client" />
            </div>
          </div>

          {/* Right Column - 3D iPhone Mockup (columns 7-12 on desktop, full width on mobile/tablet) */}
          <div
            className="col-span-6 relative hidden md:flex items-center justify-center py-8"
            onMouseMove={handleMouseMove}
          >
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
              }}
            >
              {/* Phone Frame */}
              <div className="relative w-[280px] h-[570px] md:w-[320px] md:h-[650px] rounded-[48px] bg-gray-900 shadow-2xl p-3">
                {/* Screen */}
                <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-white">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-900 z-10">
                    <div className="flex items-center justify-between px-6 h-full text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-3 border border-white rounded-sm"></div>
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Screenshot */}
                  <div className="absolute inset-0 pt-10 pb-2 px-2">
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-3xl p-6 flex flex-col gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
                          911
                        </div>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                          Автопомощь
                        </p>
                      </div>

                      <div className="space-y-3 flex-1">
                        {['Шиномонтаж', 'Эвакуатор', 'Доставка топлива', 'Техпомощь'].map((service, i) => (
                          <div
                            key={service}
                            className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3"
                            style={{
                              animation: `fadeIn 0.5s ease-out ${i * 0.1}s backwards`,
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]"></div>
                            </div>
                            <span className="font-medium text-sm">{service}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-semibold shadow-lg">
                        Заказать услугу
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[var(--color-primary)]/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

