import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'
import { generatePageSeo, prefetchSeoMeta } from '@/lib/api/hooks'
import { logServerError } from '@/lib/utils/serverLogger'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/privacy/', {
    title: 'Политика конфиденциальности — 911',
    description: 'Политика конфиденциальности сервиса 911 Автопомощь.',
    h1Title: 'Политика конфиденциальности',
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

export default async function PrivacyPage() {
  // Fetch SEO data for h1_title and schema_json
  let seoData = null
  try {
    seoData = await prefetchSeoMeta('/privacy/')
  } catch (error) {
    logServerError(error, 'Failed to fetch SEO for privacy page SSR', { page: '/privacy' })
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'Политика конфиденциальности'

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
          id="privacy-hero-section"
          title={pageTitle}
          breadcrumbs={[{ label: 'Политика конфиденциальности' }]}
          containerSize="narrow"
        />

        {/* Content */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg">
              <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
              <h2>1. Сбор информации</h2>
              <p>
                Мы собираем минимальную информацию, необходимую для предоставления услуг: 
                имя, телефон, геолокацию.
              </p>
              <h2>2. Использование данных</h2>
              <p>
                Ваши данные используются только для оказания услуг и не передаются третьим лицам.
              </p>
              <h2>3. Защита данных</h2>
              <p>
                Мы используем современные методы шифрования для защиты ваших данных.
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  )
}
