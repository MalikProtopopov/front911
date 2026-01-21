import { Metadata } from 'next'
import { generatePageSeo, prefetchSeoMeta } from "@/lib/api/hooks"
import { citiesService, contentService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import { CitiesList } from "./CitiesList"
import type { CityList, Contact, SeoMetaPublic } from "@/lib/api/generated"

// ISR: revalidate every minute for fresh data
export const revalidate = 60

// Generate metadata from SEO API
export async function generateMetadata(): Promise<Metadata> {
  const seo = await generatePageSeo('/cities/', {
    title: 'Города присутствия — 911 Автопомощь',
    description: 'Автопомощь в 82 городах России. Найдите услуги шиномонтажа, эвакуатора, доставки топлива в вашем городе.',
    h1Title: 'Города присутствия',
  })
  return seo.metadata
}

export default async function CitiesPage() {
  // Fetch cities, contacts and SEO on the server for SSR
  let initialCities: CityList[] = []
  let initialContacts: Contact[] = []
  let seoData: SeoMetaPublic | null = null
  
  try {
    [initialCities, initialContacts, seoData] = await Promise.all([
      citiesService.getAll({ limit: 1000, ordering: 'display_order,title' }),
      contentService.getContacts(),
      prefetchSeoMeta('/cities/'),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for cities page SSR', {
      page: '/cities',
    })
    // Continue with empty arrays - client will try to fetch
  }

  return (
    <>
      {/* JSON-LD Schema from SEO API */}
      {seoData?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema_json) }}
        />
      )}
      
      <CitiesList 
        initialCities={initialCities}
        initialContacts={initialContacts}
        seoTitle={seoData?.h1_title}
      />
    </>
  )
}
