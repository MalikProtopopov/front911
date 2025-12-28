'use client'

import { Clock, Shield, DollarSign, MapPin, Star, Headphones, Zap, CheckCircle } from "lucide-react"
import { useAdvantages } from "@/lib/api/hooks"
import { ErrorMessage } from "@/components/common/ErrorMessage"
import { Section, SectionHeader, FeatureCard } from "@/components/ui"

// Icon mapping for advantages
const advantageIcons: Record<string, React.ReactNode> = {
  'clock': <Clock />,
  'shield': <Shield />,
  'dollar': <DollarSign />,
  'clock24': <Clock />,
  'map': <MapPin />,
  'star': <Star />,
  'headphones': <Headphones />,
  'zap': <Zap />,
  'check': <CheckCircle />,
}

// Fallback advantages
const fallbackAdvantages = [
  {
    id: 1,
    icon_name: 'clock',
    title: "Быстрый отклик",
    description: "Мастер приедет за 15-30 минут в любое время суток",
  },
  {
    id: 2,
    icon_name: 'shield',
    title: "Проверенные мастера",
    description: "Все партнёры проходят проверку и имеют рейтинг",
  },
  {
    id: 3,
    icon_name: 'dollar',
    title: "Прозрачные цены",
    description: "Цена известна заранее и не изменится после заказа",
  },
  {
    id: 4,
    icon_name: 'clock24',
    title: "Работаем 24/7",
    description: "Поддержка и помощь в любое время дня и ночи",
  },
  {
    id: 5,
    icon_name: 'map',
    title: "82 города России",
    description: "Широкая география присутствия по всей стране",
  },
  {
    id: 6,
    icon_name: 'star',
    title: "Высокий рейтинг",
    description: "4.84/5 на основе реальных отзывов клиентов",
  },
]

function getAdvantageIcon(iconName: string | undefined): React.ReactNode {
  if (!iconName) return <CheckCircle />
  return advantageIcons[iconName] ?? <CheckCircle />
}

function AdvantageCardSkeleton() {
  return (
    <div className="flex flex-col items-start p-6 rounded-xl h-full">
      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4" />
      <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3" />
      <div className="space-y-2 w-full">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  )
}

export function Advantages() {
  const { advantages, isLoading, isError, mutate } = useAdvantages({ 
    targetAudience: 'client',
    limit: 6 
  })

  // Use API data if available, otherwise fallback
  const displayAdvantages = advantages.length > 0 
    ? advantages.slice(0, 6) 
    : fallbackAdvantages

  return (
    <Section id="advantages">
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Почему выбирают нас"
          subtitle="Надёжность и качество подтверждены тысячами довольных клиентов"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.6rem)] max-w-sm">
                <AdvantageCardSkeleton />
              </div>
            ))}
          </div>
        ) : isError ? (
          <>
            <ErrorMessage 
              title="Не удалось загрузить преимущества"
              showRetry
              onRetry={() => mutate()}
            />
            <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
              {fallbackAdvantages.map((advantage) => (
                <div key={advantage.id} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.6rem)] max-w-sm">
                  <FeatureCard
                    icon={getAdvantageIcon(advantage.icon_name)}
                    title={advantage.title}
                    description={advantage.description}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
            {displayAdvantages.map((advantage) => (
              <div key={advantage.id} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.6rem)] max-w-sm">
                <FeatureCard
                  icon={getAdvantageIcon('icon_name' in advantage ? advantage.icon_name : undefined)}
                  title={advantage.title}
                  description={advantage.description}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
