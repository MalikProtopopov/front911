"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

/* =============================================================================
   ACCORDION ITEM - Базовый вариант (border-bottom)
============================================================================= */

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-[var(--border)]", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/* =============================================================================
   ACCORDION ITEM CARD - Карточка-аккордеон (rounded, border, shadow)
============================================================================= */

const AccordionItemCard = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-2xl border border-[var(--border)] overflow-hidden bg-white",
      "data-[state=open]:shadow-sm",
      className
    )}
    {...props}
  />
))
AccordionItemCard.displayName = "AccordionItemCard"

/* =============================================================================
   ACCORDION TRIGGER - Базовый вариант
============================================================================= */

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/* =============================================================================
   ACCORDION TRIGGER CARD - Триггер для карточки-аккордеона
============================================================================= */

const AccordionTriggerCard = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Базовые стили
        "flex flex-1 items-center justify-between gap-4",
        "px-4 md:px-5 py-3 md:py-4",
        "min-h-[56px] md:min-h-[60px]",
        // Цвета и переходы
        "bg-white transition-colors duration-150",
        "hover:bg-slate-50",
        "data-[state=open]:bg-slate-50",
        // Текст
        "text-left font-semibold text-base md:text-lg text-[var(--foreground)]",
        // Chevron rotation
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <span className="text-[var(--color-primary)] flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0">{children}</span>
      </div>
      <ChevronDown className="h-5 w-5 shrink-0 text-[var(--foreground-secondary)] transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTriggerCard.displayName = "AccordionTriggerCard"

/* =============================================================================
   ACCORDION CONTENT - Базовый вариант
============================================================================= */

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

/* =============================================================================
   ACCORDION CONTENT CARD - Контент для карточки-аккордеона
============================================================================= */

const AccordionContentCard = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn(
      "border-t border-[var(--border)]",
      "px-4 md:px-5 py-4 md:py-5",
      "text-[15px] md:text-base leading-relaxed text-[var(--foreground-secondary)]",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))

AccordionContentCard.displayName = "AccordionContentCard"

export { 
  Accordion, 
  AccordionItem, 
  AccordionItemCard,
  AccordionTrigger, 
  AccordionTriggerCard,
  AccordionContent,
  AccordionContentCard
}

