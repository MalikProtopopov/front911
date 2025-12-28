'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean
}

/**
 * Base skeleton element with shimmer animation
 */
export function Skeleton({ className, animate = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded-md',
        animate && 'animate-pulse',
        className
      )}
      {...props}
    />
  )
}

/**
 * Skeleton for text lines
 */
export function SkeletonText({
  lines = 1,
  lastLineWidth = '75%',
  className,
}: {
  lines?: number
  lastLineWidth?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: i === lines - 1 && lines > 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border border-[var(--border)] rounded-2xl p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

/**
 * Skeleton for service cards
 */
export function SkeletonServiceCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border border-[var(--border)] rounded-2xl p-6 h-full flex flex-col',
        className
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <Skeleton className="h-6 flex-1" />
      </div>
      <SkeletonText lines={2} className="mb-4" />
      <Skeleton className="h-4 w-24 mt-auto" />
    </div>
  )
}

/**
 * Skeleton for city cards
 */
export function SkeletonCityCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border border-[var(--border)] rounded-xl p-6 flex flex-col items-center',
        className
      )}
    >
      <Skeleton className="w-12 h-12 rounded-full mb-3" />
      <Skeleton className="h-5 w-24 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/**
 * Skeleton for review cards
 */
export function SkeletonReview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-2 border-[var(--border)] rounded-2xl p-8',
        className
      )}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-5 h-5 rounded-sm" />
        ))}
      </div>
      <SkeletonText lines={3} className="mb-6" />
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

/**
 * Grid of skeleton cards
 */
export function SkeletonGrid({
  count = 4,
  columns = 4,
  CardComponent = SkeletonCard,
}: {
  count?: number
  columns?: 2 | 3 | 4 | 5
  CardComponent?: React.ComponentType<{ className?: string }>
}) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton for hero section
 */
export function SkeletonHero() {
  return (
    <div className="py-16 md:py-24">
      <div className="grid-12">
        <div className="col-span-6 space-y-6">
          <Skeleton className="h-16 w-4/5" />
          <Skeleton className="h-16 w-3/5" />
          <SkeletonText lines={2} className="mt-4" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-14 w-40 rounded-md" />
            <Skeleton className="h-14 w-40 rounded-md" />
          </div>
        </div>
        <div className="col-span-6 flex items-center justify-center">
          <Skeleton className="w-[320px] h-[650px] rounded-[48px]" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for metrics/trust bar
 */
export function SkeletonMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Skeleton className="w-16 h-16 rounded-full mb-4" />
          <Skeleton className="h-12 w-20 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

