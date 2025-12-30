/**
 * Service Row Component
 * iOS Settings-style compact row for service listings
 */

import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconCircle } from './icon-circle'
import type { ServiceList } from '@/lib/api/generated'

/* =============================================================================
   SERVICE ROW - iOS Settings style row
============================================================================= */

export interface ServiceRowProps {
  service: ServiceList
  icon: React.ReactNode
  iconVariant?: 'primary' | 'primary-soft' | 'secondary'
  href?: string
  className?: string
  isLast?: boolean
}

export function ServiceRow({
  service,
  icon,
  iconVariant = 'primary',
  href,
  className,
  isLast: _isLast = false,
}: ServiceRowProps) {
  const rowContent = (
    <div
      className={cn(
        // Card styling
        'bg-white border border-[var(--border)] rounded-lg',
        'flex items-center gap-4',
        'min-h-[72px] md:min-h-[80px]',
        'px-4 md:px-5 py-4 md:py-5',
        // Transitions and interactions
        'transition-all duration-200',
        'hover:shadow-md hover:border-[var(--color-primary)]/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
        'cursor-pointer',
        className
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12">
        <IconCircle
          icon={icon}
          variant={iconVariant}
          size="lg"
          className="w-full h-full [&>div]:w-5 [&>div]:h-5 md:[&>div]:w-6 md:[&>div]:h-6"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <h3
          className={cn(
            'text-lg md:text-xl font-semibold',
            'text-[var(--foreground)] font-heading',
            'transition-colors duration-200',
            'truncate',
            'mb-1.5',
            'group-hover:!text-[#FF5722]',
            'block w-full'
          )}
        >
          {service.title}
        </h3>
        {service.options_count && (
          <p className="text-[13px] md:text-sm text-[var(--foreground-secondary)] truncate block w-full">
            {service.options_count} опций
          </p>
        )}
      </div>

      {/* Chevron - closer to content for better visibility */}
      <ChevronRight
        className={cn(
          'w-5 h-5 md:w-6 md:h-6',
          'text-[var(--foreground-tertiary)] opacity-70',
          'transition-all duration-200',
          'flex-shrink-0',
          'group-hover:!text-[#FF5722]',
          'group-hover:opacity-100',
          'group-hover:translate-x-1'
        )}
        strokeWidth={2.5}
      />
    </div>
  )

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} className="block group">
        {rowContent}
      </Link>
    )
  }

  return rowContent
}

/* =============================================================================
   SERVICE CARD - Legacy name, uses ServiceRow now
============================================================================= */

export const ServiceCard = ServiceRow
export type ServiceCardProps = ServiceRowProps

