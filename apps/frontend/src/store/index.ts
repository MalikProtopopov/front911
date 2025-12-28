/**
 * Zustand Store
 * Central state management for the application
 */

import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createLeadFormSlice, type LeadFormSlice } from './slices/leadFormSlice'
import { createFiltersSlice, type FiltersSlice } from './slices/filtersSlice'
import { STORAGE_KEYS } from '@/lib/config/constants'

// Combined store type
export type StoreState = UISlice & LeadFormSlice & FiltersSlice

// Create the store with middleware
export const useStore = create<StoreState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (...a) => ({
          ...createUISlice(...a),
          ...createLeadFormSlice(...a),
          ...createFiltersSlice(...a),
        }),
        {
          name: STORAGE_KEYS.STORE,
          // Only persist certain fields
          partialize: (state) => ({
            // Persist form draft for recovery
            formDraft: state.formDraft,
            // Persist submission tracking
            lastSubmittedAt: state.lastSubmittedAt,
            submissionCount: state.submissionCount,
            // Persist selected city/service
            selectedCityId: state.selectedCityId,
            selectedServiceId: state.selectedServiceId,
          }),
        }
      )
    ),
    {
      name: '911-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

// Selector hooks for better performance
export const useUIStore = () =>
  useStore(
    useShallow((state) => ({
      activeModal: state.activeModal,
      modalData: state.modalData,
      isMobileMenuOpen: state.isMobileMenuOpen,
      isScrolled: state.isScrolled,
      openModal: state.openModal,
      closeModal: state.closeModal,
      toggleMobileMenu: state.toggleMobileMenu,
      setMobileMenuOpen: state.setMobileMenuOpen,
      setScrollState: state.setScrollState,
    }))
  )

// Separate selectors for state and actions to prevent infinite loops
export const useLeadFormState = () =>
  useStore(
    useShallow((state) => ({
      formDraft: state.formDraft,
      selectedCityId: state.selectedCityId,
      selectedServiceId: state.selectedServiceId,
    }))
  )

export const useLeadFormActions = () =>
  useStore(
    useShallow((state) => ({
      updateFormDraft: state.updateFormDraft,
      clearFormDraft: state.clearFormDraft,
      setSelectedCity: state.setSelectedCity,
      setSelectedService: state.setSelectedService,
      recordSubmission: state.recordSubmission,
      canSubmit: state.canSubmit,
    }))
  )

// Legacy hook for backward compatibility (deprecated - use separate hooks)
export const useLeadFormStore = () => {
  const state = useLeadFormState()
  const actions = useLeadFormActions()
  return { ...state, ...actions }
}

export const useFiltersStore = () =>
  useStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      selectedCitySlug: state.selectedCitySlug,
      selectedServiceSlug: state.selectedServiceSlug,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      setSearchQuery: state.setSearchQuery,
      clearSearchQuery: state.clearSearchQuery,
      setFilterCitySlug: state.setFilterCitySlug,
      setFilterServiceSlug: state.setFilterServiceSlug,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      resetFilters: state.resetFilters,
    }))
  )

// Export types
export type { UISlice, ModalType } from './slices/uiSlice'
export type { LeadFormSlice, LeadFormDraft } from './slices/leadFormSlice'
export type { FiltersSlice } from './slices/filtersSlice'

