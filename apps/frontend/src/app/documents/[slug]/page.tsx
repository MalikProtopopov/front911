import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { documentsService, contentService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { HeroSection, RichText } from '@/components/patterns'
import { PageLayout } from '@/components/layout'
import { DocumentDetailContent } from './DocumentDetailContent'
import type { DocumentDetail } from '@/lib/api/services'
import type { Contact } from '@/lib/api/generated'

interface DocumentPageProps {
  params: Promise<{ slug: string }>
}

// ISR: revalidate every hour
export const revalidate = 3600

// Allow dynamic params for new documents
export const dynamicParams = true

// Generate static paths for all documents
export async function generateStaticParams() {
  try {
    const documents = await documentsService.getAll({ ordering: '-updated_at' })
    return documents.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    logServerError(error, 'Failed to generate static params for documents', {
      page: '/documents/[slug]',
    })
    return []
  }
}

// Generate metadata with real document data
export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const document = await documentsService.getBySlug(slug)
    const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'
    
    if (!document) {
      return {
        title: 'Документ не найден | 911',
      }
    }
    
    // Use meta_title and meta_description from backend if available, otherwise use formula
    const title = document.meta_title || `${document.title} | 911`
    const description = document.meta_description || 
      `Ознакомьтесь с ${document.title.toLowerCase()} сервиса 911.`
    
    return {
      title,
      description,
      keywords: document.meta_keywords,
      alternates: {
        canonical: `${baseUrl}/documents/${slug}`,
      },
    }
  } catch {
    // Fallback metadata
    return {
      title: 'Документ | 911 Автопомощь',
      description: 'Ознакомьтесь с документом сервиса 911.',
    }
  }
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params
  
  // Fetch document data and contacts for SSR
  let document: DocumentDetail | null = null
  let initialContacts: Contact[] = []
  
  try {
    const [documentData, contactsData] = await Promise.all([
      documentsService.getBySlug(slug),
      contentService.getContacts(),
    ])
    document = documentData
    initialContacts = contactsData
  } catch (error) {
    logServerError(error, 'Failed to fetch document data for SSR', {
      page: '/documents/[slug]',
      params: { slug },
    })
    // Continue - client will try to fetch
  }
  
  if (!document) {
    notFound()
  }
  
  // Extract data for SSR hero
  const pageTitle = document.h1_title || document.title
  const heroHtmlSubtitle = document.short_description || undefined
  const heroSubtitle = !document.short_description 
    ? `Ознакомьтесь с ${document.title.toLowerCase()} сервиса 911.`
    : undefined
  
  return (
    <PageLayout>
      {/* Hero Section - Server-rendered for optimal LCP */}
      <HeroSection
        id="document-detail-hero-section"
        title={pageTitle}
        subtitle={heroSubtitle}
        htmlSubtitle={heroHtmlSubtitle}
        breadcrumbs={[
          { label: 'Документы', href: '/documents' },
          { label: document.title }
        ]}
        containerSize="wide"
      >
        {/* Document metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-secondary)] mt-4">
          <span>Версия: {document.version}</span>
          <span>
            Обновлено: {new Date(document.updated_at).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </HeroSection>
      
      {/* Main Content - Server-rendered for optimal LCP */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Full description - Server-rendered */}
          {document.full_description && (
            <div className="prose prose-lg max-w-none">
              <RichText 
                content={document.full_description}
                variant="default"
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Client component for contacts */}
      <DocumentDetailContent 
        initialContacts={initialContacts}
      />
    </PageLayout>
  )
}

