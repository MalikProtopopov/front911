'use client'

import * as React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/errors'

interface ErrorMessageProps {
  error?: Error | ApiError | null
  title?: string
  message?: string
  showRetry?: boolean
  showHome?: boolean
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  error,
  title,
  message,
  showRetry = true,
  showHome = false,
  onRetry,
  className = '',
}: ErrorMessageProps) {
  const errorMessage = React.useMemo(() => {
    if (message) return message
    if (error instanceof ApiError) return error.getUserMessage()
    if (error) return error.message
    return 'Произошла ошибка. Попробуйте позже.'
  }, [error, message])

  const errorTitle = React.useMemo(() => {
    if (title) return title
    if (error instanceof ApiError) {
      if (error.isNotFound) return 'Не найдено'
      if (error.isNetworkError) return 'Ошибка сети'
      if (error.isServerError) return 'Ошибка сервера'
    }
    return 'Ошибка'
  }, [error, title])

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{errorTitle}</h3>

      <p className="text-[var(--foreground-secondary)] mb-6 max-w-md">
        {errorMessage}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Попробовать снова
          </Button>
        )}

        {showHome && (
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              На главную
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

