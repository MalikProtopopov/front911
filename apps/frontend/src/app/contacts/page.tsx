import { Metadata } from 'next'
import Link from 'next/link'
import { IconCircle, PageHeader, Grid } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { generatePageMetadata } from '@/lib/api/hooks'
import { CONTACT_INFO, EXTERNAL_LINKS } from '@/lib/config/constants'
import { LeadForm } from '@/components/forms/LeadForm'

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/contacts/', {
    title: 'Контакты — 911 Автопомощь',
    description: `Свяжитесь с нами: ${CONTACT_INFO.PHONE}. Круглосуточная поддержка. Работаем в 82 городах России.`,
  })
}

const contactMethods = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Телефон',
    value: CONTACT_INFO.PHONE,
    href: `tel:${CONTACT_INFO.PHONE.replace(/\D/g, '')}`,
    description: 'Круглосуточная линия',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    value: CONTACT_INFO.EMAIL,
    href: `mailto:${CONTACT_INFO.EMAIL}`,
    description: 'Ответим в течение часа',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'WhatsApp',
    value: 'Написать в WhatsApp',
    href: `https://wa.me/${CONTACT_INFO.WHATSAPP}`,
    description: 'Быстрая связь',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Офис',
    value: CONTACT_INFO.ADDRESS,
    href: '#',
    description: 'Пн-Пт 9:00-18:00',
  },
]

const workingHours = [
  { day: 'Понедельник — Пятница', hours: '09:00 — 18:00' },
  { day: 'Суббота', hours: '10:00 — 16:00' },
  { day: 'Воскресенье', hours: 'Выходной' },
]

export default function ContactsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section id="contacts-hero-section" className="pt-20 md:pt-24 lg:pt-16 bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs 
            items={[{ label: 'Контакты' }]} 
          />
          <PageHeader
            id="contacts-heading"
            title="Контакты"
            subtitle="Свяжитесь с нами любым удобным способом. Мы работаем круглосуточно."
          />
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <Grid cols={4} gap="md" className="mb-12 md:mb-16">
            {contactMethods.map((contact, index) => (
              <a 
                key={index} 
                href={contact.href} 
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all h-full"
              >
                <IconCircle 
                  icon={contact.icon} 
                  variant="primary-soft" 
                  size="lg" 
                  className="mb-4"
                />
                <h3 className="font-semibold text-lg mb-2 !mt-0">{contact.title}</h3>
                <p className="text-[var(--color-primary)] font-medium mb-2 break-words">
                  {contact.value}
                </p>
                <p className="text-sm text-[var(--foreground-secondary)] mt-auto">
                  {contact.description}
                </p>
              </a>
            ))}
          </Grid>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-8">Напишите нам</h2>
              <LeadForm showCard={false} title="Обратная связь" />
            </div>

            {/* Sidebar */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Working Hours */}
              <div className="p-6 rounded-xl bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <IconCircle 
                    icon={<Clock className="w-6 h-6" />}
                    variant="primary-soft"
                    size="md"
                  />
                  <h3 className="font-semibold text-lg !mt-0 !mb-0">Часы работы офиса</h3>
                </div>
                <div className="space-y-3">
                  {workingHours.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-[var(--foreground-secondary)]">{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[var(--color-success)]/10 rounded-lg">
                  <p className="text-sm text-center">
                    <strong>Служба помощи</strong> работает <strong>24/7</strong>
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 rounded-xl bg-white">
                <h3 className="font-semibold text-lg mb-4 !mt-0">Мы в соцсетях</h3>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2"
                    asChild
                  >
                    <a href={EXTERNAL_LINKS.TELEGRAM} target="_blank" rel="noopener noreferrer">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      <span className="hidden sm:inline">Telegram</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2"
                    asChild
                  >
                    <a href={EXTERNAL_LINKS.VK} target="_blank" rel="noopener noreferrer">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.727-1.033-1.007-1.49-1.144-1.745-1.144-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.684 4 8.198c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.494 2.313 4.68 2.91 4.68.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.475-.085.72-.576.72z"/>
                      </svg>
                      <span className="hidden sm:inline">VK</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section-padding bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] cta-heading-margin">
              Нужна срочная помощь?
            </h2>
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl cta-description-margin">
              Служба автопомощи работает круглосуточно. Позвоните, и мастер приедет в течение 15-30 минут.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <a href="tel:+79991234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Позвонить
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
                <Link href="/services">Все услуги</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
