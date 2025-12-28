import { Metadata } from 'next'
import Link from 'next/link'
import { IconCircle, NumberedCircle, SectionHeader, Grid } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { Briefcase, Users, TrendingUp, DollarSign, CheckCircle, Phone } from 'lucide-react'
import { generatePageMetadata } from '@/lib/api/hooks'
import { PartnerCTASection } from '@/components/sections/PartnerCTASection'

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/partners/', {
    title: 'Стать партнёром — 911 Автопомощь',
    description: 'Присоединяйтесь к сети партнёров 911. Стабильный поток заказов, удобный личный кабинет, своевременные выплаты.',
  })
}

const benefits = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Стабильный поток заказов',
    description: 'Ежедневно обрабатываем более 1000 заявок по всей России',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Прозрачные выплаты',
    description: 'Еженедельные выплаты без задержек на карту любого банка',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Поддержка 24/7',
    description: 'Персональный менеджер и техподдержка круглосуточно',
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Удобный личный кабинет',
    description: 'Управляйте заказами, графиком и финансами в одном месте',
  },
]

const requirements = [
  'Опыт работы от 1 года',
  'Собственный инструмент и оборудование',
  'Транспортное средство',
  'Готовность работать по стандартам качества 911',
]

const steps = [
  { step: 1, title: 'Оставьте заявку', description: 'Заполните форму на сайте' },
  { step: 2, title: 'Пройдите собеседование', description: 'Знакомство с командой' },
  { step: 3, title: 'Подпишите договор', description: 'Официальное оформление' },
  { step: 4, title: 'Начните работу', description: 'Получайте заказы' },
]

export default function PartnersPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section id="partners-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[{ label: 'Партнёрам' }]} 
          />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 id="partners-heading" className="text-5xl md:text-6xl font-bold" style={{ scrollMarginTop: '120px' }}>
                Станьте партнёром 911
              </h1>
              <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed">
                Присоединяйтесь к крупнейшей сети автопомощи в России. 
                Получайте стабильный поток заказов и зарабатывайте больше.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <a href="#partner-download">Скачать приложение</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+79991234567">Позвонить</a>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-7xl font-bold mb-4">82+</div>
                  <div className="text-xl opacity-90">городов присутствия</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            <SectionHeader
              title="Преимущества работы с нами"
              className="gap-1 md:gap-2 lg:gap-3"
            />
            
            <Grid cols={4} gap="md" className="justify-items-center">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-white max-w-sm w-full">
                  <IconCircle 
                    icon={benefit.icon} 
                    variant="primary-soft" 
                    size="xl" 
                    className="mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-[var(--foreground-secondary)]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </Grid>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-spacing-lg bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Требования к партнёрам</h2>
              <ul className="space-y-6">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Как стать партнёром</h2>
              <div className="space-y-8">
                {steps.map(({ step, title, description }) => (
                  <div key={step} className="flex items-start gap-5 py-4 my-4">
                    <NumberedCircle number={step} variant="primary" size="md" />
                    <div>
                      <h3 className="font-semibold text-lg !mt-0 !mb-2">{title}</h3>
                      <p className="text-[var(--foreground-secondary)]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner App Download */}
      <PartnerCTASection />

      {/* CTA */}
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Остались вопросы?
            </h2>
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Свяжитесь с нами, и мы расскажем подробнее о сотрудничестве
            </p>
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
