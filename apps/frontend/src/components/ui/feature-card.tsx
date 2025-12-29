/**
 * Feature Card Components
 * Unified cards for services, advantages, cities, etc.
 */

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { IconCircle } from './icon-circle'

/* =============================================================================
   FEATURE CARD - For advantages, benefits, etc.
============================================================================= */

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  iconVariant?: 'primary' | 'primary-soft' | 'secondary' | 'success'
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  iconVariant = 'primary',
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center p-6 rounded-xl group h-full',
        className
      )}
    >
      <IconCircle
        icon={icon}
        variant={iconVariant}
        size="xl"
        shadow="md"
        className="mb-8"
      />
      <h3 className="text-xl font-semibold mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-[var(--foreground-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

/* =============================================================================
   LINK CARD - Clickable card with arrow
============================================================================= */

export interface LinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description?: string
  meta?: string
  iconVariant?: 'primary' | 'primary-soft' | 'secondary'
  className?: string
}

export function LinkCard({
  href,
  icon,
  title,
  description,
  meta,
  iconVariant = 'primary',
  className,
}: LinkCardProps) {
  return (
    <Link href={href} className={cn('block h-full', className)}>
      <Card className="h-full flex flex-col group hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <IconCircle
              icon={icon}
              variant={iconVariant}
              size="lg"
              hoverScale
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {title}
              </CardTitle>
              {meta && (
                <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                  {meta}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {description && (
            <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">
              {description}
            </p>
          )}
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center text-[var(--color-primary)] font-medium text-sm gap-1.5 group-hover:gap-2.5 transition-all">
              Подробнее
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* =============================================================================
   SIMPLE LINK CARD - Minimal card with just icon and title
============================================================================= */

export interface SimpleLinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  className?: string
}

export function SimpleLinkCard({ href, icon, title, className }: SimpleLinkCardProps) {
  return (
    <Link href={href} className={cn('block', className)}>
      <Card className="hover:shadow-lg hover:border-[var(--color-primary)] transition-all h-full">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="text-[var(--color-primary)] flex-shrink-0">
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

/* =============================================================================
   STAT CARD - For metrics and statistics
============================================================================= */

export interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color?: string
  className?: string
}

export function StatCard({
  icon,
  value,
  label,
  color = 'var(--color-primary)',
  className,
}: StatCardProps) {
  // Dynamic color requires CSS custom property approach
  // Set --stat-color on parent, use it in children
  const dynamicStyles = {
    '--stat-color': color,
    '--stat-color-bg': `${color}20`,
  } as React.CSSProperties
  
  return (
    <div 
      className={cn('flex flex-col items-center text-center stat-card', className)}
      style={dynamicStyles}
    >
      <div className="stat-card__icon w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-4">
        <div className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </div>
      </div>
      <div className="stat-card__value text-4xl md:text-5xl font-bold mb-2">
        {value}
      </div>
      <div className="text-[var(--foreground-secondary)] font-medium">
        {label}
      </div>
    </div>
  )
}

