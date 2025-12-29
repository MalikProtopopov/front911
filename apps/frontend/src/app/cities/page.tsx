import { Metadata } from 'next'
import { generatePageMetadata } from "@/lib/api/hooks"
import { citiesService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import { CitiesList } from "./CitiesList"
import type { CityList } from "@/lib/api/generated"

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
  // Fetch cities on the server for SSR
  let initialCities: CityList[] = []
  
  try {
    initialCities = await citiesService.getAll({ limit: 1000, ordering: 'display_order,title' })
  } catch (error) {
    logServerError(error, 'Failed to fetch cities for SSR', {
      page: '/cities',
    })
    // Continue with empty array - client will try to fetch
  }

  return <CitiesList initialCities={initialCities} />
}
