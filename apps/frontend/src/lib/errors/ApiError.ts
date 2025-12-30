/**
 * Custom API Error class for handling API-specific errors
 */

export interface ApiErrorDetails {
  message: string
  code?: string
  field?: string
  details?: Record<string, unknown>
}

export class ApiError extends Error {
  public readonly status: number
  public readonly statusText: string
  public readonly url?: string
  public readonly details?: ApiErrorDetails[]
  public readonly isNetworkError: boolean
  public readonly isServerError: boolean
  public readonly isClientError: boolean
  public readonly isNotFound: boolean
  public readonly isUnauthorized: boolean
  public readonly isForbidden: boolean
  public readonly isValidationError: boolean

  constructor(
    message: string,
    status: number,
    options?: {
      statusText?: string
      url?: string
      details?: ApiErrorDetails[]
    }
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = options?.statusText ?? ''
    this.url = options?.url
    this.details = options?.details

    // Categorize errors
    this.isNetworkError = status === 0
    this.isServerError = status >= 500
    this.isClientError = status >= 400 && status < 500
    this.isNotFound = status === 404
    this.isUnauthorized = status === 401
    this.isForbidden = status === 403
    this.isValidationError = status === 400 || status === 422

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.isNetworkError) {
      return 'Ошибка сети. Проверьте подключение к интернету.'
    }
    if (this.isNotFound) {
      return 'Запрашиваемая страница не найдена.'
    }
    if (this.isUnauthorized) {
      return 'Требуется авторизация.'
    }
    if (this.isForbidden) {
      return 'Доступ запрещён.'
    }
    if (this.isServerError) {
      return 'Ошибка сервера. Попробуйте позже.'
    }
    if (this.isValidationError && this.details?.length) {
      return this.details.map((d) => d.message).join(', ')
    }
    return this.message || 'Произошла ошибка. Попробуйте позже.'
  }

  /**
   * Create ApiError from fetch Response
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    let details: ApiErrorDetails[] | undefined

    try {
      const body = await response.json()
      if (body.detail) {
        details = [{ message: body.detail }]
      } else if (body.errors) {
        details = body.errors
      } else if (body.message) {
        details = [{ message: body.message }]
      }
    } catch {
      // Response body is not JSON or empty
    }

    return new ApiError(
      details?.[0]?.message ?? `HTTP Error ${response.status}`,
      response.status,
      {
        statusText: response.statusText,
        url: response.url,
        details,
      }
    )
  }

  /**
   * Create ApiError from unknown error
   */
  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (error instanceof Error) {
      // Check for network errors (fetch failures, connection errors, etc.)
      const isNetworkError = 
        error.name === 'TypeError' && 
        (error.message.includes('fetch') || 
         error.message.includes('Failed to fetch') ||
         error.message.includes('NetworkError') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('ENOTFOUND'))
      
      if (isNetworkError) {
        // Log more details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Network error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack?.substring(0, 500),
          })
          console.error('API URL:', process.env.NEXT_PUBLIC_API_URL || '(not set)')
          console.error('Make sure the backend API is running and accessible at the configured URL')
        }
        return new ApiError('Network error', 0, {
          statusText: 'Network Error',
        })
      }

      return new ApiError(error.message, 500)
    }

    return new ApiError('Unknown error occurred', 500)
  }

  /**
   * Convert to plain object for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      details: this.details,
      stack: this.stack,
    }
  }
}

