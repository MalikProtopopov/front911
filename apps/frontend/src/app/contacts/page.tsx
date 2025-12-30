import { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { generatePageMetadata, prefetchContacts } from '@/lib/api/hooks'
import { CONTACT_INFO } from '@/lib/config/constants'
import { PageCTA, HeroSection } from '@/components/patterns'
import { ContactsContent } from './ContactsContent'
import { logServerError } from '@/lib/utils/serverLogger'
import type { Contact } from '@/lib/api/generated'

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/contacts/', {
    title: 'Контакты — 911 Автопомощь',
    description: `Свяжитесь с нами: ${CONTACT_INFO.PHONE}. Круглосуточная поддержка. Работаем в 82 городах России.`,
  })
}

export default async function ContactsPage() {
  // Fetch contacts on the server for SSR
  let initialContacts: Contact[] = []
  
  try {
    initialContacts = await prefetchContacts()
  } catch (error) {
    logServerError(error, 'Failed to fetch contacts for SSR', {
      page: '/contacts',
    })
    // Continue with empty array - client will try to fetch
  }

  return (
    <PageLayout>
      {/* Hero */}
      <HeroSection
        id="contacts-hero-section"
        title="Контакты"
        subtitle="Свяжитесь с нами любым удобным способом. Мы работаем круглосуточно."
        breadcrumbs={[{ label: 'Контакты' }]}
        containerSize="wide"
      />

      {/* Dynamic Contacts Content from API */}
      <ContactsContent initialContacts={initialContacts} />

      {/* CTA */}
      <PageCTA
        title="Нужна срочная помощь?"
        description="Служба автопомощи работает круглосуточно. Позвоните, и мастер приедет в течение 15-30 минут."
        actions={[
          { label: 'Позвонить', showPhoneIcon: true },
          { label: 'Все услуги', href: '/services', variant: 'outline' },
        ]}
        initialContacts={initialContacts}
      />
    </PageLayout>
  )
}
