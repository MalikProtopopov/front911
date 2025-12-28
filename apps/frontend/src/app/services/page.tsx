import { Metadata } from 'next'
import Link from "next/link"
import { Button, Breadcrumbs, PageHeader } from "@/components/ui"
import { PageLayout } from '@/components/layout'
import { generatePageMetadata } from "@/lib/api/hooks"
import { ServicesList } from "./ServicesList"
import { Phone } from 'lucide-react'

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/services/', {
    title: 'Услуги — 911 Автопомощь',
    description: 'Полный спектр автопомощи: шиномонтаж, эвакуатор, доставка топлива, техпомощь. Работаем 24/7 в 82 городах России.',
  })
}

export default function ServicesPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section id="services-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[{ label: 'Услуги' }]} 
          />
          <PageHeader
            id="services-heading"
            title="Наши услуги"
            subtitle="Полный спектр автопомощи для любых ситуаций на дороге. Быстро, надёжно, круглосуточно."
          />
        </div>
      </section>

      {/* Services List - Client Component */}
      <ServicesList />

      {/* CTA */}
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Не нашли нужную услугу?
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Свяжитесь с нами, и мы поможем решить вашу проблему
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <a href="tel:+79991234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Позвонить
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <Link href="/contacts">Контакты</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
