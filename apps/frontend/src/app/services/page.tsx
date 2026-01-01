import { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { generatePageSeo, prefetchSeoMeta } from "@/lib/api/hooks"
import { servicesService, contentService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import { ServicesList } from "./ServicesList"
import { PageCTA, HeroSection } from '@/components/patterns'
import type { ServiceList, Contact, SeoMetaPublic } from "@/lib/api/generated"

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/services/', {
    title: 'Услуги — 911 Автопомощь',
    description: 'Полный спектр автопомощи: шиномонтаж, эвакуатор, доставка топлива, техпомощь. Работаем 24/7 в 82 городах России.',
    h1Title: 'Наши услуги',
  })
  return seo.metadata
}

export default async function ServicesPage() {
  // Fetch services, contacts and SEO on the server for SSR
  let initialServices: ServiceList[] = []
  let initialContacts: Contact[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    [initialServices, initialContacts, seoData] = await Promise.all([
      servicesService.getAll(),
      contentService.getContacts(),
      prefetchSeoMeta('/services/'),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for services page SSR', {
      page: '/services',
    })
    // Continue with empty arrays - client will try to fetch
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'Наши услуги'
  const pageSubtitle = 'Полный спектр автопомощи для любых ситуаций на дороге. Быстро, надёжно, круглосуточно.'

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
          id="services-hero-section"
          title={pageTitle}
          subtitle={pageSubtitle}
          breadcrumbs={[{ label: 'Услуги' }]}
          containerSize="wide"
        />

        {/* Services List - Client Component with SSR data */}
        <ServicesList initialServices={initialServices} />

        {/* CTA */}
        <PageCTA
          title="Не нашли нужную услугу?"
          description="Свяжитесь с нами, и мы поможем решить вашу проблему"
          actions={[
            { label: 'Позвонить', showPhoneIcon: true },
            { label: 'Контакты', href: '/contacts', variant: 'outline' },
          ]}
          initialContacts={initialContacts}
        />
      </PageLayout>
    </>
  )
}
