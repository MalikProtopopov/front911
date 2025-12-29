/**
 * Server-side logging utility for SSR error tracking
 * Use this in Server Components and API routes
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export interface LogContext {
  page?: string
  params?: Record<string, string>
  userId?: string
  requestId?: string
  duration?: number
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  timestamp: string
  message: string
  error?: string
  stack?: string
  context: LogContext
}

/**
 * Format and log a structured error message
 */
export function logServerError(
  error: unknown,
  message: string,
  context: LogContext = {}
): void {
  const entry: LogEntry = {
    level: 'error',
    timestamp: new Date().toISOString(),
    message,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context
  }

  // In production, this could be sent to a logging service (e.g., Sentry, DataDog)
  console.error(JSON.stringify(entry, null, process.env.NODE_ENV === 'development' ? 2 : 0))
}

/**
 * Format and log a warning message
 */
export function logServerWarning(
  message: string,
  context: LogContext = {}
): void {
  const entry: LogEntry = {
    level: 'warn',
    timestamp: new Date().toISOString(),
    message,
    context
  }

  console.warn(JSON.stringify(entry, null, process.env.NODE_ENV === 'development' ? 2 : 0))
}

/**
 * Format and log an info message
 */
export function logServerInfo(
  message: string,
  context: LogContext = {}
): void {
  const entry: LogEntry = {
    level: 'info',
    timestamp: new Date().toISOString(),
    message,
    context
  }

  console.log(JSON.stringify(entry, null, process.env.NODE_ENV === 'development' ? 2 : 0))
}

/**
 * Format and log a debug message (only in development)
 */
export function logServerDebug(
  message: string,
  context: LogContext = {}
): void {
  if (process.env.NODE_ENV !== 'development') return

  const entry: LogEntry = {
    level: 'debug',
    timestamp: new Date().toISOString(),
    message,
    context
  }

  console.debug(JSON.stringify(entry, null, 2))
}

/**
 * Create a logger with pre-configured context
 */
export function createServerLogger(baseContext: LogContext) {
  return {
    error: (error: unknown, message: string, context: LogContext = {}) =>
      logServerError(error, message, { ...baseContext, ...context }),
    warn: (message: string, context: LogContext = {}) =>
      logServerWarning(message, { ...baseContext, ...context }),
    info: (message: string, context: LogContext = {}) =>
      logServerInfo(message, { ...baseContext, ...context }),
    debug: (message: string, context: LogContext = {}) =>
      logServerDebug(message, { ...baseContext, ...context }),
  }
}

/**
 * Helper to measure and log async operation duration
 */
export async function withTiming<T>(
  operation: () => Promise<T>,
  operationName: string,
  context: LogContext = {}
): Promise<T> {
  const start = performance.now()
  try {
    const result = await operation()
    const duration = Math.round(performance.now() - start)
    
    if (process.env.NODE_ENV === 'development') {
      logServerDebug(`${operationName} completed`, { ...context, duration })
    }
    
    return result
  } catch (error) {
    const duration = Math.round(performance.now() - start)
    logServerError(error, `${operationName} failed`, { ...context, duration })
    throw error
  }
}

