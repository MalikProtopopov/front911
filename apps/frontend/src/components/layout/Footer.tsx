'use client'

import Link from "next/link"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { useServices, useContacts } from "@/lib/api/hooks"
import { 
  getContactLink, 
  getPrimaryPhone, 
  getPrimaryEmail, 
  getContactsByType,
  getFallbackPhoneLink,
  getFallbackPhoneDisplay,
  getFallbackEmail,
  getFallbackWhatsAppLink,
  getFallbackSocialLinks,
  TelegramIcon,
  VKIcon,
} from "@/lib/utils/contacts"
import type { ServiceList, Contact } from "@/lib/api/generated"
import type { DocumentListItem } from "@/lib/api/services"

interface FooterProps {
  initialServices?: ServiceList[]
  initialContacts?: Contact[]
  initialDocuments?: DocumentListItem[]
}

export function Footer({ initialServices = [], initialContacts = [], initialDocuments = [] }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  // Use SWR with server-provided initial data for hydration
  const { services } = useServices(
    undefined,
    { fallbackData: initialServices.length > 0 ? initialServices : undefined }
  )

  // Fetch contacts from API with server-provided initial data
  const { contacts, isError: isContactsError } = useContacts(
    undefined,
    { fallbackData: initialContacts.length > 0 ? initialContacts : undefined }
  )

  // Get contacts by type with fallbacks
  const primaryPhone = getPrimaryPhone(contacts)
  const primaryEmail = getPrimaryEmail(contacts)
  const whatsappContacts = getContactsByType(contacts, 'whatsapp')
  const telegramContacts = getContactsByType(contacts, 'telegram')
  const vkContacts = getContactsByType(contacts, 'vk')

  // Fallback values
  const fallbackSocial = getFallbackSocialLinks()
  
  // Build contact data with fallbacks
  const phoneHref = primaryPhone ? getContactLink(primaryPhone) : getFallbackPhoneLink()
  const phoneDisplay = primaryPhone?.value || getFallbackPhoneDisplay()
  const emailHref = primaryEmail ? getContactLink(primaryEmail) : `mailto:${getFallbackEmail()}`
  const emailDisplay = primaryEmail?.value || getFallbackEmail()
  const whatsappHref = whatsappContacts[0] ? getContactLink(whatsappContacts[0]) : getFallbackWhatsAppLink()
  const telegramHref = telegramContacts[0] ? getContactLink(telegramContacts[0]) : fallbackSocial.telegram
  const vkHref = vkContacts[0] ? getContactLink(vkContacts[0]) : fallbackSocial.vk

  // Log warning if using fallback
  if (isContactsError && typeof window !== 'undefined') {
    console.warn('[Footer] Contacts API unavailable, using fallback values')
  }

  // Company links - only existing pages
  const companyLinks = [
    { label: "Для партнёров", href: "/partners" },
    { label: "Контакты", href: "/contacts" },
  ]

  // Documents from API (first 5)
  const documents = initialDocuments.slice(0, 5)

  return (
    <footer className="bg-[var(--background-dark)] text-[var(--foreground-inverse)] section-spacing">
      <div className="container mx-auto">
        {/* 4 Column Grid aligned to base grid system */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 section-gap-xl">
          {/* Company Info */}
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-bold leading-none text-[var(--color-primary)]">
                911
              </div>
              <span className="text-lg leading-none">Автопомощь</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Экстренная автопомощь за 15 минут. Проверенные мастера в 82 городах России.
            </p>
            {/* Contacts from API with fallbacks */}
            <div className="space-y-3">
              <a
                href={phoneHref}
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{phoneDisplay}</span>
              </a>
              <a
                href={emailHref}
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{emailDisplay}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>{whatsappContacts[0]?.label || 'WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Services from API */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 leading-tight">Услуги</h3>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-gray-300 hover:text-[var(--color-primary)] hover:underline transition-colors inline-block"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-block font-medium"
                >
                  Все услуги →
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 leading-tight">География</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cities"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-block font-medium"
                >
                  Все города →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Help */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 leading-tight">Компания</h3>
            <ul className="space-y-3 mb-6">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-[var(--color-primary)] hover:underline transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-4 leading-tight">Документы</h3>
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/documents/${doc.slug}`}
                    className="text-sm text-gray-300 hover:text-[var(--color-primary)] hover:underline transition-colors inline-block"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
              {documents.length > 0 && (
                <li>
                  <Link
                    href="/documents"
                    className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-block font-medium"
                  >
                    Все документы →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} 911. Все права защищены.
            </div>
            {/* Social Links from API with fallbacks */}
            <div className="flex gap-4">
              <a
                href={vkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
                aria-label="VK"
              >
                <VKIcon className="w-5 h-5" />
              </a>
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
