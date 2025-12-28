'use client'

import * as React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Component stack:', errorInfo.componentStack)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Что-то пошло не так</h2>
            <p className="text-[var(--foreground-secondary)] mb-6">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу или
              вернуться позже.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="w-4 h-4" />
                Попробовать снова
              </Button>
              <Button onClick={() => window.location.reload()}>
                Обновить страницу
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-[var(--foreground-secondary)]">
                  Детали ошибки (development)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-48">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook to manually trigger error boundary
 * Useful for catching async errors in event handlers
 */
export function useErrorBoundary(): {
  showBoundary: (error: Error) => void
} {
  const [, setError] = React.useState<Error | null>(null)

  const showBoundary = React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])

  return { showBoundary }
}

