import { Metadata } from 'next'
import { CityServiceContent } from './CityServiceContent'

interface CityServicePageProps {
  params: Promise<{ slug: string; serviceSlug: string }>
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Generate metadata
export async function generateMetadata({ params }: CityServicePageProps): Promise<Metadata> {
  await params // Await params but don't use values for now
  
  return {
    title: `Услуга в городе — 911 Автопомощь`,
    description: `Закажите услугу в вашем городе. Быстрый выезд мастера 24/7. Прозрачные цены.`,
  }
}

export default async function CityServicePage({ params }: CityServicePageProps) {
  const { slug, serviceSlug } = await params
  return <CityServiceContent citySlug={slug} serviceSlug={serviceSlug} />
}
