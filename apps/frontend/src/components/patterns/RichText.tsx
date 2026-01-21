import { cn } from '@/lib/utils'

/* =============================================================================
   RICH TEXT COMPONENT
   Unified component for rendering HTML content from API or static content
============================================================================= */

export interface RichTextProps {
  /** HTML content to render */
  content: string
  /** Variant style */
  variant?: 'default' | 'service' | 'city'
  /** Additional CSS classes */
  className?: string
  /** Wrapper element (default: div) */
  as?: 'div' | 'article' | 'section'
}

/**
 * RichText component for rendering HTML content
 * 
 * @example
 * ```tsx
 * // Default variant
 * <RichText content={htmlContent} />
 * 
 * // Service variant (with details/summary and service-* classes)
 * <RichText content={serviceDescription} variant="service" />
 * 
 * // City variant (simpler styling)
 * <RichText content={cityDescription} variant="city" />
 * ```
 */
export function RichText({
  content,
  variant = 'default',
  className,
  as: Component = 'div',
}: RichTextProps) {
  if (!content) return null

  const baseClasses = "prose prose-lg max-w-none text-[var(--foreground-secondary)]"
  
  // Remove background-color from all elements (ignore inline styles from backend)
  const removeBackgroundColor = "[&_*]:!bg-transparent [&_*]:!bg-[transparent]"
  
  const variantClasses = {
    default: `
      ${removeBackgroundColor}
      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
      [&_p]:mb-4 [&_p]:leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
      [&_li]:leading-relaxed
      [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold
      [&_details]:mb-3 [&_details]:rounded-2xl [&_details]:border [&_details]:border-[var(--border)] [&_details]:overflow-hidden [&_details]:bg-white [&_details]:transition-all [&_details]:duration-150
      [&_details[open]]:shadow-sm
      [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-4 [&_summary]:px-4 [&_summary]:md:px-5 [&_summary]:py-3 [&_summary]:md:py-4 [&_summary]:min-h-[56px] [&_summary]:md:min-h-[60px]
      [&_summary]:bg-white [&_summary]:transition-colors [&_summary]:duration-150 [&_summary]:cursor-pointer
      [&_summary]:font-semibold [&_summary]:text-base [&_summary]:md:text-lg [&_summary]:text-[var(--foreground)] [&_summary]:text-left
      [&_summary]:hover:bg-slate-50
      [&_details[open]_summary]:bg-slate-50
      [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden
      [&_summary]:relative
      [&_summary::after]:content-[''] [&_summary::after]:flex-shrink-0 [&_summary::after]:w-5 [&_summary::after]:h-5 [&_summary::after]:transition-transform [&_summary::after]:duration-200
      [&_summary::after]:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236C757D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] [&_summary::after]:bg-no-repeat [&_summary::after]:bg-center
      [&_details[open]_summary::after]:rotate-180
      [&_details>div]:border-t [&_details>div]:border-[var(--border)] [&_details>div]:px-4 [&_details>div]:md:px-5 [&_details>div]:py-4 [&_details>div]:md:py-5
      [&_details>div]:text-[15px] [&_details>div]:md:text-base [&_details>div]:leading-relaxed [&_details>div]:text-[var(--foreground-secondary)]
      [&_details>p]:border-t [&_details>p]:border-[var(--border)] [&_details>p]:px-4 [&_details>p]:md:px-5 [&_details>p]:py-4 [&_details>p]:md:py-5
      [&_details>p]:text-[15px] [&_details>p]:md:text-base [&_details>p]:leading-relaxed [&_details>p]:text-[var(--foreground-secondary)]
    `,
    service: `
      ${removeBackgroundColor}
      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-8 [&_h3]:mb-4
      [&_p]:mb-4 [&_p]:leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
      [&_li]:leading-relaxed
      [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold
      [&_details]:mb-3 [&_details]:rounded-2xl [&_details]:border [&_details]:border-[var(--border)] [&_details]:overflow-hidden [&_details]:bg-white [&_details]:transition-all [&_details]:duration-150
      [&_details[open]]:shadow-sm
      [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-4 [&_summary]:px-4 [&_summary]:md:px-5 [&_summary]:py-3 [&_summary]:md:py-4 [&_summary]:min-h-[56px] [&_summary]:md:min-h-[60px]
      [&_summary]:bg-white [&_summary]:transition-colors [&_summary]:duration-150 [&_summary]:cursor-pointer
      [&_summary]:font-semibold [&_summary]:text-base [&_summary]:md:text-lg [&_summary]:text-[var(--foreground)] [&_summary]:text-left
      [&_summary]:hover:bg-slate-50
      [&_details[open]_summary]:bg-slate-50
      [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden
      [&_summary]:relative
      [&_summary::after]:content-[''] [&_summary::after]:flex-shrink-0 [&_summary::after]:w-5 [&_summary::after]:h-5 [&_summary::after]:transition-transform [&_summary::after]:duration-200
      [&_summary::after]:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236C757D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] [&_summary::after]:bg-no-repeat [&_summary::after]:bg-center
      [&_details[open]_summary::after]:rotate-180
      [&_details>div]:pt-1 [&_details>div]:pb-0
      [&_details>p]:pt-1 [&_details>p]:pb-0 [&_details>p]:mb-0
      [&_details>div]:border-t [&_details>div]:border-[var(--border)] [&_details>div]:px-4 [&_details>div]:md:px-5 [&_details>div]:py-4 [&_details>div]:md:py-5
      [&_details>div]:text-[15px] [&_details>div]:md:text-base [&_details>div]:leading-relaxed [&_details>div]:text-[var(--foreground-secondary)]
      [&_details>p]:border-t [&_details>p]:border-[var(--border)] [&_details>p]:px-4 [&_details>p]:md:px-5 [&_details>p]:py-4 [&_details>p]:md:py-5
      [&_details>p]:text-[15px] [&_details>p]:md:text-base [&_details>p]:leading-relaxed [&_details>p]:text-[var(--foreground-secondary)]
      [&_.service-intro]:pb-10
      [&_.service-advantages]:mb-6
      [&_.service-pricing]:mb-6
      [&_.service-how-it-works]:mb-6
      [&_.service-faq]:mb-8 [&_.service-faq]:space-y-3
      [&_.service-faq_h3]:!mt-10 [&_.service-faq_h3]:md:!mt-12 [&_.service-faq_h3]:!mb-6 [&_.service-faq_h3]:md:!mb-8
      [&_.service-faq_details]:!mb-0
    `,
    city: `
      ${removeBackgroundColor}
      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h2]:mt-6 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:mb-3
      [&_p]:mb-4 [&_p]:leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:ml-0
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:ml-0
      [&_li]:my-1 [&_li]:pl-1 [&_li]:leading-relaxed
      [&_details]:mb-3 [&_details]:rounded-2xl [&_details]:border [&_details]:border-[var(--border)] [&_details]:overflow-hidden [&_details]:bg-white [&_details]:transition-all [&_details]:duration-150
      [&_details[open]]:shadow-sm
      [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-4 [&_summary]:px-4 [&_summary]:md:px-5 [&_summary]:py-3 [&_summary]:md:py-4 [&_summary]:min-h-[56px] [&_summary]:md:min-h-[60px]
      [&_summary]:bg-white [&_summary]:transition-colors [&_summary]:duration-150 [&_summary]:cursor-pointer
      [&_summary]:font-semibold [&_summary]:text-base [&_summary]:md:text-lg [&_summary]:text-[var(--foreground)] [&_summary]:text-left
      [&_summary]:hover:bg-slate-50
      [&_details[open]_summary]:bg-slate-50
      [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden
      [&_summary]:relative
      [&_summary::after]:content-[''] [&_summary::after]:flex-shrink-0 [&_summary::after]:w-5 [&_summary::after]:h-5 [&_summary::after]:transition-transform [&_summary::after]:duration-200
      [&_summary::after]:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236C757D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] [&_summary::after]:bg-no-repeat [&_summary::after]:bg-center
      [&_details[open]_summary::after]:rotate-180
      [&_details>div]:border-t [&_details>div]:border-[var(--border)] [&_details>div]:px-4 [&_details>div]:md:px-5 [&_details>div]:py-4 [&_details>div]:md:py-5
      [&_details>div]:text-[15px] [&_details>div]:md:text-base [&_details>div]:leading-relaxed [&_details>div]:text-[var(--foreground-secondary)]
      [&_details>p]:border-t [&_details>p]:border-[var(--border)] [&_details>p]:px-4 [&_details>p]:md:px-5 [&_details>p]:py-4 [&_details>p]:md:py-5
      [&_details>p]:text-[15px] [&_details>p]:md:text-base [&_details>p]:leading-relaxed [&_details>p]:text-[var(--foreground-secondary)]
    `,
  }

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        'rich-text',
        `rich-text--${variant}`,
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

