'use client'

import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContacts } from '@/lib/api/hooks'
import { getPrimaryPhone, getContactLink, getFallbackPhoneLink } from '@/lib/utils/contacts'
import { cn } from '@/lib/utils'
import type { Contact } from '@/lib/api/generated'

/* =============================================================================
   PHONE BUTTON COMPONENT
   Reusable phone call button with consistent styling
   Uses contacts from API with SSR support and fallback to constants
============================================================================= */

export interface PhoneButtonProps {
  /** Button label */
  label?: string
  /** Show phone icon */
  showIcon?: boolean
  /** Button variant */
  variant?: 'default' | 'outline'
  /** Button size */
  size?: 'default' | 'sm' | 'lg'
  /** Full width button */
  fullWidth?: boolean
  /** Additional class names */
  className?: string
  /** Initial contacts for SSR */
  initialContacts?: Contact[]
}

/**
 * Reusable phone call button
 * Fetches phone number from API with SSR support and fallback to CONTACT_INFO
 * 
 * @example
 * ```tsx
 * // Default usage
 * <PhoneButton />
 * 
 * // Outline variant
 * <PhoneButton variant="outline" />
 * 
 * // With SSR data
 * <PhoneButton initialContacts={contacts} />
 * ```
 */
export function PhoneButton({
  label = 'Позвонить',
  showIcon = true,
  variant = 'default',
  size = 'lg',
  fullWidth = false,
  className,
  initialContacts = [],
}: PhoneButtonProps) {
  // Fetch phone contacts from API with SSR support
  const { contacts } = useContacts(
    { contactType: 'phone' },
    { fallbackData: initialContacts.length > 0 ? initialContacts.filter(c => c.contact_type === 'phone') : undefined }
  )
  
  // Get primary phone from API or use fallback
  const primaryPhone = getPrimaryPhone(contacts)
  const phoneLink = primaryPhone ? getContactLink(primaryPhone) : getFallbackPhoneLink()

  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={cn(
        fullWidth && 'w-full',
        className
      )}
    >
      <a href={phoneLink}>
        {showIcon && <Phone className="w-5 h-5 flex-shrink-0" />}
        <span className="leading-none">{label}</span>
      </a>
    </Button>
  )
}
