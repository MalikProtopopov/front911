'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useClientAppLinks } from '@/lib/api/hooks'
import { analytics } from '@/lib/analytics'
import { EXTERNAL_LINKS } from '@/lib/config/constants'
import { cn } from '@/lib/utils'

/* =============================================================================
   CTA BANNER COMPONENT
   Universal CTA banner for app downloads (client or partner)
============================================================================= */

export interface CTABannerProps {
  /** Type of app to promote */
  appType?: 'client' | 'partner'
  /** Banner title */
  title?: string
  /** Banner description */
  description?: string
  /** Section ID for navigation */
  id?: string
  /** Additional class names */
  className?: string
  /** Analytics source identifier */
  analyticsSource?: string
}

export function CTABanner({
  appType = 'client',
  title,
  description,
  id = 'download',
  className,
  analyticsSource,
}: CTABannerProps) {
  const { clientIosLink, clientAndroidLink, getAppLink, isLoading } = useClientAppLinks()

  // Get appropriate links based on app type
  const iosLink = appType === 'client' 
    ? clientIosLink 
    : getAppLink('partner', 'ios')
  const androidLink = appType === 'client'
    ? clientAndroidLink
    : getAppLink('partner', 'android')

  // Fallback URLs for client app
  const iosUrl = iosLink?.store_url ?? (appType === 'client' ? EXTERNAL_LINKS.APP_STORE : undefined)
  const androidUrl = androidLink?.store_url ?? (appType === 'client' ? EXTERNAL_LINKS.GOOGLE_PLAY : undefined)

  // Default content based on app type
  const defaultTitle = appType === 'client'
    ? 'Скачайте приложение 911'
    : 'Скачайте приложение для партнёров'
  
  const defaultDescription = appType === 'client'
    ? 'Получите быструю автопомощь в любом месте и в любое время'
    : 'Управляйте заказами, следите за выплатами и общайтесь с клиентами в одном приложении'

  const handleAppClick = (platform: 'ios' | 'android') => {
    const source = analyticsSource ?? (appType === 'client' ? 'cta_section' : 'partner_cta_section')
    analytics.trackInstallIntent(platform, source)
  }

  // For partner app: don't render if no links
  const hasLinks = iosUrl || androidUrl
  if (appType === 'partner' && !isLoading && !hasLinks) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <section className={cn('section-spacing-lg', className)} id={id}>
        <div className="container mx-auto px-4">
          <div className="cta-banner cta-banner--loading animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section className={cn('section-spacing-lg', className)} id={id}>
      <div className="container mx-auto px-4">
        <div className="cta-banner">
          {/* Gradient overlay */}
          <div className="cta-banner__overlay" />

          {/* Content */}
          <div className="cta-banner__content">
            <h2 className="cta-banner__title">
              {title ?? defaultTitle}
            </h2>
            
            <p className="cta-banner__description">
              {description ?? defaultDescription}
            </p>

            {/* App Store Buttons */}
            <div className="cta-banner__buttons flex flex-col sm:flex-row gap-4">
              {iosUrl && (
                <Button
                  asChild
                  size="lg"
                  className="cta-banner__button sm:w-auto w-full"
                  onClick={() => handleAppClick('ios')}
                >
                  <a 
                    href={iosUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Image
                      src="/images/icons/appstore.png"
                      alt="App Store"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="leading-none">App Store</span>
                  </a>
                </Button>
              )}
              {androidUrl && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cta-banner__button sm:w-auto w-full"
                  onClick={() => handleAppClick('android')}
                >
                  <a 
                    href={androidUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Image
                      src="/images/icons/google_play.png"
                      alt="Google Play"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="leading-none">Google Play</span>
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

