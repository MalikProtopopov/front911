import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { YandexMetrika } from "@/lib/analytics";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";
import {
  servicesService,
  contentService,
  documentsService,
  citiesService,
} from "@/lib/api/services";
import { logServerError } from "@/lib/utils/serverLogger";
import type { ServiceList, Contact, CityList } from "@/lib/api/generated";
import type { DocumentListItem } from "@/lib/api/services";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://911.ru";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "911 — Экстренная автопомощь за 15 минут",
    template: "%s | 911",
  },
  description:
    "Шиномонтаж, эвакуатор, доставка топлива — проверенные мастера приедут к вам. 82 города России. Работаем 24/7.",
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch services, contacts and documents on the server for Header/Footer
  let initialServices: ServiceList[] = [];
  let initialContacts: Contact[] = [];
  let initialDocuments: DocumentListItem[] = [];
  let initialCities: CityList[] = [];

  try {
    [initialServices, initialContacts, initialCities, initialDocuments] =
      await Promise.all([
        servicesService.getAll(),
        contentService.getContacts(),
        citiesService.getAll(),
        documentsService.getAll({ ordering: "-updated_at" }),
      ]);
  } catch (error) {
    logServerError(error, "Failed to fetch data for layout SSR", {
      page: "layout",
    });
    // Continue with empty arrays - client will try to fetch
  }

  // API base URL for preconnect
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://45.144.221.92";
  const apiOrigin = new URL(apiUrl).origin;

  return (
    <html lang="ru">
      <head>
        {/* Preconnect to critical origins for faster resource loading */}
        <link rel="preconnect" href={apiOrigin} />
        <link rel="dns-prefetch" href={apiOrigin} />

        {/* JSON-LD Structured Data */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <YandexMetrika />
        <Header
          initialServices={initialServices}
          initialContacts={initialContacts}
        />
        <main>{children}</main>
        <Footer
          count={initialCities?.length}
          initialServices={initialServices}
          initialContacts={initialContacts}
          initialDocuments={initialDocuments}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
        (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106704668', 'ym');

        ym(106704668, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "bg-white border border-[var(--border)] shadow-lg rounded-xl",
              title: "text-[var(--foreground)] font-semibold",
              description: "text-[var(--foreground-secondary)]",
              success:
                "border-[var(--color-success)] bg-[var(--color-success)]/5",
              error: "border-red-500 bg-red-50",
            },
            duration: 4000,
          }}
          closeButton
        />
      </body>
    </html>
  );
}
