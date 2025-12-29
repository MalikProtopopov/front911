'use client'

/**
 * ContactLink Component
 * Universal component for rendering contact links with icons
 */

import type { Contact } from '@/lib/api/generated'
import { 
  getContactLink, 
  isExternalContact, 
  getContactIcon,
  getSocialIcon,
} from '@/lib/utils/contacts'
import { cn } from '@/lib/utils'

export interface ContactLinkProps {
  /** Contact object from API */
  contact: Contact
  /** Show icon */
  showIcon?: boolean
  /** Show label (use label field, fallback to value) */
  showLabel?: boolean
  /** Show value (the actual contact value like phone number) */
  showValue?: boolean
  /** Icon size class */
  iconClassName?: string
  /** Additional class names for the link */
  className?: string
  /** Additional class names for the label text */
  labelClassName?: string
  /** Additional class names for the value text */
  valueClassName?: string
}

/**
 * Universal contact link component
 * Automatically handles different contact types (phone, email, social, etc.)
 * 
 * @example
 * ```tsx
 * // Basic usage - shows icon and label
 * <ContactLink contact={phoneContact} />
 * 
 * // Show only icon
 * <ContactLink contact={whatsappContact} showLabel={false} />
 * 
 * // Show icon and value (not label)
 * <ContactLink contact={phoneContact} showLabel={false} showValue />
 * 
 * // Custom styling
 * <ContactLink 
 *   contact={contact} 
 *   className="hover:text-primary" 
 *   iconClassName="w-6 h-6"
 * />
 * ```
 */
export function ContactLink({
  contact,
  showIcon = true,
  showLabel = true,
  showValue = false,
  iconClassName = 'w-4 h-4 flex-shrink-0',
  className,
  labelClassName,
  valueClassName,
}: ContactLinkProps) {
  const href = getContactLink(contact)
  const isExternal = isExternalContact(contact)
  
  // Get icon component - try lucide first, then social SVG
  const LucideIcon = getContactIcon(contact.contact_type)
  const SocialIcon = getSocialIcon(contact.contact_type)
  const IconComponent = LucideIcon || SocialIcon

  // Determine what text to show
  const displayLabel = contact.label || contact.value
  const displayValue = contact.value

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn('inline-flex items-center gap-2', className)}
    >
      {showIcon && IconComponent && (
        <IconComponent className={iconClassName} />
      )}
      {showLabel && (
        <span className={labelClassName}>{displayLabel}</span>
      )}
      {showValue && !showLabel && (
        <span className={valueClassName}>{displayValue}</span>
      )}
      {showValue && showLabel && displayLabel !== displayValue && (
        <span className={cn('text-sm opacity-75', valueClassName)}>
          {displayValue}
        </span>
      )}
    </a>
  )
}

