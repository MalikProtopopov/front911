'use client'

import { PageCTA } from '@/components/patterns'
import type { Contact } from '@/lib/api/generated'

interface DocumentDetailContentProps {
  initialContacts?: Contact[]
}

/**
 * Document Detail Content - Client Component
 * Main content is rendered in page.tsx (server) for optimal LCP
 * This component only handles CTA section with contacts
 */
export function DocumentDetailContent({ 
  initialContacts = [],
}: DocumentDetailContentProps) {
  return (
    <PageCTA
      title="Остались вопросы?"
      description="Свяжитесь с нами, если у вас есть вопросы по документам или работе сервиса."
      actions={[
        { label: 'Позвонить', showPhoneIcon: true },
        { label: 'Все документы', href: '/documents', variant: 'outline' }
      ]}
      initialContacts={initialContacts}
    />
  )
}

