/**
 * Global error handlers and utilities
 */

import { ApiError } from './ApiError'
import { config } from '../config'

// Type for toast notification function
type ToastFn = (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void

let toastFn: ToastFn | null = null

/**
 * Set the toast function to be used for error notifications
 * Should be called in the app root after toast provider is ready
 */
export function setToastFunction(fn: ToastFn): void {
  toastFn = fn
}

/**
 * Show error toast notification
 */
export function showErrorToast(error: ApiError | Error | string): void {
  const message = typeof error === 'string'
    ? error
    : error instanceof ApiError
      ? error.getUserMessage()
      : error.message

  if (toastFn) {
    toastFn({
      title: 'Ошибка',
      description: message,
      variant: 'destructive',
    })
  } else {
    // Fallback to console if toast not available
    console.error('Error:', message)
  }
}

/**
 * Show success toast notification
 */
export function showSuccessToast(title: string, description?: string): void {
  if (toastFn) {
    toastFn({
      title,
      description,
      variant: 'default',
    })
  }
}

/**
 * Log error to external service (Sentry, etc.)
 */
export function logError(
  error: Error | ApiError,
  context?: Record<string, unknown>
): void {
  // Always log to console in development
  if (config.app.isDev) {
    console.error('Error logged:', error)
    if (context) {
      console.error('Context:', context)
    }
  }

  // TODO: Send to Sentry or similar service
  // if (config.errorTracking.enabled) {
  //   Sentry.captureException(error, { extra: context })
  // }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(
  error: unknown,
  options?: {
    showToast?: boolean
    logToService?: boolean
    context?: Record<string, unknown>
  }
): ApiError {
  const { showToast = true, logToService = true, context } = options ?? {}

  const apiError = ApiError.fromUnknown(error)

  // Log error
  if (logToService) {
    logError(apiError, context)
  }

  // Show toast notification
  if (showToast && !apiError.isNotFound) {
    showErrorToast(apiError)
  }

  return apiError
}

/**
 * Create error handler for async functions
 * Useful for event handlers that can't be wrapped with try-catch
 */
export function createAsyncErrorHandler<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    showToast?: boolean
    onError?: (error: ApiError) => void
  }
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args)
    } catch (error) {
      const apiError = handleApiError(error, { showToast: options?.showToast })
      options?.onError?.(apiError)
      return undefined
    }
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    shouldRetry?: (error: ApiError, attempt: number) => boolean
  }
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error: ApiError) => error.isNetworkError || error.isServerError,
  } = options ?? {}

  let lastError: ApiError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = ApiError.fromUnknown(error)

      if (attempt === maxRetries || !shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // TypeScript needs this, but it should never reach here
  throw lastError!
}

