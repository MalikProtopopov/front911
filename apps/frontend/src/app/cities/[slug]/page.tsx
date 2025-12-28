import { Metadata } from 'next'
import { CityDetailContent } from './CityDetailContent'

interface CityDetailPageProps {
  params: Promise<{ slug: string }>
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Generate metadata - simplified to avoid server-side fetch issues
export async function generateMetadata({ params }: CityDetailPageProps): Promise<Metadata> {
  await params // Extract params but don't use slug for now
  
  // Simple metadata without API calls to avoid localhost issues
  return {
    title: `Автопомощь в городе — 911`,
    description: `Шиномонтаж, эвакуатор, доставка топлива. Быстрый выезд мастера 24/7.`,
  }
}

export default async function CityPage({ params }: CityDetailPageProps) {
  const { slug } = await params
  return <CityDetailContent slug={slug} />
}
