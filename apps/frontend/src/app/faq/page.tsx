import { 
  Accordion, 
  AccordionItemCard, 
  AccordionTriggerCard, 
  AccordionContentCard 
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui'
import { PageLayout } from '@/components/layout'
import { HeroSection } from '@/components/patterns'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "Как заказать услугу?",
    answer: "Скачайте приложение 911, выберите нужную услугу, укажите местоположение и мастер приедет к вам. Весь процесс занимает не более 2 минут.",
  },
  {
    question: "Сколько стоят услуги?",
    answer: "Цены зависят от города и типа автомобиля. Точную стоимость вы увидите в приложении перед заказом — никаких скрытых платежей.",
  },
  {
    question: "Как быстро приедет мастер?",
    answer: "В среднем 15-30 минут. Время зависит от загруженности и вашего местоположения. В приложении вы сможете отслеживать мастера на карте.",
  },
  {
    question: "Какие способы оплаты?",
    answer: "Оплата картой онлайн в приложении, картой или наличными на месте. Чек придёт вам на email после оплаты.",
  },
  {
    question: "Можно ли отменить заказ?",
    answer: "Да, вы можете отменить заказ бесплатно до выезда мастера. После выезда может взиматься небольшая плата за вызов.",
  },
  {
    question: "Работаете ли вы в праздники и выходные?",
    answer: "Да, мы работаем 24/7, включая праздничные и выходные дни. Наши мастера всегда готовы помочь.",
  },
  {
    question: "Есть ли гарантия на работу?",
    answer: "Да, на все виды работ предоставляется гарантия. Срок гарантии зависит от типа услуги и указывается в чеке.",
  },
]

export default function FAQPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <HeroSection
        id="faq-hero-section"
        title="Частые вопросы"
        subtitle="Ответы на популярные вопросы о нашем сервисе"
        breadcrumbs={[{ label: 'Частые вопросы' }]}
        centered
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Заголовок с badge */}
          <div className="flex items-baseline gap-3 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)]">
              Популярные вопросы
            </h2>
            <Badge 
              variant="secondary" 
              size="sm" 
              className="bg-slate-100 text-slate-600"
            >
              {faqs.length} вопросов
            </Badge>
          </div>

          {/* Аккордеон-карточки */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItemCard key={index} value={`item-${index}`}>
                <AccordionTriggerCard icon={<HelpCircle className="w-5 h-5" />}>
                  {faq.question}
                </AccordionTriggerCard>
                <AccordionContentCard>
                  {faq.answer}
                </AccordionContentCard>
              </AccordionItemCard>
            ))}
          </Accordion>
        </div>
      </section>
    </PageLayout>
  )
}
