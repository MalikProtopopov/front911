import { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { generatePageMetadata } from "@/lib/api/hooks"
import { servicesService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import { ServicesList } from "./ServicesList"
import { PageCTA, HeroSection } from '@/components/patterns'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/services/', {
    title: 'Услуги — 911 Автопомощь',
    description: 'Полный спектр автопомощи: шиномонтаж, эвакуатор, доставка топлива, техпомощь. Работаем 24/7 в 82 городах России.',
  })
}

export default async function ServicesPage() {
  // Fetch services on the server for SSR
  let initialServices = []
  
  try {
    initialServices = await servicesService.getAll()
  } catch (error) {
    logServerError(error, 'Failed to fetch services for SSR', {
      page: '/services',
    })
    // Continue with empty array - client will try to fetch
  }

  return (
    <PageLayout>
      {/* Hero */}
      <HeroSection
        id="services-hero-section"
        title="Наши услуги"
        subtitle="Полный спектр автопомощи для любых ситуаций на дороге. Быстро, надёжно, круглосуточно."
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
      />
    </PageLayout>
  )
}
