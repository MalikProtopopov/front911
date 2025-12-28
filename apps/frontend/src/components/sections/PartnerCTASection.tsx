'use client'

import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"
import { useClientAppLinks } from "@/lib/api/hooks"
import { analytics } from "@/lib/analytics"

export function PartnerCTASection() {
  const { appLinks, getAppLink, isLoading } = useClientAppLinks()
  
  // Get partner app links
  const partnerIosLink = getAppLink('partner', 'ios')
  const partnerAndroidLink = getAppLink('partner', 'android')
  
  // Don't render if no partner app links available
  const hasPartnerLinks = partnerIosLink || partnerAndroidLink
  
  const handleAppClick = (platform: 'ios' | 'android') => {
    analytics.trackInstallIntent(platform, 'partner_cta_section')
  }

  // Show loading or nothing if no links
  if (isLoading) {
    return (
      <section className="section-spacing-lg" id="partner-download">
        <div className="container mx-auto px-4">
          <div 
            className="relative overflow-hidden rounded-3xl text-white animate-pulse"
            style={{
              padding: 'clamp(24px, 4vw, 48px) clamp(24px, 4vw, 56px)',
              background: 'linear-gradient(135deg, #2C3E50 0%, #1A252F 50%, #0f1419 100%)',
              minHeight: '220px',
            }}
          />
        </div>
      </section>
    )
  }

  if (!hasPartnerLinks) {
    return null
  }

  return (
    <section className="section-spacing-lg" id="partner-download">
      <div className="container mx-auto px-4">
        {/* Main CTA Card */}
        <div 
          className="relative overflow-hidden rounded-3xl text-white"
          style={{
            padding: 'clamp(24px, 4vw, 48px) clamp(24px, 4vw, 56px)',
            background: 'linear-gradient(135deg, #2C3E50 0%, #1A252F 50%, #0f1419 100%)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(255,87,34,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255,87,34,0.1) 0%, transparent 40%)',
            }}
          />

          {/* Content - centered single column */}
          <div 
            className="relative z-10 flex flex-col items-center text-center"
            style={{ gap: '16px' }}
          >
            
            {/* Heading */}
            <h2 
              className="font-bold leading-tight"
              style={{ 
                fontSize: 'clamp(28px, 5vw, 48px)',
                marginTop: 0,
                marginBottom: 0,
                color: '#ffffff',
                textShadow: '0 2px 20px rgba(255, 87, 34, 0.4), 0 4px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              Скачайте приложение для партнёров
            </h2>
            
            {/* Description */}
            <p 
              className="text-white/90 leading-relaxed"
              style={{ 
                fontSize: 'clamp(16px, 2vw, 20px)',
                maxWidth: '500px',
                margin: 0,
              }}
            >
              Управляйте заказами, следите за выплатами и общайтесь с клиентами в одном приложении
            </p>

            {/* App Store Buttons */}
            <div 
              className="flex flex-col sm:flex-row justify-center"
              style={{ gap: '12px', marginTop: '4px' }}
            >
              {partnerIosLink && (
                <Button
                  asChild
                  variant="ghost"
                  className="!bg-white hover:!bg-gray-100 !text-gray-900 border-0 rounded-xl font-semibold inline-flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ 
                    height: '56px', 
                    minWidth: '200px',
                    padding: '0 28px',
                    fontSize: '16px',
                    gap: '12px',
                  }}
                  onClick={() => handleAppClick('ios')}
                >
                  <a
                    href={partnerIosLink.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Apple className="w-6 h-6 flex-shrink-0" />
                    <span>App Store</span>
                  </a>
                </Button>
              )}
              {partnerAndroidLink && (
                <Button
                  asChild
                  variant="ghost"
                  className="!bg-white hover:!bg-gray-100 !text-gray-900 border-0 rounded-xl font-semibold inline-flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ 
                    height: '56px', 
                    minWidth: '200px',
                    padding: '0 28px',
                    fontSize: '16px',
                    gap: '12px',
                  }}
                  onClick={() => handleAppClick('android')}
                >
                  <a
                    href={partnerAndroidLink.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="w-6 h-6 flex-shrink-0" />
                    <span>Google Play</span>
                  </a>
                </Button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}

