"use client"

import * as React from "react"
import { SectionHeader } from "@/components/ui"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  city: string
  service: string
  rating: number
  text: string
  date: string
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Иван И.",
    city: "Москва",
    service: "Выездной шиномонтаж",
    rating: 5,
    text: "Быстро приехали, быстро сделали. Цена как в приложении, никаких доплат. Рекомендую!",
    date: "2 дня назад",
  },
  {
    id: 2,
    name: "Мария С.",
    city: "Санкт-Петербург",
    service: "Доставка топлива",
    rating: 5,
    text: "Закончился бензин на трассе. Приложение спасло! Топливо привезли за 20 минут.",
    date: "неделю назад",
  },
  {
    id: 3,
    name: "Алексей П.",
    city: "Екатеринбург",
    service: "Эвакуатор",
    rating: 5,
    text: "Машина сломалась ночью. Эвакуатор приехал через 25 минут, водитель помог погрузить.",
    date: "3 недели назад",
  },
  {
    id: 4,
    name: "Ольга К.",
    city: "Казань",
    service: "Выездной шиномонтаж",
    rating: 5,
    text: "Очень удобное приложение! Мастер приехал вовремя, работу выполнил качественно.",
    date: "месяц назад",
  },
  {
    id: 5,
    name: "Дмитрий В.",
    city: "Новосибирск",
    service: "Техпомощь на дороге",
    rating: 4,
    text: "Хороший сервис, приехали быстро. Единственное, цена чуть выше, чем ожидал.",
    date: "2 месяца назад",
  },
]

export function Reviews() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="section-spacing-lg bg-[var(--background-secondary)]" id="reviews">
      <div className="container mx-auto px-4 flex flex-col gap-4 md:gap-6 lg:gap-8">
        <SectionHeader
          title="Отзывы клиентов"
          subtitle="Что говорят о нас водители"
          align="center"
          className="gap-1 md:gap-2 lg:gap-3"
        />

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-full px-4 md:px-0"
              >
                <figure 
                  className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col gap-4 review-card"
                >
                  {/* Row 1: Rating */}
                  <div className="flex items-center gap-[2px] h-6" aria-label={`Рейтинг ${review.rating} из 5`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Row 2: Review Text */}
                  <blockquote className="text-base leading-relaxed text-[var(--foreground-secondary)] line-clamp-3">
                    {review.text}
                  </blockquote>

                  {/* Row 3: Author */}
                  <figcaption className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium text-base flex-shrink-0">
                      {getInitials(review.name)}
                    </div>
                    <div className="text-lg font-medium text-[var(--color-secondary)]">
                      {review.name}
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-16 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[var(--color-primary)]"
                    : "w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

