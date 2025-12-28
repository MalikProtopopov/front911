import { Breadcrumbs } from '@/components/ui'
import { PageLayout } from '@/components/layout'

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="pt-8 pb-16 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs 
            items={[{ label: 'Политика конфиденциальности' }]} 
          />
          <h1 className="text-5xl font-bold mb-6">Политика конфиденциальности</h1>
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
