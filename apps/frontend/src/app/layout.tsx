import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { YandexMetrika } from "@/lib/analytics"
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo"
import { servicesService, contentService } from "@/lib/api/services"
import { logServerError } from "@/lib/utils/serverLogger"
import type { ServiceList, Contact } from "@/lib/api/generated"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || 'https://911.ru'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "911 — Экстренная автопомощь за 15 минут",
    template: "%s | 911",
  },
  description: "Шиномонтаж, эвакуатор, доставка топлива — проверенные мастера приедут к вам. 82 города России. Работаем 24/7.",
  keywords: ["автопомощь", "шиномонтаж", "эвакуатор", "техпомощь", "911"],
  authors: [{ name: "911" }],
  openGraph: {
    title: "911 — Экстренная автопомощь за 15 минут",
    description: "Проверенные мастера в 82 городах России. Работаем 24/7.",
    type: "website",
    siteName: "911 Автопомощь",
    locale: "ru_RU",
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch services and contacts on the server for Header/Footer
  let initialServices: ServiceList[] = []
  let initialContacts: Contact[] = []
  
  try {
    [initialServices, initialContacts] = await Promise.all([
      servicesService.getAll(),
      contentService.getContacts(),
    ])
  } catch (error) {
    logServerError(error, 'Failed to fetch data for layout SSR', {
      page: 'layout',
    })
    // Continue with empty arrays - client will try to fetch
  }

  return (
    <html lang="ru">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <YandexMetrika />
        <Header initialServices={initialServices} initialContacts={initialContacts} />
        <main>{children}</main>
        <Footer initialServices={initialServices} initialContacts={initialContacts} />
      </body>
    </html>
  )
}
