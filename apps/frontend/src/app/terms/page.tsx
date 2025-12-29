import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui'
import { PageLayout } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Пользовательское соглашение — 911',
  description: 'Условия использования сервиса 911 Автопомощь.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <PageLayout>
      <section className="pt-8 pb-16 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs 
            items={[{ label: 'Пользовательское соглашение' }]} 
          />
          <h1 className="text-5xl font-bold mb-6">Пользовательское соглашение</h1>
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
  )
}
