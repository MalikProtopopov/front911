import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
  }
  if (cleaned.startsWith('8')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
  }
  return phone
}

/**
 * Format phone number with mask: +7 (999)-999-99-99
 * Only allows digits, limits to 11 digits total (10 after +7)
 */
export function formatPhoneInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // Limit to 11 digits (10 after +7)
  const limitedDigits = digits.slice(0, 11)
  
  // If starts with 8, replace with 7
  const normalizedDigits = limitedDigits.startsWith('8') 
    ? '7' + limitedDigits.slice(1)
    : limitedDigits.startsWith('7')
    ? limitedDigits
    : '7' + limitedDigits
  
  // Format: +7 (999)-999-99-99
  if (normalizedDigits.length === 0) {
    return ''
  }
  
  if (normalizedDigits.length <= 1) {
    return '+7'
  }
  
  if (normalizedDigits.length <= 4) {
    return `+7 (${normalizedDigits.slice(1)}`
  }
  
  if (normalizedDigits.length <= 7) {
    return `+7 (${normalizedDigits.slice(1, 4)})-${normalizedDigits.slice(4)}`
  }
  
  if (normalizedDigits.length <= 9) {
    return `+7 (${normalizedDigits.slice(1, 4)})-${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7)}`
  }
  
  return `+7 (${normalizedDigits.slice(1, 4)})-${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`
}

/**
 * Extract clean phone number (only digits) from formatted phone
 */
export function cleanPhoneNumber(formattedPhone: string): string {
  const digits = formattedPhone.replace(/\D/g, '')
  // Normalize: if starts with 8, replace with 7; if doesn't start with 7, add 7
  if (digits.startsWith('8')) {
    return '7' + digits.slice(1)
  }
  if (digits.startsWith('7')) {
    return digits
  }
  return '7' + digits
}

export function formatPrice(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const utmParams: Record<string, string> = {}
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  utmKeys.forEach(key => {
    const value = params.get(key)
    if (value) utmParams[key] = value
  })
  
  return utmParams
}

