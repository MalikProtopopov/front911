import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <PageLayout>
      <section className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          {/* 404 Number */}
          <div className="text-[120px] md:text-[180px] font-bold leading-none mb-4 text-[var(--color-primary)] [text-shadow:0_4px_30px_rgba(255,87,34,0.3)]">
            404
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
            Страница не найдена
          </h1>
          
          {/* Description */}
          <p className="text-lg text-[var(--foreground-secondary)] mb-8 max-w-md mx-auto">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="sm:w-auto w-full">
              <Link href="/">
                <Home className="w-5 h-5 flex-shrink-0" />
                <span className="leading-none">На главную</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="sm:w-auto w-full">
              <Link href="/services">
                <Search className="w-5 h-5 flex-shrink-0" />
                <span className="leading-none">Все услуги</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

