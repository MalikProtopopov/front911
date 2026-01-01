import { Metadata } from 'next'
import { contentService } from '@/lib/api/services'
import { generatePageSeo, prefetchSeoMeta } from '@/lib/api/hooks'
import { logServerError } from '@/lib/utils/serverLogger'
import { PartnersContent } from './PartnersContent'
import type { AppLink, Contact, SeoMetaPublic } from '@/lib/api/generated'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/partners/', {
    title: 'Стать партнёром — 911 Автопомощь',
    description: 'Присоединяйтесь к сети партнёров 911. Стабильный поток заказов, удобный личный кабинет, своевременные выплаты.',
    h1Title: 'Станьте партнёром 911',
  })
  return seo.metadata
}

export default async function PartnersPage() {
  // Fetch data on the server for SSR
  let initialAppLinks: AppLink[] = []
  let initialContacts: Contact[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    [initialAppLinks, initialContacts, seoData] = await Promise.all([
      contentService.getAppLinks(),
      contentService.getContacts(),
      prefetchSeoMeta('/partners/'),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for partners page SSR', {
      page: '/partners',
    })
    // Continue with empty arrays - client will try to fetch
  }

  return (
    <>
      {/* JSON-LD Schema from SEO API */}
      {seoData?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema_json) }}
        />
      )}
      
      <PartnersContent 
        initialAppLinks={initialAppLinks}
        initialContacts={initialContacts}
        seoTitle={seoData?.h1_title}
      />
    </>
  )
}
