import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { YandexMetrika } from "@/lib/analytics"

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

export const metadata: Metadata = {
  title: "911 — Экстренная автопомощь за 15 минут",
  description: "Шиномонтаж, эвакуатор, доставка топлива — проверенные мастера приедут к вам. 82 города России. Работаем 24/7.",
  keywords: ["автопомощь", "шиномонтаж", "эвакуатор", "техпомощь", "911"],
  authors: [{ name: "911" }],
  openGraph: {
    title: "911 — Экстренная автопомощь за 15 минут",
    description: "Проверенные мастера в 82 городах России. Работаем 24/7.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <YandexMetrika />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
