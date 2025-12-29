'use client'

import { CTABanner } from '@/components/patterns'

/**
 * CTA Section for Partner App Download
 * Uses the unified CTABanner component
 */
export function PartnerCTASection() {
  return (
    <CTABanner
      appType="partner"
      id="partner-download"
      analyticsSource="partner_cta_section"
    />
  )
}
