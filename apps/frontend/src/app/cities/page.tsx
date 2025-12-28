import { Metadata } from 'next'
import { generatePageMetadata } from "@/lib/api/hooks"
import { CitiesList } from "./CitiesList"

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/cities/', {
    title: 'Города присутствия — 911 Автопомощь',
    description: 'Автопомощь в 82 городах России. Найдите услуги шиномонтажа, эвакуатора, доставки топлива в вашем городе.',
  })
}

export default function CitiesPage() {
  return <CitiesList />
}
