import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/api/hooks'
import { contentService } from '@/lib/api/services'
import { logServerError } from '@/lib/utils/serverLogger'
import { PartnersContent } from './PartnersContent'
import type { AppLink, Contact } from '@/lib/api/generated'

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/partners/', {
    title: 'Стать партнёром — 911 Автопомощь',
    description: 'Присоединяйтесь к сети партнёров 911. Стабильный поток заказов, удобный личный кабинет, своевременные выплаты.',
  })
}

export default async function PartnersPage() {
  // Fetch data on the server for SSR
  let initialAppLinks: AppLink[] = []
  let initialContacts: Contact[] = []
  
  try {
    [initialAppLinks, initialContacts] = await Promise.all([
      contentService.getAppLinks(),
      contentService.getContacts(),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for partners page SSR', {
      page: '/partners',
    })
    // Continue with empty arrays - client will try to fetch
  }

  return (
    <PartnersContent 
      initialAppLinks={initialAppLinks}
      initialContacts={initialContacts}
    />
  )
}
