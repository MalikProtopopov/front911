'use client'

import { MapPin, Clock } from 'lucide-react'
import { IconCircle } from '@/components/ui'
import { useContacts } from '@/lib/api/hooks'
import { 
  getContactLink, 
  isExternalContact,
  getAnyContactIcon,
  TelegramIcon,
  VKIcon,
} from '@/lib/utils/contacts'
import { LeadForm } from '@/components/forms/LeadForm'
import type { Contact } from '@/lib/api/generated'

/* =============================================================================
   CONTACTS PAGE CONTENT
   Client component for dynamic contacts display from API
   Only shows contacts that are returned from the API
============================================================================= */

interface ContactsContentProps {
  initialContacts?: Contact[]
}

// Working hours (hardcoded as this data is not in API)
const workingHours = [
  { day: 'Понедельник — Пятница', hours: '09:00 — 18:00' },
  { day: 'Суббота', hours: '10:00 — 16:00' },
  { day: 'Воскресенье', hours: 'Выходной' },
]

// Contact type descriptions
const contactDescriptions: Record<string, string> = {
  phone: 'Круглосуточная линия',
  email: 'Ответим в течение часа',
  whatsapp: 'Быстрая связь',
  telegram: 'Быстрая связь',
  address: 'Пн-Пт 9:00-18:00',
}

// Contact card component
function ContactCard({ contact }: { contact: Contact }) {
  const href = getContactLink(contact)
  const isExternal = isExternalContact(contact)
  const IconComponent = getAnyContactIcon(contact.contact_type)

  // For address type, render as div (not clickable)
  if (contact.contact_type === 'address') {
    return (
      <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all h-full">
        <IconCircle 
          icon={<MapPin className="w-6 h-6" />} 
          variant="primary-soft" 
          size="lg" 
          className="mb-4"
        />
        <h3 className="font-semibold text-lg mb-2 !mt-0">{contact.label}</h3>
        <p className="text-[var(--color-primary)] font-medium mb-2 break-words">
          {contact.value}
        </p>
        <p className="text-sm text-[var(--foreground-secondary)] mt-auto">
          {contactDescriptions[contact.contact_type] || ''}
        </p>
      </div>
    )
  }

  return (
    <a 
      href={href} 
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="flex flex-col items-center text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all h-full"
    >
      <IconCircle 
        icon={IconComponent ? <IconComponent className="w-6 h-6" /> : <MapPin className="w-6 h-6" />} 
        variant="primary-soft" 
        size="lg" 
        className="mb-4"
      />
      <h3 className="font-semibold text-lg mb-2 !mt-0">{contact.label}</h3>
      <p className="text-[var(--color-primary)] font-medium mb-2 break-words">
        {contact.value}
      </p>
      <p className="text-sm text-[var(--foreground-secondary)] mt-auto">
        {contactDescriptions[contact.contact_type] || ''}
      </p>
    </a>
  )
}

// Determine grid columns based on number of contacts
function getGridCols(count: number): 1 | 2 | 3 | 4 {
  if (count >= 4) return 4
  if (count === 3) return 3
  if (count === 2) return 2
  return 1
}

export function ContactsContent({ initialContacts = [] }: ContactsContentProps) {
  // SSR-only mode: uses server data, no client revalidation
  const { contacts } = useContacts(
    undefined,
    { fallbackData: initialContacts.length > 0 ? initialContacts : undefined }
  )
  
  // Use SSR data (contacts from hook includes fallbackData)
  const displayContacts = contacts.length > 0 ? contacts : initialContacts
  
  // Filter contacts to show in the main grid (phone, email, whatsapp, telegram, address)
  const mainContacts = displayContacts.filter(c => 
    ['phone', 'email', 'whatsapp', 'telegram', 'address'].includes(c.contact_type)
  ).slice(0, 4) // Show max 4 cards

  // Get social contacts for sidebar
  const telegramContact = displayContacts.find(c => c.contact_type === 'telegram')
  const vkContact = displayContacts.find(c => c.contact_type === 'vk')
  
  // Get social links - only use if API returns these contacts
  const telegramHref = telegramContact ? getContactLink(telegramContact) : null
  const vkHref = vkContact ? getContactLink(vkContact) : null
  
  // Check if we have any social contacts to show
  const hasTelegram = !!telegramHref
  const hasVk = !!vkHref
  const hasSocialLinks = hasTelegram || hasVk
  
  // Calculate grid columns based on number of contacts
  const gridCols = getGridCols(mainContacts.length)

  return (
    <>
      {/* Contact Methods - only show if we have contacts */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          {mainContacts.length > 0 && (
            <div className={`grid gap-6 md:gap-8 mb-12 md:mb-16 ${
              gridCols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              gridCols === 3 ? 'grid-cols-1 md:grid-cols-3' :
              gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 max-w-md mx-auto'
            }`}>
              {mainContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-8">Напишите нам</h2>
              <LeadForm 
                showCard={false} 
                title="" 
                messagePlaceholder="Опишите ваш вопрос или предложение"
                leadType="feedback"
              />
            </div>

            {/* Sidebar */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Working Hours */}
              <div className="p-6 rounded-xl bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <IconCircle 
                    icon={<Clock className="w-6 h-6" />}
                    variant="primary-soft"
                    size="md"
                  />
                  <h3 className="font-semibold text-lg !mt-0 !mb-0">Часы работы офиса</h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-[var(--foreground-secondary)]">{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[var(--color-success)]/10 rounded-lg">
                  <p className="text-sm text-center">
                    <strong>Служба помощи</strong> работает <strong>24/7</strong>
                  </p>
                </div>
              </div>

              {/* Social Links - only show if we have social contacts from API */}
              {hasSocialLinks && (
                <div className="p-6 rounded-xl bg-white">
                  <h3 className="font-semibold text-lg mb-4 !mt-0">Мы в соцсетях</h3>
                  <div className="flex gap-3">
                    {hasTelegram && (
                      <a 
                        href={telegramHref} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-[var(--background-secondary)] hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center transition-colors"
                        aria-label="Telegram"
                      >
                        <TelegramIcon className="w-5 h-5" />
                      </a>
                    )}
                    {hasVk && (
                      <a 
                        href={vkHref} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-[var(--background-secondary)] hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center transition-colors"
                        aria-label="VK"
                      >
                        <VKIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

