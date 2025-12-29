/**
 * UI Component Library Index
 * Export all reusable UI components from a single entry point
 */

// Base Shadcn Components
export { 
  Accordion, 
  AccordionItem, 
  AccordionItemCard,
  AccordionTrigger, 
  AccordionTriggerCard,
  AccordionContent,
  AccordionContentCard
} from './accordion'
export { Button, buttonVariants } from './button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './dialog'
export { Input } from './input'
export { Label } from './label'
export { Textarea } from './textarea'

// Typography
export { Heading, Text, Lead } from './typography'

// Links & Navigation
export { LinkWithArrow, BackLink, TextLink } from './link-button'
export { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs'

// Badges & Tags
export { Badge, StatusBadge, FeatureBadge } from './badge'

// Icons
export { IconCircle, NumberedCircle } from './icon-circle'

// Cards
export { FeatureCard, LinkCard, SimpleLinkCard, StatCard } from './feature-card'
export { ServiceCard, ServiceRow, type ServiceCardProps, type ServiceRowProps } from './service-card'

// Layout
export { Grid, TwoColumnLayout, Stack, Row } from './grid'
export { Section, type SectionProps } from './section'

// Section Components
export { SectionHeader, PageHeader } from './section-header'

// Price Accordion (for service pricing lists)
export { 
  PriceAccordion, 
  PriceAccordionCategory, 
  PriceRow, 
  PriceSectionHeader, 
  PriceEmptyState,
  formatPrice,
  getOptionsLabel 
} from './price-accordion'

