import { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'
import { generatePageSeo, prefetchSeoMeta } from '@/lib/api/hooks'
import { logServerError } from '@/lib/utils/serverLogger'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/about/', {
    title: 'О компании — 911 Автопомощь',
    description: 'Современная платформа экстренной автопомощи в 82 городах России. Объединяем водителей и проверенных специалистов.',
    h1Title: 'О компании 911',
  })
  return seo.metadata
}

export default async function AboutPage() {
  // Fetch SEO data for h1_title and schema_json
  let seoData = null
  try {
    seoData = await prefetchSeoMeta('/about/')
  } catch (error) {
    logServerError(error, 'Failed to fetch SEO for about page SSR', { page: '/about' })
  }

  // Get h1_title from SEO API or use default
  const pageTitle = seoData?.h1_title || 'О компании 911'
  const pageSubtitle = 'Современная платформа экстренной автопомощи в 82 городах России'

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
          id="about-hero-section"
          title={pageTitle}
          subtitle={pageSubtitle}
          breadcrumbs={[{ label: 'О компании' }]}
        />

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg">
              <p>
                911 — это современная платформа экстренной автопомощи, которая объединяет водителей 
                и проверенных специалистов в 82 городах России.
              </p>
              <p>
                Мы делаем автопомощь простой, быстрой и доступной для каждого водителя.
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  )
}
