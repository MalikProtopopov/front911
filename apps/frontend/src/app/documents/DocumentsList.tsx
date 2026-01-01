'use client'

import Link from 'next/link'
import { documentsService, type DocumentListItem } from '@/lib/api/services'
import useSWR from 'swr'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { RichText } from '@/components/patterns'
import { Card, CardContent } from '@/components/ui'

interface DocumentsListProps {
  initialDocuments?: DocumentListItem[]
}

// Format date for display
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function DocumentsList({ initialDocuments = [] }: DocumentsListProps) {
  // Use SWR with server-provided initial data for hydration
  const { data: documents, isLoading, error } = useSWR<DocumentListItem[]>(
    'documents',
    () => documentsService.getAll({ ordering: '-updated_at' }),
    {
      fallbackData: initialDocuments,
      revalidateOnFocus: false,
      revalidateOnMount: false, // Don't revalidate on mount - use SSR data
      keepPreviousData: true, // Keep previous data on error
      onError: (err) => {
        // Log error but don't show it if we have fallback data
        console.error('[DocumentsList] Failed to fetch documents:', err)
      },
    }
  )

  // If we have initial data, don't show loading state on first render
  const showLoading = isLoading && initialDocuments.length === 0

  if (showLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Only show error if we don't have fallback data
  if (error && (!documents || documents.length === 0)) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <ErrorMessage message="Не удалось загрузить документы" />
      </div>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12 bg-[var(--background-secondary)] rounded-xl">
            <p className="text-[var(--foreground-secondary)]">
              Документы пока не добавлены.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-6 md:gap-8">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.slug}`}
              className="block group overflow-hidden"
            >
              <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 overflow-hidden">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h2 
                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[var(--foreground-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors break-words hyphens-auto"
                        lang="ru"
                      >
                        {doc.title}
                      </h2>
                      {doc.short_description && (
                        <div className="text-[var(--foreground-secondary)] mb-4">
                          <RichText 
                            content={doc.short_description}
                            variant="default"
                            className="prose-sm"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-tertiary)]">
                        <span>Версия: {doc.version}</span>
                        <span>Обновлено: {formatDate(doc.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

