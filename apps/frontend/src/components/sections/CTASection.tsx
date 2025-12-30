'use client'

import { CTABanner } from '@/components/patterns'
import type { AppLink } from '@/lib/api/generated'

interface CTASectionProps {
  initialAppLinks?: AppLink[]
}

/**
 * CTA Section for Client App Download
 * Uses the unified CTABanner component
 */
export function CTASection({ initialAppLinks = [] }: CTASectionProps) {
  return (
    <CTABanner
      appType="client"
      id="download"
      analyticsSource="cta_section"
      initialAppLinks={initialAppLinks}
    />
  )
}
