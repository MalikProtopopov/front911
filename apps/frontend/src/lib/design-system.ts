/**
 * Design System - 911 Corporate Website
 * Complete design system with spacing, containers, and layout utilities
 * Based on 4px grid system
 */

/**
 * SPACING SYSTEM
 * All values are multiples of 4px for consistent vertical and horizontal rhythm
 */
export const spacing = {
  // Base spacing scale (4px base unit)
  0: '0px',
  1: '4px',     // 4 * 1
  2: '8px',     // 4 * 2
  3: '12px',    // 4 * 3
  4: '16px',    // 4 * 4
  5: '20px',    // 4 * 5
  6: '24px',    // 4 * 6
  8: '32px',    // 4 * 8
  10: '40px',   // 4 * 10
  12: '48px',   // 4 * 12
  14: '56px',   // 4 * 14
  16: '64px',   // 4 * 16
  20: '80px',   // 4 * 20
  24: '96px',   // 4 * 24
  28: '112px',  // 4 * 28
  32: '128px',  // 4 * 32
  40: '160px',  // 4 * 40
  48: '192px',  // 4 * 48
} as const

/**
 * CONTAINER SYSTEM
 * Responsive container with consistent horizontal padding
 */
export const container = {
  // Max widths
  maxWidth: {
    sm: '640px',    // Small container
    md: '768px',    // Medium container
    lg: '1024px',   // Large container
    xl: '1240px',   // Extra large (main container)
    '2xl': '1440px', // 2X large
    full: '100%',   // Full width
  },
  
  // Horizontal padding (responsive) - synced with CSS variables
  padding: {
    mobile: '20px',      // 4 * 5 - Мобильные устройства
    tablet: '32px',      // 4 * 8 - Планшеты
    desktop: '40px',     // 4 * 10 - Десктоп
    wide: '48px',        // 4 * 12 - Широкие экраны
  },
} as const

/**
 * SECTION SPACING
 * Vertical padding for sections (top and bottom)
 * Synced with CSS variables in globals.css
 */
export const sectionSpacing = {
  // Section padding (vertical rhythm) - synced with CSS
  mobile: {
    sm: '48px',    // 4 * 12 - Маленькая секция
    md: '64px',    // 4 * 16 - Средняя секция
    lg: '80px',    // 4 * 20 - Большая секция
    xl: '96px',    // 4 * 24 - Очень большая секция
  },
  tablet: {
    sm: '64px',    // 4 * 16
    md: '80px',    // 4 * 20
    lg: '96px',    // 4 * 24
    xl: '112px',   // 4 * 28
  },
  desktop: {
    sm: '80px',    // 4 * 20
    md: '96px',    // 4 * 24
    lg: '112px',   // 4 * 28
    xl: '144px',   // 4 * 36
  },
} as const

/**
 * GAPS & MARGINS
 * Internal spacing within sections and components
 */
export const gap = {
  xs: '8px',     // 4 * 2
  sm: '12px',    // 4 * 3
  md: '16px',    // 4 * 4
  lg: '24px',    // 4 * 6
  xl: '32px',    // 4 * 8
  '2xl': '48px', // 4 * 12
  '3xl': '64px', // 4 * 16
} as const

/**
 * DESIGN TOKENS
 * Complete design system tokens
 */
export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#FF5722',
      hover: '#E64A19',
      light: '#FF7043',
      lighter: '#FFAB91',
      dark: '#D84315',
    },
    secondary: {
      DEFAULT: '#2C3E50',
      hover: '#1A252F',
      light: '#34495E',
      lighter: '#5D6D7E',
      dark: '#1C2833',
    },
    accent: {
      DEFAULT: '#FFC107',
      hover: '#FFA000',
      light: '#FFD54F',
      lighter: '#FFE082',
    },
    success: '#4CAF50',
    error: '#FF3B3F',
    warning: '#FF9800',
    info: '#2196F3',
    
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F5',
      dark: '#2C3E50',
    },
    
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      tertiary: '#ADB5BD',
      inverse: '#FFFFFF',
    },
    
    border: {
      DEFAULT: '#E0E0E0',
      light: '#F0F0F0',
      dark: '#BDBDBD',
    },
  },

  typography: {
    fontFamily: {
      heading: 'var(--font-manrope), sans-serif',
      body: 'var(--font-inter), sans-serif',
    },
    fontSize: {
      xs: '12px',       // 0.75rem
      sm: '14px',       // 0.875rem
      base: '16px',     // 1rem
      lg: '18px',       // 1.125rem
      xl: '20px',       // 1.25rem
      '2xl': '24px',    // 1.5rem
      '3xl': '28px',    // 1.75rem
      '4xl': '32px',    // 2rem
      '5xl': '40px',    // 2.5rem
      '6xl': '48px',    // 3rem
      '7xl': '56px',    // 3.5rem
      '8xl': '64px',    // 4rem
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },

  spacing,
  container,
  sectionSpacing,
  gap,

  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.16)',
    '2xl': '0 24px 64px rgba(0, 0, 0, 0.20)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  breakpoints: {
    mobile: '375px',
    mobileLg: '480px',
    tablet: '768px',
    desktop: '1024px',
    desktopLg: '1440px',
    wide: '1920px',
  },

  animation: {
    duration: {
      fastest: '0.15s',
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.4s',
      slower: '0.6s',
    },
    easing: {
      default: 'ease-out',
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const

/**
 * HELPER FUNCTIONS
 */

/**
 * Get container class names with responsive padding
 */
export function getContainerClass(_maxWidth: keyof typeof container.maxWidth = 'xl'): string {
  return `w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-10`
}

/**
 * Get section spacing class names (vertical padding)
 */
export function getSectionSpacingClass(size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const mobile = sectionSpacing.mobile[size]
  const tablet = sectionSpacing.tablet[size]
  const desktop = sectionSpacing.desktop[size]
  
  return `py-[${mobile}] md:py-[${tablet}] lg:py-[${desktop}]`
}

// Type exports
export type DesignTokens = typeof designTokens
export type Spacing = keyof typeof spacing
export type ContainerSize = keyof typeof container.maxWidth
export type SectionSize = 'sm' | 'md' | 'lg' | 'xl'
export type GapSize = keyof typeof gap

