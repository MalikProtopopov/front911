'use client'

import { CTABanner } from '@/components/patterns'
import type { AppLink } from '@/lib/api/generated'

interface PartnerCTASectionProps {
  initialAppLinks?: AppLink[]
}

/**
 * CTA Section for Partner App Download
 * Uses the unified CTABanner component with SSR support
 */
export function PartnerCTASection({ initialAppLinks = [] }: PartnerCTASectionProps) {
  return (
    <CTABanner
      appType="partner"
      id="partner-download"
      analyticsSource="partner_cta_section"
      initialAppLinks={initialAppLinks}
    />
  )
}
