import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'
import { generatePageSeo, prefetchSeoMeta } from '@/lib/api/hooks'
import { logServerError } from '@/lib/utils/serverLogger'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/terms/', {
    title: 'Пользовательское соглашение — 911',
    description: 'Условия использования сервиса 911 Автопомощь.',
    h1Title: 'Пользовательское соглашение',
  })
  // Merge with robots settings
  return {
    ...seo.metadata,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function TermsPage() {
  // Fetch SEO data for h1_title and schema_json
  let seoData = null
  try {
    seoData = await prefetchSeoMeta('/terms/')
  } catch (error) {
    logServerError(error, 'Failed to fetch SEO for terms page SSR', { page: '/terms' })
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'Пользовательское соглашение'

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
        {/* Hero Section */}
        <HeroSection
          id="terms-hero-section"
          title={pageTitle}
          breadcrumbs={[{ label: 'Пользовательское соглашение' }]}
          containerSize="narrow"
        />

        {/* Content */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg">
              <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
              <h2>1. Общие положения</h2>
              <p>
                Используя наш сервис, вы соглашаетесь с условиями данного пользовательского соглашения.
              </p>
              <h2>2. Услуги</h2>
              <p>
                Мы предоставляем платформу для связи между клиентами и исполнителями автоуслуг.
              </p>
              <h2>3. Ответственность</h2>
              <p>
                Мы не несём ответственности за качество услуг, оказываемых партнёрами.
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  )
}
