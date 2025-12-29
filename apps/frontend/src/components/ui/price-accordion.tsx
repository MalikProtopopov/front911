'use client'

import * as React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from './accordion'
import { cn } from '@/lib/utils'

// ============================================
// Utility Functions
// ============================================

/**
 * Format price for display
 * @param price - Price value (number or string)
 * @returns Formatted price string with currency
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return 'По запросу'
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(numPrice)) {
    return 'По запросу'
  }
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice)
}

/**
 * Get label for options count
 * @param count - Number of options
 * @returns Localized label (e.g., "5 опций")
 */
export function getOptionsLabel(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} опций`
  }
  
  if (lastDigit === 1) {
    return `${count} опция`
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} опции`
  }
  
  return `${count} опций`
}

// ============================================
// PriceAccordion - Root Container
// ============================================

interface PriceAccordionProps {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
}

export function PriceAccordion({ 
  children, 
  type = 'multiple',
  defaultValue,
  className 
}: PriceAccordionProps) {
  // Radix Accordion requires explicit type handling
  if (type === 'single') {
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={Array.isArray(defaultValue) ? defaultValue[0] : defaultValue}
        className={cn('space-y-3', className)}
      >
        {children}
      </Accordion>
    )
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : undefined)}
      className={cn('space-y-3', className)}
    >
      {children}
    </Accordion>
  )
}

// ============================================
// PriceAccordionCategory - Category with options
// ============================================

interface PriceAccordionCategoryProps {
  value: string
  title: string
  count?: number
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PriceAccordionCategory({
  value,
  title,
  count,
  icon,
  children,
  className
}: PriceAccordionCategoryProps) {
  return (
    <AccordionItem 
      value={value} 
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-[var(--background-primary)]',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <AccordionTrigger 
        className={cn(
          'px-5 py-4 hover:no-underline hover:bg-[var(--background-secondary)]',
          'transition-colors duration-200'
        )}
      >
        <div className="flex items-center gap-3 w-full">
          {icon && (
            <span className="text-[var(--color-primary)] w-5 h-5 flex-shrink-0">
              {icon}
            </span>
          )}
          <span className="font-medium text-[var(--foreground-primary)] flex-grow text-left">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-sm text-[var(--foreground-tertiary)] mr-2">
              {getOptionsLabel(count)}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        <div>
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ============================================
// PriceRow - Single price item
// ============================================

interface PriceRowProps {
  title: string
  price?: number | string | null
  description?: string
  className?: string
}

export function PriceRow({ 
  title, 
  price, 
  description,
  className 
}: PriceRowProps) {
  return (
    <div 
      className={cn(
        'price-row',
        'flex items-center justify-between py-4 px-5',
        'hover:bg-[var(--background-secondary)]',
        'transition-colors duration-200',
        'cursor-pointer',
        className
      )}
    >
      <div className="flex-grow pr-4">
        <p className="text-[var(--foreground-primary)] font-medium">
          {title}
        </p>
        {description && (
          <p className="text-sm text-[var(--foreground-tertiary)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="price-row__price font-semibold text-[var(--color-primary)] whitespace-nowrap">
          {formatPrice(price)}
        </span>
      </div>
    </div>
  )
}

// ============================================
// PriceSectionHeader - Section title with count
// ============================================

interface PriceSectionHeaderProps {
  title: string
  totalCount?: number
  className?: string
}

export function PriceSectionHeader({ 
  title, 
  totalCount,
  className 
}: PriceSectionHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground-primary)]">
        {title}
      </h2>
      {totalCount !== undefined && totalCount > 0 && (
        <p className="text-[var(--foreground-secondary)] mt-2">
          Доступно {getOptionsLabel(totalCount)} с указанными ценами
        </p>
      )}
    </div>
  )
}

// ============================================
// PriceEmptyState - Empty state component
// ============================================

interface PriceEmptyStateProps {
  message?: string
  children?: React.ReactNode
  className?: string
}

export function PriceEmptyState({ 
  message = 'Цены не указаны', 
  children,
  className 
}: PriceEmptyStateProps) {
  return (
    <div 
      className={cn(
        'text-center py-12 px-6',
        'bg-[var(--background-secondary)] rounded-xl',
        'shadow-sm',
        className
      )}
    >
      <p className="text-[var(--foreground-secondary)] mb-4">
        {message}
      </p>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}
