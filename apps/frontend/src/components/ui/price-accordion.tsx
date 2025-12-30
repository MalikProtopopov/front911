'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from './accordion'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { ParameterType } from '@/lib/api/services'

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
// Utility: Format price without currency symbol
// ============================================

function formatPriceNumber(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return '—'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) return '—'
  return new Intl.NumberFormat('ru-RU').format(numPrice)
}

// ============================================
// Utility: Normalize range display (R14 - R19 → R14–R19)
// ============================================

function normalizeRangeLabel(values: string[]): string {
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]
  
  // Sort values naturally (R14, R15, R16...)
  const sorted = [...values].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0
    const numB = parseInt(b.replace(/\D/g, '')) || 0
    return numA - numB
  })
  
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  
  // Use en-dash for ranges
  return `${first}–${last}`
}

// ============================================
// PriceRowExpandable - Expandable price row with parameters
// ============================================

interface ParameterGroup {
  modifier: number
  values: string[]
  id: string
}

interface PriceRowExpandableProps {
  title: string
  basePrice: number | string | null
  hasParameters?: boolean
  parameterTypes?: ParameterType[]
  description?: string
  className?: string
}

export function PriceRowExpandable({
  title,
  basePrice,
  hasParameters = false,
  parameterTypes = [],
  description,
  className
}: PriceRowExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  
  // If no parameters, render simple PriceRow
  if (!hasParameters || !parameterTypes || parameterTypes.length === 0) {
    return (
      <PriceRow 
        title={title} 
        price={basePrice} 
        description={description}
        className={className}
      />
    )
  }
  
  // Parse base price
  const basePriceNum = typeof basePrice === 'string' ? parseFloat(basePrice) : (basePrice ?? 0)
  
  // Group parameter values by price modifier for cleaner display
  function groupValuesByModifier(values: ParameterType['values']): ParameterGroup[] {
    const groups: ParameterGroup[] = []
    
    values.forEach(value => {
      const modifier = parseFloat(value.price_modifier) || 0
      const existingGroup = groups.find(g => g.modifier === modifier)
      
      if (existingGroup) {
        existingGroup.values.push(value.display_name)
      } else {
        groups.push({ 
          modifier, 
          values: [value.display_name],
          id: `group-${modifier}`
        })
      }
    })
    
    // Sort by modifier ascending
    return groups.sort((a, b) => a.modifier - b.modifier)
  }
  
  // Get all groups for selection display
  const allGroups = parameterTypes.flatMap(pt => groupValuesByModifier(pt.values))
  const selectedGroup = allGroups.find(g => g.id === selectedGroupId) || allGroups[0]
  const selectedPrice = selectedGroup ? basePriceNum + selectedGroup.modifier : basePriceNum
  const selectedLabel = selectedGroup ? normalizeRangeLabel(selectedGroup.values) : ''
  
  return (
    <div className={cn('price-row-expandable group', className)}>
      {/* Header row - clickable */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center justify-between py-5 px-5',
          'hover:bg-[var(--background-secondary)]/50',
          'transition-all duration-200',
          'cursor-pointer',
          'border-b border-transparent',
          isExpanded && 'bg-[var(--background-secondary)]/30'
        )}
      >
        <div className="flex-grow pr-6">
          {/* Title - primary hierarchy */}
          <p className="text-[var(--foreground-primary)] font-semibold text-base leading-tight">
            {title}
          </p>
          {/* Collapsed state: show selected variant */}
          {!isExpanded && selectedLabel && (
            <p className="text-sm text-[var(--foreground-tertiary)] mt-1.5 flex items-center gap-1.5">
              <span className="text-[var(--foreground-secondary)]">{parameterTypes[0]?.title}:</span>
              <span>{selectedLabel}</span>
              <span className="text-[var(--foreground-tertiary)]">·</span>
              <span className="tabular-nums">{formatPriceNumber(selectedPrice)} ₽</span>
            </p>
          )}
          {description && !selectedLabel && (
            <p className="text-sm text-[var(--foreground-tertiary)] mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Price - secondary hierarchy */}
          <span className="text-[var(--foreground-secondary)] text-sm whitespace-nowrap tabular-nums">
            от {formatPriceNumber(basePrice)} ₽
          </span>
          <ChevronDown 
            className={cn(
              'w-4 h-4 text-[var(--foreground-tertiary)]',
              'transition-transform duration-200 ease-out',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>
      
      {/* Expanded content with parameters */}
      {isExpanded && (
        <div className="overflow-hidden">
          {parameterTypes.map((paramType) => {
            const groups = groupValuesByModifier(paramType.values)
            
            return (
              <div key={paramType.code} className="px-5 pt-4 pb-3">
                {/* Parameter label - clean, no background */}
                <p className="text-xs font-medium text-[var(--foreground-tertiary)] uppercase tracking-wide mb-3">
                  {paramType.title}
                </p>
                
                {/* Options as selectable rows */}
                <div className="space-y-0.5">
                  {groups.map((group, index) => {
                    const totalPrice = basePriceNum + group.modifier
                    const valuesLabel = normalizeRangeLabel(group.values)
                    const isSelected = selectedGroupId === group.id || (!selectedGroupId && index === 0)
                    
                    return (
                      <div 
                        key={group.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedGroupId(group.id)
                        }}
                        className={cn(
                          'flex items-center gap-3 py-3 px-3 -mx-1 rounded-lg',
                          'cursor-pointer transition-all duration-150',
                          // Zebra pattern (very subtle)
                          index % 2 === 1 && !isSelected && 'bg-[var(--background-secondary)]/30',
                          // Hover state
                          'hover:bg-[var(--color-primary)]/5',
                          // Selected state
                          isSelected && 'bg-[var(--color-primary)]/8 ring-1 ring-[var(--color-primary)]/20'
                        )}
                      >
                        {/* Radio indicator */}
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2 flex-shrink-0',
                          'flex items-center justify-center transition-colors',
                          isSelected 
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                            : 'border-[var(--foreground-tertiary)]/40'
                        )}>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        
                        {/* Value label */}
                        <span className={cn(
                          'flex-grow text-sm',
                          isSelected 
                            ? 'text-[var(--foreground-primary)] font-medium' 
                            : 'text-[var(--foreground-secondary)]'
                        )}>
                          {valuesLabel}
                        </span>
                        
                        {/* Price - aligned right with tabular nums */}
                        <div className="flex items-baseline gap-2 flex-shrink-0 text-right min-w-[100px] justify-end">
                          <span className={cn(
                            'tabular-nums text-sm',
                            isSelected 
                              ? 'text-[var(--foreground-primary)] font-medium' 
                              : 'text-[var(--foreground-secondary)]'
                          )}>
                            {formatPriceNumber(totalPrice)} ₽
                          </span>
                          {group.modifier > 0 && (
                            <span className="text-xs text-[var(--foreground-tertiary)] tabular-nums">
                              +{formatPriceNumber(group.modifier)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
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
