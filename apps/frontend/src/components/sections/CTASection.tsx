'use client'

import { CTABanner } from '@/components/patterns'

/**
 * CTA Section for Client App Download
 * Uses the unified CTABanner component
 */
export function CTASection() {
  return (
    <CTABanner
      appType="client"
      id="download"
      analyticsSource="cta_section"
    />
  )
}
