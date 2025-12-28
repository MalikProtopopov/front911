'use client'

import Link from "next/link"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { useServices } from "@/lib/api/hooks"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { services } = useServices()

  // Company links - only existing pages
  const companyLinks = [
    { label: "Для партнёров", href: "/partners" },
    { label: "Контакты", href: "/contacts" },
  ]

  // Help links - only existing pages
  const helpLinks = [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Пользовательское соглашение", href: "/terms" },
  ]

  return (
    <footer className="bg-[var(--background-dark)] text-[var(--foreground-inverse)] section-spacing">
      <div className="container mx-auto">
        {/* 4 Column Grid aligned to base grid system */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 section-gap-xl">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-bold leading-none" style={{ color: "var(--color-primary)" }}>
                911
              </div>
              <span className="text-lg leading-none">Автопомощь</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Экстренная автопомощь за 15 минут. Проверенные мастера в 82 городах России.
            </p>
            {/* Contacts with consistent spacing */}
            <div className="space-y-3">
              <a
                href="tel:+79991234567"
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+7 (999) 123-45-67</span>
              </a>
              <a
                href="mailto:support@911.ru"
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@911.ru</span>
              </a>
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Services from API */}
          <div>
            <h3 className="text-lg font-semibold mb-4 leading-tight">Услуги</h3>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors inline-block"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-block font-medium"
                >
                  Все услуги →
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4 leading-tight">География</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cities"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors inline-block font-medium"
                >
                  Все города →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4 leading-tight">Компания</h3>
            <ul className="space-y-3 mb-6">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-4 leading-tight">Помощь</h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} 911. Все права защищены.
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
                aria-label="VK"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.711 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.773 13.95l-2.95-.922c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.954z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
