/**
 * Section Divider Component
 * Subtle visual separators between major sections
 */

interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'dots' | 'wave'
  className?: string
}

export function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
  if (variant === 'gradient') {
    return (
      <div className={`h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent ${className}`} />
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center gap-2 py-8 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/50" />
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/50" />
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <div className={`relative h-8 overflow-hidden ${className}`}>
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,12 Q300,0 600,12 T1200,12 L1200,24 L0,24 Z"
            fill="var(--background-secondary)"
            opacity="0.3"
          />
        </svg>
      </div>
    )
  }

  // Default - simple line
  return (
    <div className={`container mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      <div className="h-px bg-[var(--border)]" />
    </div>
  )
}

