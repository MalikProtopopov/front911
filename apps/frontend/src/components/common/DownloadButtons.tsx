'use client'

import * as React from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Apple, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/common/Skeleton'
import { contentService } from '@/lib/api/services'
import { QUERY_KEYS, SWR_CONFIG } from '@/lib/config/constants'
import {
  getAppLinksByType,
  getPreferredQrLink,
  hasAnyLink,
  type AppLinksByPlatform,
} from '@/lib/utils/appLinks'
import type { AppLink } from '@/lib/api/generated'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface DownloadButtonsProps {
  /** Тип приложения: 'client' или 'partner' */
  appType: 'client' | 'partner'
  /** Показывать QR-код */
  showQr?: boolean
  /** Дополнительные классы для контейнера кнопок */
  className?: string
  /** Дополнительные классы для контейнера QR-кода */
  qrClassName?: string
  /** Вариант кнопки iOS */
  iosVariant?: 'default' | 'outline'
  /** Вариант кнопки Android */
  androidVariant?: 'default' | 'outline'
  /** Размер кнопок */
  size?: 'default' | 'sm' | 'lg'
  /** Направление расположения кнопок */
  direction?: 'row' | 'column'
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Скелетон для кнопок загрузки
 */
function DownloadButtonsSkeleton({
  showQr = false,
  direction = 'row',
}: Pick<DownloadButtonsProps, 'showQr' | 'direction'>) {
  return (
    <div className="space-y-4">
      <div
        className={cn(
          'flex gap-3',
          direction === 'column' ? 'flex-col' : 'flex-col sm:flex-row'
        )}
      >
        <Skeleton className="h-14 w-40 rounded-md" />
        <Skeleton className="h-14 w-40 rounded-md" />
      </div>
      {showQr && (
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="w-24 h-24 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Сообщение об ошибке
 */
function DownloadButtonsError() {
  return (
    <p className="text-sm text-[var(--foreground-secondary)] italic">
      Ссылки временно недоступны
    </p>
  )
}

/**
 * Кнопка App Store
 */
function AppStoreButton({
  link,
  variant = 'default',
  size = 'lg',
}: {
  link?: AppLink
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}) {
  if (!link) return null

  return (
    <Button
      size={size}
      variant={variant}
      className="group"
      asChild
    >
      <a
        href={link.store_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Скачать в App Store"
      >
        <Apple className="w-5 h-5 group-hover:scale-110 transition-transform" />
        App Store
      </a>
    </Button>
  )
}

/**
 * Кнопка Google Play
 */
function GooglePlayButton({
  link,
  variant = 'outline',
  size = 'lg',
}: {
  link?: AppLink
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}) {
  if (!link) return null

  return (
    <Button
      size={size}
      variant={variant}
      className="group"
      asChild
    >
      <a
        href={link.store_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Скачать в Google Play"
      >
        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Google Play
      </a>
    </Button>
  )
}

/**
 * QR-код для скачивания приложения
 */
function QrCodeBlock({
  link,
  className,
}: {
  link?: AppLink
  className?: string
}) {
  if (!link?.qr_code_url) return null

  const platformLabel = link.platform === 'ios' ? 'iOS' : 'Android'

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative w-24 h-24 bg-white rounded-xl shadow-sm border border-[var(--border)] p-2">
        <Image
          src={link.qr_code_url}
          alt={`QR-код для скачивания приложения (${platformLabel})`}
          fill
          className="object-contain p-1"
          unoptimized // QR-коды обычно с бекенда, не нужна оптимизация
        />
      </div>
      <div className="text-sm">
        <p className="font-medium text-[var(--foreground)]">
          Сканируйте QR-код
        </p>
        <p className="text-[var(--foreground-secondary)]">
          {platformLabel} приложение
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Компонент кнопок скачивания приложения
 * 
 * Автоматически загружает данные о ссылках с API и отображает:
 * - Кнопку App Store (если есть iOS ссылка)
 * - Кнопку Google Play (если есть Android ссылка)
 * - QR-код (опционально, приоритет iOS > Android)
 * 
 * Обрабатывает состояния:
 * - loading: показывает скелетоны
 * - error: показывает fallback текст "Ссылки временно недоступны"
 * - success: показывает кнопки и QR-код
 * 
 * @example
 * ```tsx
 * // Базовое использование для клиентского приложения
 * <DownloadButtons appType="client" />
 * 
 * // С QR-кодом
 * <DownloadButtons appType="client" showQr />
 * 
 * // Кастомные стили
 * <DownloadButtons 
 *   appType="partner" 
 *   showQr 
 *   iosVariant="outline"
 *   androidVariant="default"
 *   size="default"
 *   direction="column"
 * />
 * ```
 */
export function DownloadButtons({
  appType,
  showQr = false,
  className,
  qrClassName,
  iosVariant = 'default',
  androidVariant = 'outline',
  size = 'lg',
  direction = 'row',
}: DownloadButtonsProps) {
  // Загружаем данные с API через SWR
  const { data, error, isLoading } = useSWR<AppLink[]>(
    QUERY_KEYS.APP_LINKS.ALL,
    () => contentService.getAppLinks(),
    {
      ...SWR_CONFIG,
      fallbackData: [],
    }
  )

  // Нормализуем данные
  const links: AppLinksByPlatform = React.useMemo(() => {
    if (!data || data.length === 0) return {}
    return getAppLinksByType(data, appType)
  }, [data, appType])

  // QR-код с приоритетом iOS
  const qrLink = React.useMemo(() => {
    if (!showQr) return undefined
    return getPreferredQrLink(links)
  }, [links, showQr])

  // Состояние загрузки
  if (isLoading) {
    return <DownloadButtonsSkeleton showQr={showQr} direction={direction} />
  }

  // Состояние ошибки
  if (error) {
    return <DownloadButtonsError />
  }

  // Нет ссылок — ничего не показываем
  if (!hasAnyLink(links)) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Кнопки */}
      <div
        className={cn(
          'flex gap-3',
          direction === 'column' ? 'flex-col' : 'flex-col sm:flex-row',
          className
        )}
      >
        <AppStoreButton
          link={links.ios}
          variant={iosVariant}
          size={size}
        />
        <GooglePlayButton
          link={links.android}
          variant={androidVariant}
          size={size}
        />
      </div>

      {/* QR-код */}
      {showQr && qrLink && (
        <QrCodeBlock link={qrLink} className={qrClassName} />
      )}
    </div>
  )
}

// ============================================================================
// Named exports for granular use
// ============================================================================

export {
  DownloadButtonsSkeleton,
  DownloadButtonsError,
  AppStoreButton,
  GooglePlayButton,
  QrCodeBlock,
}

