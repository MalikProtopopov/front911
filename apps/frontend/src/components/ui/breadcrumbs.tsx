/**
 * Breadcrumbs Component
 * Navigation breadcrumbs for consistent page hierarchy display
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome 
    ? [{ label: 'Главная', href: '/' }, ...items]
    : items

  return (
    <nav aria-label="Хлебные крошки" className="mb-6">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isFirst = index === 0 && showHome

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-[var(--foreground-secondary)] flex-shrink-0" />
              )}
              
              {isLast ? (
                <span className="text-sm text-[var(--foreground-secondary)] truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {isFirst && <Home className="w-4 h-4" />}
                  <span className={isFirst ? 'sr-only sm:not-sr-only' : ''}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="text-sm text-[var(--foreground-secondary)]">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

