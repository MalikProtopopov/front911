import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — 911',
  description: 'Политика конфиденциальности сервиса 911 Автопомощь.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <HeroSection
        id="privacy-hero-section"
        title="Политика конфиденциальности"
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
  )
}
