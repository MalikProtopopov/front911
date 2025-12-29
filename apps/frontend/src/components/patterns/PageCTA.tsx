'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { useContacts } from '@/lib/api/hooks'
import { getPrimaryPhone, getContactLink, getFallbackPhoneLink } from '@/lib/utils/contacts'

/* =============================================================================
   PAGE CTA COMPONENT
   CTA section for bottom of pages with heading, description and action buttons
   Now fetches phone from API with fallback to CONTACT_INFO
============================================================================= */

export interface PageCTAAction {
  /** Button label */
  label: string
  /** Link href or phone number (tel:). If showPhoneIcon is true and href is omitted, uses API phone */
  href?: string
  /** Button variant */
  variant?: 'default' | 'outline'
  /** Show phone icon and use API phone number if href not provided */
  showPhoneIcon?: boolean
  /** Custom icon element */
  icon?: ReactNode
  /** External link (opens in new tab) */
  external?: boolean
}

export interface PageCTAProps {
  /** Section heading */
  title: string
  /** Section description */
  description: string
  /** Action buttons */
  actions?: PageCTAAction[]
  /** Background variant */
  bg?: 'white' | 'secondary'
  /** Additional class names */
  className?: string
}

export function PageCTA({
  title,
  description,
  actions,
  bg = 'secondary',
  className,
}: PageCTAProps) {
  // Fetch phone contacts from API
  const { contacts: phoneContacts, isError } = useContacts({ contactType: 'phone' })
  
  // Get primary phone from API or use fallback
  const primaryPhone = getPrimaryPhone(phoneContacts)
  const phoneLink = primaryPhone ? getContactLink(primaryPhone) : getFallbackPhoneLink()
  
  // Log warning if using fallback (only in browser)
  if ((isError || phoneContacts.length === 0) && typeof window !== 'undefined' && !primaryPhone) {
    console.warn('[PageCTA] Contacts API unavailable, using fallback phone number')
  }

  // Default actions with dynamic phone
  const defaultActions: PageCTAAction[] = [
    {
      label: 'Позвонить',
      href: phoneLink,
      variant: 'default',
      showPhoneIcon: true,
    },
    {
      label: 'Связаться с нами',
      href: '/contacts',
      variant: 'outline',
    },
  ]

  const resolvedActions = actions ?? defaultActions

  const bgClasses = {
    white: 'bg-white',
    secondary: 'bg-[var(--background-secondary)]',
  }

  return (
    <section className={cn('page-cta', bgClasses[bg], className)}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="page-cta__content">
          <h2 className="page-cta__title">{title}</h2>
          <p className="page-cta__description">{description}</p>
          
          {resolvedActions.length > 0 && (
            <div className="page-cta__buttons flex flex-col sm:flex-row gap-4">
              {resolvedActions.map((action, index) => {
                // If showPhoneIcon is true and no href provided, use API phone
                const href = action.href || (action.showPhoneIcon ? phoneLink : '#')
                const isExternal = action.external || href.startsWith('tel:')
                const iconElement = action.icon ?? (action.showPhoneIcon ? <Phone className="w-5 h-5 flex-shrink-0" /> : null)
                
                return (
                  <Button 
                    key={index}
                    size="lg" 
                    variant={action.variant}
                    asChild 
                    className="page-cta__button sm:w-auto w-full"
                  >
                    {isExternal ? (
                      <a href={href} target={action.external ? '_blank' : undefined} rel={action.external ? 'noopener noreferrer' : undefined}>
                        {iconElement}
                        <span className="leading-none">{action.label}</span>
                      </a>
                    ) : (
                      <Link href={href}>
                        {iconElement}
                        <span className="leading-none">{action.label}</span>
                      </Link>
                    )}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
