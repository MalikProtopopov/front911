/**
 * Filters State Slice
 * Manages city/service filters and search state
 */

import type { StateCreator } from 'zustand'

export interface FiltersSlice {
  // Search
  searchQuery: string
  
  // City filters
  selectedCitySlug: string | null
  
  // Service filters
  selectedServiceSlug: string | null
  
  // Pagination
  currentPage: number
  pageSize: number
  
  // Actions
  setSearchQuery: (query: string) => void
  clearSearchQuery: () => void
  setFilterCitySlug: (slug: string | null) => void
  setFilterServiceSlug: (slug: string | null) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  resetFilters: () => void
}

export const createFiltersSlice: StateCreator<
  FiltersSlice,
  [],
  [],
  FiltersSlice
> = (set) => ({
  // Initial state
  searchQuery: '',
  selectedCitySlug: null,
  selectedServiceSlug: null,
  currentPage: 1,
  pageSize: 10,

  // Actions
  setSearchQuery: (query) =>
    set({
      searchQuery: query,
      currentPage: 1, // Reset to first page on search
    }),

  clearSearchQuery: () =>
    set({
      searchQuery: '',
      currentPage: 1,
    }),

  setFilterCitySlug: (slug) =>
    set({
      selectedCitySlug: slug,
      currentPage: 1,
    }),

  setFilterServiceSlug: (slug) =>
    set({
      selectedServiceSlug: slug,
      currentPage: 1,
    }),

  setPage: (page) =>
    set({
      currentPage: page,
    }),

  setPageSize: (size) =>
    set({
      pageSize: size,
      currentPage: 1,
    }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCitySlug: null,
      selectedServiceSlug: null,
      currentPage: 1,
      pageSize: 10,
    }),
})
