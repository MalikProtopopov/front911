/**
 * UI State Slice
 * Manages modals, drawers, toasts, and other UI state
 */

import type { StateCreator } from 'zustand'

export type ModalType = 'leadForm' | 'video' | 'citySelect' | 'serviceSelect' | null

export interface UISlice {
  // Modal state
  activeModal: ModalType
  modalData: Record<string, unknown> | null
  
  // Mobile menu
  isMobileMenuOpen: boolean
  
  // Scroll state
  isScrolled: boolean
  scrollY: number
  
  // Actions
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setScrollState: (isScrolled: boolean, scrollY: number) => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  // Initial state
  activeModal: null,
  modalData: null,
  isMobileMenuOpen: false,
  isScrolled: false,
  scrollY: 0,

  // Actions
  openModal: (modal, data) =>
    set({
      activeModal: modal,
      modalData: data ?? null,
    }),

  closeModal: () =>
    set({
      activeModal: null,
      modalData: null,
    }),

  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    })),

  setMobileMenuOpen: (open) =>
    set({
      isMobileMenuOpen: open,
    }),

  setScrollState: (isScrolled, scrollY) =>
    set({
      isScrolled,
      scrollY,
    }),
})

