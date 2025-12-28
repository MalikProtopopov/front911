/**
 * Lead Form State Slice
 * Manages form drafts and submission state
 */

import type { StateCreator } from 'zustand'

export interface LeadFormDraft {
  name: string
  phone: string
  email: string
  message: string
  cityId?: number
  serviceId?: number
}

export interface LeadFormSlice {
  // Form draft for persistence
  formDraft: LeadFormDraft
  
  // Selected values
  selectedCityId: number | null
  selectedServiceId: number | null
  
  // Submission state
  lastSubmittedAt: number | null
  submissionCount: number
  
  // Actions
  updateFormDraft: (draft: Partial<LeadFormDraft>) => void
  clearFormDraft: () => void
  setSelectedCity: (cityId: number | null) => void
  setSelectedService: (serviceId: number | null) => void
  recordSubmission: () => void
  canSubmit: () => boolean
}

const initialDraft: LeadFormDraft = {
  name: '',
  phone: '',
  email: '',
  message: '',
  cityId: undefined,
  serviceId: undefined,
}

// Rate limiting: max 5 submissions per hour
const MAX_SUBMISSIONS_PER_HOUR = 5
const ONE_HOUR = 60 * 60 * 1000

export const createLeadFormSlice: StateCreator<
  LeadFormSlice,
  [],
  [],
  LeadFormSlice
> = (set, get) => ({
  // Initial state
  formDraft: initialDraft,
  selectedCityId: null,
  selectedServiceId: null,
  lastSubmittedAt: null,
  submissionCount: 0,

  // Actions
  updateFormDraft: (draft) =>
    set((state) => ({
      formDraft: { ...state.formDraft, ...draft },
    })),

  clearFormDraft: () =>
    set({
      formDraft: initialDraft,
    }),

  setSelectedCity: (cityId) =>
    set((state) => {
      if (state.selectedCityId === cityId) return state
      return {
        selectedCityId: cityId,
        formDraft: { ...state.formDraft, cityId: cityId ?? undefined },
      }
    }),

  setSelectedService: (serviceId) =>
    set((state) => {
      if (state.selectedServiceId === serviceId) return state
      return {
        selectedServiceId: serviceId,
        formDraft: { ...state.formDraft, serviceId: serviceId ?? undefined },
      }
    }),

  recordSubmission: () =>
    set((state) => {
      const now = Date.now()
      // Reset count if more than an hour has passed
      const shouldReset =
        state.lastSubmittedAt && now - state.lastSubmittedAt > ONE_HOUR

      return {
        lastSubmittedAt: now,
        submissionCount: shouldReset ? 1 : state.submissionCount + 1,
      }
    }),

  canSubmit: () => {
    const state = get()
    const now = Date.now()

    // Allow if never submitted
    if (!state.lastSubmittedAt) return true

    // Reset if more than an hour has passed
    if (now - state.lastSubmittedAt > ONE_HOUR) return true

    // Check submission count
    return state.submissionCount < MAX_SUBMISSIONS_PER_HOUR
  },
})

