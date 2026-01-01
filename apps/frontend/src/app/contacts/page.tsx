import { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { generatePageSeo, prefetchContacts, prefetchSeoMeta } from '@/lib/api/hooks'
import { CONTACT_INFO } from '@/lib/config/constants'
import { PageCTA, HeroSection } from '@/components/patterns'
import { ContactsContent } from './ContactsContent'
import { logServerError } from '@/lib/utils/serverLogger'
import type { Contact, SeoMetaPublic } from '@/lib/api/generated'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/contacts/', {
    title: 'Контакты — 911 Автопомощь',
    description: `Свяжитесь с нами: ${CONTACT_INFO.PHONE}. Круглосуточная поддержка. Работаем в 82 городах России.`,
    h1Title: 'Контакты',
  })
  return seo.metadata
}

export default async function ContactsPage() {
  // Fetch contacts and SEO on the server for SSR
  let initialContacts: Contact[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    [initialContacts, seoData] = await Promise.all([
      prefetchContacts(),
      prefetchSeoMeta('/contacts/'),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for contacts page SSR', {
      page: '/contacts',
    })
    // Continue with defaults - client will try to fetch
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'Контакты'
  const pageSubtitle = 'Свяжитесь с нами любым удобным способом. Мы работаем круглосуточно.'

  return (
    <>
      {/* JSON-LD Schema from SEO API */}
      {seoData?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema_json) }}
        />
      )}

      <PageLayout>
        {/* Hero */}
        <HeroSection
          id="contacts-hero-section"
          title={pageTitle}
          subtitle={pageSubtitle}
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
    </>
  )
}
