/**
 * PageLayout Component
 * Consistent page wrapper with header offset spacing
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wraps page content with proper top padding for fixed header offset (120px)
 * and min-height for full viewport coverage.
 * Uses .page-content CSS class from globals.css for reliable styling.
 */
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('page-content', className)}>
      {children}
    </div>
  )
}

