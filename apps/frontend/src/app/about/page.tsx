import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <HeroSection
        id="about-hero-section"
        title="О компании 911"
        subtitle="Современная платформа экстренной автопомощи в 82 городах России"
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
  )
}
