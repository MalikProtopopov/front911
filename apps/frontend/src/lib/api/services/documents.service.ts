/**
 * Documents API Service
 * Handles all document-related API calls
 */

import { OpenAPI } from '../client'
import { ApiError } from '@/lib/errors'

// Document list item (short info)
export interface DocumentListItem {
  id: number
  title: string
  slug: string
  short_description: string // HTML
  version: string
  updated_at: string // ISO 8601
}

// Full document detail
export interface DocumentDetail {
  id: number
  title: string
  slug: string
  short_description: string // HTML
  full_description: string // HTML
  version: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  h1_title: string
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// Document list response
export interface DocumentListResponse {
  count: number
  next: string | null
  previous: string | null
  results: DocumentListItem[]
}

export interface GetDocumentsParams {
  ordering?: string
}

export const documentsService = {
  /**
   * Get all documents
   * @param params - Query parameters
   * @returns List of documents
   */
  getAll: async (params?: GetDocumentsParams): Promise<DocumentListItem[]> => {
    try {
      const baseUrl = OpenAPI.BASE || 'http://localhost:8001'
      const ordering = params?.ordering || '-updated_at'
      const url = `${baseUrl}/api/website/documents/?ordering=${ordering}`
      
      const fetchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch documents: ${fetchResponse.status}`)
      }

      const data: DocumentListResponse = await fetchResponse.json()
      return data.results || []
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },

  /**
   * Get document by slug
   * @param slug - Document slug
   * @returns Document detail or null if not found
   */
  getBySlug: async (slug: string): Promise<DocumentDetail | null> => {
    try {
      const baseUrl = OpenAPI.BASE || 'http://localhost:8001'
      const url = `${baseUrl}/api/website/documents/${slug}/`
      
      const fetchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (fetchResponse.status === 404) {
        return null
      }

      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch document: ${fetchResponse.status}`)
      }

      const data: DocumentDetail = await fetchResponse.json()
      return data
    } catch (error) {
      throw ApiError.fromUnknown(error)
    }
  },
}

