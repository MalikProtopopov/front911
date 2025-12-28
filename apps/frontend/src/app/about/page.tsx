import { Breadcrumbs, PageHeader } from '@/components/ui'
import { PageLayout } from '@/components/layout'

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section id="about-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[{ label: 'О компании' }]} 
          />
          <PageHeader
            id="about-heading"
            title="О компании 911"
            subtitle="Современная платформа экстренной автопомощи в 82 городах России"
          />
        </div>
      </section>

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
  )
}
