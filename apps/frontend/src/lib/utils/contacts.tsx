/**
 * Contact Utilities
 * Helper functions for working with contacts from API
 */

import { Phone, Mail, MessageCircle } from 'lucide-react'
import type { Contact } from '@/lib/api/generated'
import { CONTACT_INFO, EXTERNAL_LINKS } from '@/lib/config/constants'

// Contact type literals
export type ContactType = 'phone' | 'email' | 'telegram' | 'whatsapp' | 'vk' | 'instagram' | 'facebook'

/**
 * Get the appropriate link for a contact based on its type
 * @param contact - Contact object from API
 * @returns Formatted link (tel:, mailto:, or URL)
 */
export function getContactLink(contact: Contact): string {
  switch (contact.contact_type) {
    case 'phone':
      // Remove all non-digit characters except + for tel: links
      return `tel:${contact.value.replace(/[^\d+]/g, '')}`
    case 'email':
      return `mailto:${contact.value}`
    case 'telegram':
      // Handle both @username and direct username formats
      const telegramValue = contact.value.startsWith('@')
        ? contact.value.slice(1)
        : contact.value.startsWith('https://') || contact.value.startsWith('http://')
          ? contact.value
          : contact.value
      // If it's already a full URL, return as is
      if (telegramValue.startsWith('https://') || telegramValue.startsWith('http://')) {
        return telegramValue
      }
      return `https://t.me/${telegramValue}`
    case 'whatsapp':
      // If value is already a full URL, return as is
      if (contact.value.startsWith('https://') || contact.value.startsWith('http://')) {
        return contact.value
      }
      // Otherwise, assume it's a phone number and construct wa.me link
      const whatsappNumber = contact.value.replace(/[^\d]/g, '')
      return `https://wa.me/${whatsappNumber}`
    case 'vk':
    case 'instagram':
    case 'facebook':
      // These should already contain full URLs
      return contact.value
    default:
      return '#'
  }
}

/**
 * Check if a contact link should open in a new tab
 * @param contact - Contact object from API
 * @returns Whether to open in new tab
 */
export function isExternalContact(contact: Contact): boolean {
  return !['phone', 'email'].includes(contact.contact_type)
}

/**
 * Get icon component for a contact type
 * Returns lucide-react icons for phone, email, whatsapp
 * Returns null for social networks (use SVG instead)
 */
export function getContactIcon(contactType: string): React.ComponentType<{ className?: string }> | null {
  switch (contactType) {
    case 'phone':
      return Phone
    case 'email':
      return Mail
    case 'whatsapp':
      return MessageCircle
    case 'telegram':
    case 'vk':
    case 'instagram':
    case 'facebook':
      // Use SVG components for these
      return null
    default:
      return null
  }
}

/**
 * Filter contacts by type
 * @param contacts - Array of contacts from API
 * @param type - Contact type to filter by
 * @returns Filtered array of contacts
 */
export function getContactsByType(contacts: Contact[], type: ContactType): Contact[] {
  return contacts.filter(c => c.contact_type === type)
}

/**
 * Get the primary phone contact (first phone by display_order)
 * @param contacts - Array of contacts from API
 * @returns Primary phone contact or null
 */
export function getPrimaryPhone(contacts: Contact[]): Contact | null {
  const phones = getContactsByType(contacts, 'phone')
  return phones[0] ?? null
}

/**
 * Get the primary email contact (first email by display_order)
 * @param contacts - Array of contacts from API
 * @returns Primary email contact or null
 */
export function getPrimaryEmail(contacts: Contact[]): Contact | null {
  const emails = getContactsByType(contacts, 'email')
  return emails[0] ?? null
}

/**
 * Get fallback phone link when API is unavailable
 */
export function getFallbackPhoneLink(): string {
  return `tel:${CONTACT_INFO.PHONE_RAW}`
}

/**
 * Get fallback phone number for display when API is unavailable
 */
export function getFallbackPhoneDisplay(): string {
  return CONTACT_INFO.PHONE
}

/**
 * Get fallback email when API is unavailable
 */
export function getFallbackEmail(): string {
  return CONTACT_INFO.EMAIL
}

/**
 * Get fallback WhatsApp link when API is unavailable
 */
export function getFallbackWhatsAppLink(): string {
  return `https://wa.me/${CONTACT_INFO.WHATSAPP}`
}

/**
 * Get fallback social links when API is unavailable
 */
export function getFallbackSocialLinks() {
  return {
    telegram: EXTERNAL_LINKS.TELEGRAM,
    vk: EXTERNAL_LINKS.VK,
  }
}

/**
 * Group contacts by type for easier rendering
 * @param contacts - Array of contacts from API
 * @returns Object with contacts grouped by type
 */
export function groupContactsByType(contacts: Contact[]) {
  return {
    phones: getContactsByType(contacts, 'phone'),
    emails: getContactsByType(contacts, 'email'),
    whatsapp: getContactsByType(contacts, 'whatsapp'),
    telegram: getContactsByType(contacts, 'telegram'),
    vk: getContactsByType(contacts, 'vk'),
    instagram: getContactsByType(contacts, 'instagram'),
    facebook: getContactsByType(contacts, 'facebook'),
  }
}

// SVG Icons for social networks (as React components)
export const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.727-1.033-1.007-1.49-1.144-1.745-1.144-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.684 4 8.198c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.494 2.313 4.68 2.91 4.68.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.475-.085.72-.576.72z"/>
  </svg>
)

export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

/**
 * Get social icon component by contact type
 */
export function getSocialIcon(contactType: string): React.ComponentType<{ className?: string }> | null {
  switch (contactType) {
    case 'telegram':
      return TelegramIcon
    case 'vk':
      return VKIcon
    case 'instagram':
      return InstagramIcon
    case 'facebook':
      return FacebookIcon
    default:
      return null
  }
}

/**
 * Get any icon (lucide or SVG) for a contact type
 */
export function getAnyContactIcon(contactType: string): React.ComponentType<{ className?: string }> | null {
  return getContactIcon(contactType) || getSocialIcon(contactType)
}

