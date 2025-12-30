import { Metadata } from 'next'
import { generatePageMetadata } from "@/lib/api/hooks"
import { citiesService, contentService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import { CitiesList } from "./CitiesList"
import type { CityList, Contact } from "@/lib/api/generated"

// ISR: revalidate every hour
export const revalidate = 3600

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/cities/', {
    title: 'Города присутствия — 911 Автопомощь',
    description: 'Автопомощь в 82 городах России. Найдите услуги шиномонтажа, эвакуатора, доставки топлива в вашем городе.',
  })
}

export default async function CitiesPage() {
  // Fetch cities and contacts on the server for SSR
  let initialCities: CityList[] = []
  let initialContacts: Contact[] = []
  
  try {
    [initialCities, initialContacts] = await Promise.all([
      citiesService.getAll({ limit: 1000, ordering: 'display_order,title' }),
      contentService.getContacts(),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for cities page SSR', {
      page: '/cities',
    })
    // Continue with empty arrays - client will try to fetch
  }

  return (
    <CitiesList 
      initialCities={initialCities}
      initialContacts={initialContacts}
    />
  )
}
