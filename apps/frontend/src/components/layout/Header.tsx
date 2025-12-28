"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Download, ChevronDown, ChevronRight, Wrench, Fuel, Truck, Construction, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useServices } from "@/lib/api/hooks"

// Icon mapping for services (consistent stroke-width 2)
const serviceIcons: Record<string, React.ElementType> = {
  'shinomontazh': Wrench,
  'fuel-delivery': Fuel,
  'zapravka-toplivom': Fuel,
  'evacuator': Truck,
  'evakuator': Truck,
  'auto-lift': Construction,
  'avtovyshka': Construction,
}

// Max items to show in dropdown
const MAX_DROPDOWN_ITEMS = 8

// Hover delay to prevent flickering (ms)
const HOVER_OPEN_DELAY = 80
const HOVER_CLOSE_DELAY = 200

interface NavItem {
  label: string
  href: string
  hasDropdown?: boolean
}

const navItems: NavItem[] = [
  { label: "Услуги", href: "/services", hasDropdown: true },
  { label: "Города", href: "/cities" },
  { label: "Для партнёров", href: "/partners" },
  { label: "Контакты", href: "/contacts" },
]

// Skeleton component for loading state
function DropdownSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 h-[52px] pl-4 pr-5 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isServicesOpen, setIsServicesOpen] = React.useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = React.useState(false)
  
  // Refs for hover delay
  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  
  // Fetch services from API with caching (SWR caches by default)
  const { services, isLoading, isError, mutate } = useServices()

  // Process services: sort by title, limit to MAX_DROPDOWN_ITEMS
  const processedServices = React.useMemo(() => {
    if (!services || services.length === 0) return []
    
    return [...services]
      .sort((a, b) => a.title.localeCompare(b.title, 'ru'))
      .slice(0, MAX_DROPDOWN_ITEMS)
  }, [services])

  // Check if current page is a service page
  const isServiceActive = (slug: string) => pathname === `/services/${slug}`

  // Scroll handler
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsServicesOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false)
      }
    }
    if (isServicesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isServicesOpen])

  // Cleanup timeouts
  React.useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Hover handlers with delay
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    openTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(true)
    }, HOVER_OPEN_DELAY)
  }

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false)
    }, HOVER_CLOSE_DELAY)
  }

  // Get icon for service
  const getServiceIcon = (slug: string) => serviceIcons[slug] || Wrench

  // Retry handler
  const handleRetry = () => mutate()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="text-3xl font-bold leading-none" style={{ color: "var(--color-primary)" }}>
              911
            </div>
            <span className="hidden sm:block text-sm font-medium leading-none" style={{ color: "var(--color-secondary)" }}>
              Автопомощь
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                ref={item.hasDropdown ? dropdownRef : undefined}
                onMouseEnter={item.hasDropdown ? handleMouseEnter : undefined}
                onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
              >
                {/* Nav Link with open state */}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 text-base font-medium transition-all duration-150 leading-none py-2 px-3 -mx-3 rounded-lg",
                    item.hasDropdown && isServicesOpen 
                      ? "text-[var(--color-primary)] bg-slate-50" 
                      : "hover:text-[var(--color-primary)]"
                  )}
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      e.preventDefault()
                      setIsServicesOpen(!isServicesOpen)
                    }
                  }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform duration-200 ease-out",
                        isServicesOpen && "rotate-180"
                      )} 
                    />
                  )}
                </Link>
                
                {/* Services Dropdown */}
                {item.hasDropdown && (
                  <div 
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ease-out",
                      isServicesOpen 
                        ? "opacity-100 visible translate-y-0" 
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    )}
                  >
                    {/* Dropdown Container */}
                    <div className="services-dropdown-menu bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/70 overflow-hidden min-w-[300px]">
                      
                      {/* Services List */}
                      <div className="px-3 py-2 max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                          <DropdownSkeleton />
                        ) : isError ? (
                          <div className="py-8 px-4 text-center">
                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-[var(--foreground-secondary)] mb-4">
                              Не удалось загрузить
                            </p>
                            <Button variant="outline" size="sm" onClick={handleRetry}>
                              Повторить
                            </Button>
                          </div>
                        ) : processedServices.length > 0 ? (
                          <div className="space-y-0.5">
                            {processedServices.map((service) => {
                              const Icon = getServiceIcon(service.slug)
                              const isActive = isServiceActive(service.slug)
                              return (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.slug}`}
                                  className={cn(
                                    "flex items-center gap-4 h-[52px] pl-4 pr-5 rounded-lg transition-all duration-150 group/item",
                                    isActive 
                                      ? "bg-[var(--color-primary)]/5 border-l-2 border-[var(--color-primary)]"
                                      : "hover:bg-slate-50"
                                  )}
                                  onClick={() => setIsServicesOpen(false)}
                                >
                                  {/* Icon Container - 40px */}
                                  <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                                    isActive 
                                      ? "bg-[var(--color-primary)] text-white"
                                      : "bg-slate-100 text-slate-500 group-hover/item:bg-[var(--color-primary)]/10 group-hover/item:text-[var(--color-primary)]"
                                  )}>
                                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                                  </div>
                                  
                                  {/* Text */}
                                  <span className={cn(
                                    "text-[15px] font-medium transition-colors duration-150",
                                    isActive 
                                      ? "text-[var(--color-primary)]"
                                      : "text-[var(--foreground)] group-hover/item:text-[var(--color-primary)]"
                                  )}>
                                    {service.title}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="py-8 px-4 text-center">
                            <p className="text-sm text-[var(--foreground-secondary)]">
                              Услуги скоро появятся
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Footer - All Services Link */}
                      {!isLoading && !isError && processedServices.length > 0 && (
                        <div className="border-t border-slate-100 mx-3 pt-2 pb-2">
                          <Link 
                            href="/services" 
                            className="flex items-center justify-between h-[44px] px-4 rounded-lg text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] hover:bg-slate-50 transition-colors duration-150"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <span>Все услуги</span>
                            <ChevronRight className="w-4 h-4" strokeWidth={2} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+79991234567">
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link href="#download">
                <Download className="w-4 h-4" />
                Скачать
              </Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="icon" asChild className="h-10 w-10">
              <a href="tel:+79991234567">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-10 w-10">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border)]">
            <nav className="py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className="flex items-center justify-between w-full py-3 px-1 text-base font-medium hover:text-[var(--color-primary)] transition-colors"
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          "w-5 h-5 transition-transform duration-200",
                          isMobileServicesOpen && "rotate-180"
                        )} />
                      </button>
                      {isMobileServicesOpen && (
                        <div className="space-y-1 pb-2">
                          {isLoading ? (
                            <div className="flex items-center gap-2 py-3 px-4 text-sm text-[var(--foreground-secondary)]">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Загрузка...
                            </div>
                          ) : isError ? (
                            <div className="py-3 px-4">
                              <p className="text-sm text-red-500 mb-2">Ошибка загрузки</p>
                              <Button variant="outline" size="sm" onClick={handleRetry}>Повторить</Button>
                            </div>
                          ) : processedServices.length > 0 ? (
                            processedServices.map((service) => {
                              const Icon = getServiceIcon(service.slug)
                              const isActive = isServiceActive(service.slug)
                              return (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.slug}`}
                                  className={cn(
                                    "flex items-center gap-3 py-3 px-4 rounded-xl transition-colors",
                                    isActive 
                                      ? "bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                                      : "text-[var(--foreground-secondary)] hover:text-[var(--color-primary)] hover:bg-slate-50"
                                  )}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                                  <span className="text-sm font-medium">{service.title}</span>
                                </Link>
                              )
                            })
                          ) : (
                            <div className="py-3 px-4 text-sm text-[var(--foreground-secondary)]">
                              Услуги скоро появятся
                            </div>
                          )}
                          <Link
                            href="/services"
                            className="flex items-center gap-2 py-3 px-4 text-sm font-medium text-[var(--color-primary)]"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Все услуги
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-1 text-base font-medium hover:text-[var(--color-primary)] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="#download" onClick={() => setIsMenuOpen(false)}>
                    <Download className="w-5 h-5" />
                    Скачать приложение
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
