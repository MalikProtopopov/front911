import { Metadata } from 'next'
import { documentsService } from '@/lib/api/services'
import { generatePageSeo, prefetchSeoMeta } from '@/lib/api/hooks'
import { logServerError } from '@/lib/utils/serverLogger'
import { HeroSection } from '@/components/patterns'
import { PageLayout } from '@/components/layout'
import { DocumentsList } from './DocumentsList'
import type { DocumentListItem } from '@/lib/api/services'
import type { SeoMetaPublic } from '@/lib/api/generated'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/documents/', {
    title: 'Документы | 911 Автопомощь',
    description: 'Юридические документы и соглашения сервиса 911: политика конфиденциальности, пользовательское соглашение, публичная оферта.',
    h1Title: 'Документы',
  })
  return seo.metadata
}

export default async function DocumentsPage() {
  let documents: DocumentListItem[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    [documents, seoData] = await Promise.all([
      documentsService.getAll({ ordering: '-updated_at' }),
      prefetchSeoMeta('/documents/'),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for documents page SSR', {
      page: '/documents',
    })
    // Continue - client will try to fetch
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'Документы'
  const pageSubtitle = 'Юридические документы и соглашения сервиса 911'
  
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
        {/* Hero Section - Server-rendered for optimal LCP */}
        <HeroSection
          id="documents-hero-section"
          title={pageTitle}
          subtitle={pageSubtitle}
          breadcrumbs={[
            { label: 'Документы' }
          ]}
          containerSize="wide"
        />
        
        {/* Documents List - Client component for interactivity */}
        <DocumentsList initialDocuments={documents} />
      </PageLayout>
    </>
  )
}

