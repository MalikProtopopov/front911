'use client'

import * as React from 'react'
import { Inbox, Search, FileQuestion, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateType = 'default' | 'search' | 'notFound' | 'noLocation'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

const defaultContent: Record<
  EmptyStateType,
  { icon: React.ReactNode; title: string; description: string }
> = {
  default: {
    icon: <Inbox className="w-12 h-12" />,
    title: 'Ничего не найдено',
    description: 'Здесь пока ничего нет.',
  },
  search: {
    icon: <Search className="w-12 h-12" />,
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить параметры поиска.',
  },
  notFound: {
    icon: <FileQuestion className="w-12 h-12" />,
    title: 'Страница не найдена',
    description: 'Запрашиваемая страница не существует или была удалена.',
  },
  noLocation: {
    icon: <MapPin className="w-12 h-12" />,
    title: 'Город не найден',
    description: 'К сожалению, мы пока не работаем в этом городе.',
  },
}

export function EmptyState({
  type = 'default',
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const defaults = defaultContent[type]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center min-h-[300px]',
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-6 text-[var(--foreground-secondary)]">
        {icon ?? defaults.icon}
      </div>

      <h3 className="text-xl font-semibold mb-2">{title ?? defaults.title}</h3>

      <p className="text-[var(--foreground-secondary)] mb-6 max-w-md">
        {description ?? defaults.description}
      </p>

      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}

/**
 * Empty state for service not available in city
 */
export function ServiceNotAvailable({
  cityName,
  serviceName,
}: {
  cityName: string
  serviceName: string
}) {
  return (
    <EmptyState
      title={`${serviceName} в ${cityName}`}
      description={`К сожалению, услуга "${serviceName}" пока недоступна в городе ${cityName}. Выберите другой город или услугу.`}
      action={{
        label: 'Выбрать другой город',
        href: '/cities',
      }}
    />
  )
}

/**
 * Empty state for no reviews
 */
export function NoReviews() {
  return (
    <EmptyState
      title="Отзывов пока нет"
      description="Станьте первым, кто оставит отзыв о нашем сервисе."
    />
  )
}

/**
 * Empty state for search results
 */
export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      type="search"
      title="Ничего не найдено"
      description={`По запросу "${query}" ничего не найдено. Попробуйте изменить запрос.`}
    />
  )
}

