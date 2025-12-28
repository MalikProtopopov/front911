'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
}

export function LoadingSpinner({
  size = 'md',
  className,
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-[var(--color-primary)] border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Загрузка"
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-[var(--foreground-secondary)] text-sm animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        {spinner}
        <p className="text-[var(--foreground-secondary)] text-sm">{text}</p>
      </div>
    )
  }

  return spinner
}

/**
 * Full page loading state
 */
export function PageLoading({ text = 'Загрузка...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

/**
 * Section loading state
 */
export function SectionLoading({ text }: { text?: string }) {
  return (
    <div className="py-16 flex items-center justify-center">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}

/**
 * Button loading state (inline)
 */
export function ButtonLoading() {
  return <LoadingSpinner size="sm" />
}

