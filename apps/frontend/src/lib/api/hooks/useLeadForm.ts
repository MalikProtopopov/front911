'use client'

/**
 * Lead form submission hook (Client-side only)
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { leadsService, type CreateLeadData, type LeadType, captureUtmParams, getCurrentPageUrl, getFullPageUrl } from '../services'
import { analytics } from '@/lib/analytics'

interface UseLeadFormOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  /** Show toast notifications on success/error (default: true) */
  showToast?: boolean
}

/**
 * Hook to handle lead form submission
 */
export function useLeadForm(options?: UseLeadFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { showToast = true } = options ?? {}

  const submitLead = useCallback(
    async (data: Omit<CreateLeadData, 'source_page' | 'page_url' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'> & { lead_type?: LeadType }) => {
      setIsSubmitting(true)
      setError(null)
      setIsSuccess(false)

      try {
        // Capture UTM params, current page path and full URL
        const utmParams = captureUtmParams()
        const sourcePage = getCurrentPageUrl()
        const pageUrl = getFullPageUrl()

        const result = await leadsService.create({
          ...data,
          ...utmParams,
          source_page: sourcePage,
          page_url: pageUrl,
        })
        
        setIsSuccess(true)
        
        // Track analytics
        analytics.trackLeadSubmit()
        
        // Show success toast
        if (showToast) {
          toast.success('Заявка отправлена!', {
            description: 'Мы свяжемся с вами в ближайшее время',
          })
        }
        
        options?.onSuccess?.()
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Не удалось отправить заявку')
        setError(error)
        
        // Show error toast
        if (showToast) {
          // Check for rate limiting
          if (error.message?.includes('rate') || error.message?.includes('limit') || error.message?.includes('429')) {
            toast.error('Превышен лимит заявок', {
              description: 'Попробуйте повторить через час',
            })
          } else {
            toast.error('Ошибка отправки', {
              description: 'Попробуйте повторить или позвоните нам',
            })
          }
        }
        
        options?.onError?.(error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [options, showToast]
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
