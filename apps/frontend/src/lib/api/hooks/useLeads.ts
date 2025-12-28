/**
 * SWR hooks and mutations for Leads
 */

import useSWRMutation from 'swr/mutation'
import { leadsService, captureUtmParams, getCurrentPageUrl, type CreateLeadData } from '../services'
import { handleApiError, showSuccessToast } from '@/lib/errors'
import { analytics } from '@/lib/analytics'
import type { Lead } from '../generated'

interface UseLeadFormOptions {
  onSuccess?: (lead: Lead) => void
  onError?: (error: Error) => void
  showToast?: boolean
  trackAnalytics?: boolean
}

/**
 * Hook for lead form submission
 */
export function useLeadForm(options?: UseLeadFormOptions) {
  const {
    onSuccess,
    onError,
    showToast = true,
    trackAnalytics = true,
  } = options ?? {}

  const { trigger, isMutating, error, reset } = useSWRMutation(
    'leads/create',
    async (_key: string, { arg }: { arg: Omit<CreateLeadData, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'source_page'> }) => {
      // Capture UTM parameters and source page automatically
      const utmParams = captureUtmParams()
      const sourcePage = getCurrentPageUrl()

      const data: CreateLeadData = {
        ...arg,
        ...utmParams,
        source_page: sourcePage,
      }

      return leadsService.create(data)
    },
    {
      onSuccess: (lead) => {
        // Show success toast
        if (showToast) {
          showSuccessToast(
            'Заявка отправлена!',
            'Мы свяжемся с вами в ближайшее время'
          )
        }

        // Track analytics
        if (trackAnalytics) {
          analytics.trackLeadSubmit()
        }

        // Call custom success handler
        onSuccess?.(lead)
      },
      onError: (err) => {
        // Handle error with toast
        handleApiError(err, { showToast })
        
        // Call custom error handler
        onError?.(err)
      },
    }
  )

  return {
    submitLead: trigger,
    isSubmitting: isMutating,
    error,
    reset,
  }
}

/**
 * Simplified hook for quick lead submission
 */
export function useQuickLead() {
  return useLeadForm({
    showToast: true,
    trackAnalytics: true,
  })
}

