'use client'

/**
 * Lead form submission hook (Client-side only)
 */

import { useState, useCallback } from 'react'
import { leadsService, type CreateLeadData, captureUtmParams, getCurrentPageUrl } from '../services'
import { analytics } from '@/lib/analytics'

interface UseLeadFormOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook to handle lead form submission
 */
export function useLeadForm(options?: UseLeadFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const submitLead = useCallback(
    async (data: Omit<CreateLeadData, 'source_page' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'>) => {
      setIsSubmitting(true)
      setError(null)
      setIsSuccess(false)

      try {
        // Capture UTM params and current page
        const utmParams = captureUtmParams()
        const sourcePage = getCurrentPageUrl()

        const result = await leadsService.create({
          ...data,
          ...utmParams,
          source_page: sourcePage,
        })
        
        setIsSuccess(true)
        
        // Track analytics
        analytics.trackLeadSubmit()
        
        options?.onSuccess?.()
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Submission failed')
        setError(error)
        
        options?.onError?.(error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setError(null)
    setIsSuccess(false)
  }, [])

  return {
    submitLead,
    isSubmitting,
    isSuccess,
    error,
    reset,
  }
}
