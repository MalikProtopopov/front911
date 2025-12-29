import { NumberedCircle, SectionHeader, Section, Grid } from "@/components/ui"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    title: "Откройте приложение",
    description: "Скачайте и запустите приложение 911 на своём смартфоне",
  },
  {
    number: 2,
    title: "Выберите услугу",
    description: "Укажите необходимую услугу и ваше местоположение",
  },
  {
    number: 3,
    title: "Мастер приедет",
    description: "Ближайший специалист приедет за 15-30 минут",
  },
  {
    number: 4,
    title: "Оплатите",
    description: "Оплатите онлайн или картой/наличными на месте",
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works" bg="white" spacing="lg">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Как заказать помощь"
          subtitle="Получить автопомощь стало проще простого"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        <Grid cols={4} gap="lg">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "flex flex-col items-center text-center p-6 rounded-xl",
                "group h-full"
              )}
            >
              <NumberedCircle 
                number={step.number} 
                variant="primary" 
                size="xl" 
                shadow="md"
                className="mb-8"
              />
              <h3 className="text-xl font-semibold mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </Grid>
      </div>
    </Section>
  )
}

