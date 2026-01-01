import { Metadata } from 'next'
import { documentsService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { HeroSection } from '@/components/patterns'
import { PageLayout } from '@/components/layout'
import { DocumentsList } from './DocumentsList'
import type { DocumentListItem } from '@/lib/api/services'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
  
  return {
    title: 'Документы | 911 Автопомощь',
    description: 'Юридические документы и соглашения сервиса 911: политика конфиденциальности, пользовательское соглашение, публичная оферта.',
    alternates: {
      canonical: `${baseUrl}/documents`,
    },
  }
}

export default async function DocumentsPage() {
  let documents: DocumentListItem[] = []
  
  try {
    documents = await documentsService.getAll({ ordering: '-updated_at' })
  } catch (error) {
    logServerError(error, 'Failed to fetch documents for SSR', {
      page: '/documents',
    })
    // Continue - client will try to fetch
  }
  
  return (
    <PageLayout>
      {/* Hero Section - Server-rendered for optimal LCP */}
      <HeroSection
        id="documents-hero-section"
        title="Документы"
        subtitle="Юридические документы и соглашения сервиса 911"
        breadcrumbs={[
          { label: 'Документы' }
        ]}
        containerSize="wide"
      />
      
      {/* Documents List - Client component for interactivity */}
      <DocumentsList initialDocuments={documents} />
    </PageLayout>
  )
}

