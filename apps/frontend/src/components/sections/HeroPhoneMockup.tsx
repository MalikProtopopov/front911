"use client"

import * as React from "react"
import Image from "next/image"

/**
 * Interactive 3D Phone Mockup - Client Component
 * Separated for optimal LCP - main Hero content renders on server
 * Optimized to reduce forced reflow by caching bounding rect
 */
export function HeroPhoneMockup() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const rafRef = React.useRef<number | null>(null)
  const rectRef = React.useRef<DOMRect | null>(null)

  // Cache bounding rect on mount and resize to avoid forced reflow
  React.useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect()
      }
    }
    
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    
    return () => {
      window.removeEventListener('resize', updateRect)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Use cached rect to avoid forced reflow
    const rect = rectRef.current
    if (!rect) return
    
    // Throttle with requestAnimationFrame
    if (rafRef.current) return
    
    rafRef.current = requestAnimationFrame(() => {
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePosition({ x: x * 20, y: y * 20 })
      rafRef.current = null
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="col-span-6 relative hidden md:flex items-center justify-center py-8"
      onMouseMove={handleMouseMove}
    >
      <div
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        }}
      >
        {/* Phone Frame */}
        <div className="relative w-[280px] h-[570px] md:w-[320px] md:h-[650px] rounded-[48px] bg-gray-900 shadow-2xl p-3">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-white">
            {/* App Screenshot */}
            <div className="absolute inset-0">
              <Image
                src="/images/screenshots/IMG_9066.PNG"
                alt="Мобильное приложение 911"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 280px, 320px"
              />
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
  )
}
