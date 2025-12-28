# Design System - 911 Corporate Website

Полная документация дизайн-системы проекта 911 Автопомощь.

---

## Содержание

1. [Цветовая палитра](#1-цветовая-палитра)
2. [Типографика](#2-типографика)
3. [Spacing System](#3-spacing-system-4px-grid)
4. [Button System](#4-button-system)
5. [Form Components](#5-form-components)
6. [Card Components](#6-card-components)
7. [Badge System](#7-badge-system)
8. [Icon Circle](#8-icon-circle)
9. [Grid System](#9-grid-system)
10. [Shadows](#10-shadows)
11. [Border Radius](#11-border-radius)
12. [Breakpoints](#12-breakpoints)
13. [Z-Index Scale](#13-z-index-scale)
14. [Animation](#14-animation)
15. [UI Components](#15-ui-components)
16. [Страницы проекта](#16-страницы-проекта)
17. [Ключевые файлы](#17-ключевые-файлы)

---

## 1. Цветовая палитра

**Источник:** `apps/frontend/src/app/globals.css`

### Primary Colors (Emergency Red)

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Primary | `--color-primary` | `#FF5722` | Кнопки, акценты, CTA, ссылки |
| Primary Hover | `--color-primary-hover` | `#E64A19` | Hover состояния кнопок |
| Primary Light | `--color-primary-light` | `#FF7043` | Светлые акценты |
| Primary Lighter | `--color-primary-lighter` | `#FFAB91` | Очень светлые акценты |
| Primary Dark | `--color-primary-dark` | `#D84315` | Тёмные акценты |

### Secondary Colors (Professional Dark Blue)

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Secondary | `--color-secondary` | `#2C3E50` | Заголовки, основной текст |
| Secondary Hover | `--color-secondary-hover` | `#1A252F` | Hover состояния |
| Secondary Light | `--color-secondary-light` | `#34495E` | Светлые варианты |
| Secondary Lighter | `--color-secondary-lighter` | `#5D6D7E` | Очень светлые варианты |
| Secondary Dark | `--color-secondary-dark` | `#1C2833` | Тёмные варианты |

### Accent Colors (Warning Yellow)

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Accent | `--color-accent` | `#FFC107` | Промокоды, важные элементы |
| Accent Hover | `--color-accent-hover` | `#FFA000` | Hover состояния |
| Accent Light | `--color-accent-light` | `#FFD54F` | Светлые варианты |
| Accent Lighter | `--color-accent-lighter` | `#FFE082` | Очень светлые варианты |

### Semantic Colors

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Success | `--color-success` | `#4CAF50` | Успешные состояния, 24/7 бейдж |
| Error | `--color-error` | `#FF3B3F` | Ошибки, валидация |
| Warning | `--color-warning` | `#FF9800` | Предупреждения |
| Info | `--color-info` | `#2196F3` | Информационные сообщения |

### Background Colors

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Background | `--background` | `#FFFFFF` | Основной фон |
| Background Secondary | `--background-secondary` | `#F8F9FA` | Альтернативный фон секций |
| Background Tertiary | `--background-tertiary` | `#F1F3F5` | Третичный фон |
| Background Dark | `--background-dark` | `#2C3E50` | Тёмный фон (footer) |

### Text Colors

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Foreground | `--foreground` | `#212529` | Основной текст |
| Foreground Secondary | `--foreground-secondary` | `#6C757D` | Вторичный текст, подписи |
| Foreground Tertiary | `--foreground-tertiary` | `#ADB5BD` | Третичный текст, плейсхолдеры |
| Foreground Inverse | `--foreground-inverse` | `#FFFFFF` | Текст на тёмном фоне |

### Border Colors

| Название | CSS Variable | HEX | Использование |
|----------|--------------|-----|---------------|
| Border | `--border` | `#E0E0E0` | Основные границы |
| Border Light | `--border-light` | `#F0F0F0` | Светлые границы |
| Border Dark | `--border-dark` | `#BDBDBD` | Тёмные границы |

---

## 2. Типографика

**Источники:** `apps/frontend/src/app/globals.css`, `apps/frontend/src/components/ui/typography.tsx`

### Шрифты

| Тип | CSS Variable | Font Family | Использование |
|-----|--------------|-------------|---------------|
| Heading | `--font-heading` | `Manrope` | Заголовки H1-H6 |
| Body | `--font-body` | `Inter` | Основной текст |

### Размеры заголовков

| Элемент | Desktop | Mobile | Line Height | Font Weight |
|---------|---------|--------|-------------|-------------|
| H1 | 56px | 40px | 1.2 | 700 (Bold) |
| H2 | 40px | 32px | 1.2 | 700 (Bold) |
| H3 | 28px | 24px | 1.2 | 700 (Bold) |
| H4 | 24px | 20px | 1.2 | 700 (Bold) |
| H5 | 20px | 18px | 1.2 | 700 (Bold) |
| H6 | 18px | 16px | 1.2 | 700 (Bold) |

### Размеры текста

| Название | Size | Tailwind Class |
|----------|------|----------------|
| XS | 12px | `text-xs` |
| SM | 14px | `text-sm` |
| Base | 16px | `text-base` |
| LG | 18px | `text-lg` |
| XL | 20px | `text-xl` |
| 2XL | 24px | `text-2xl` |
| 3XL | 28px | `text-3xl` |
| 4XL | 32px | `text-4xl` |
| 5XL | 40px | `text-5xl` |
| 6XL | 48px | `text-6xl` |
| 7XL | 56px | `text-7xl` |
| 8XL | 64px | `text-8xl` |

### Font Weights

| Название | Value | Tailwind Class |
|----------|-------|----------------|
| Regular | 400 | `font-normal` |
| Medium | 500 | `font-medium` |
| Semibold | 600 | `font-semibold` |
| Bold | 700 | `font-bold` |
| Extrabold | 800 | `font-extrabold` |

### Line Heights

| Название | Value | Использование |
|----------|-------|---------------|
| Tight | 1.2 | Заголовки |
| Snug | 1.375 | Компактный текст |
| Normal | 1.5 | Основной текст |
| Relaxed | 1.625 | Читаемый текст |
| Loose | 2 | Разреженный текст |

---

## 3. Spacing System (4px Grid)

**Источники:** `apps/frontend/src/app/globals.css`, `apps/frontend/src/lib/design-system.ts`

### Базовая единица: 4px

| Token | Value | CSS Variable | Tailwind |
|-------|-------|--------------|----------|
| 0 | 0px | `--spacing-0` | `p-0`, `m-0` |
| 1 | 4px | `--spacing-1` | `p-1`, `m-1` |
| 2 | 8px | `--spacing-2` | `p-2`, `m-2` |
| 3 | 12px | `--spacing-3` | `p-3`, `m-3` |
| 4 | 16px | `--spacing-4` | `p-4`, `m-4` |
| 5 | 20px | `--spacing-5` | `p-5`, `m-5` |
| 6 | 24px | `--spacing-6` | `p-6`, `m-6` |
| 8 | 32px | `--spacing-8` | `p-8`, `m-8` |
| 10 | 40px | `--spacing-10` | `p-10`, `m-10` |
| 12 | 48px | `--spacing-12` | `p-12`, `m-12` |
| 14 | 56px | `--spacing-14` | `p-14`, `m-14` |
| 16 | 64px | `--spacing-16` | `p-16`, `m-16` |
| 20 | 80px | `--spacing-20` | `p-20`, `m-20` |
| 24 | 96px | `--spacing-24` | `p-24`, `m-24` |
| 28 | 112px | `--spacing-28` | `p-28`, `m-28` |
| 32 | 128px | `--spacing-32` | `p-32`, `m-32` |
| 40 | 160px | `--spacing-40` | `p-40`, `m-40` |
| 48 | 192px | `--spacing-48` | `p-48`, `m-48` |

### Container System

| Breakpoint | Max Width | CSS Variable |
|------------|-----------|--------------|
| SM | 640px | `--container-sm` |
| MD | 768px | `--container-md` |
| LG | 1024px | `--container-lg` |
| XL | 1240px | `--container-xl` |
| 2XL | 1440px | `--container-2xl` |

### Container Padding (Horizontal)

| Breakpoint | Padding | CSS Variable |
|------------|---------|--------------|
| Mobile | 20px | `--container-padding-mobile` |
| Tablet (768px+) | 32px | `--container-padding-tablet` |
| Desktop (1024px+) | 40px | `--container-padding-desktop` |
| Wide (1440px+) | 48px | `--container-padding-wide` |

### Section Spacing (Vertical)

| Size | Mobile | Tablet | Desktop | CSS Class |
|------|--------|--------|---------|-----------|
| SM | 48px | 64px | 80px | `.section-spacing-sm` |
| MD | 64px | 80px | 96px | `.section-spacing-md` |
| LG | 80px | 96px | 112px | `.section-spacing-lg` |
| XL | 96px | 112px | 144px | `.section-spacing-xl` |

### Gap System

| Size | Value | CSS Variable | CSS Class |
|------|-------|--------------|-----------|
| XS | 8px | `--gap-xs` | `.section-gap-xs` |
| SM | 12px | `--gap-sm` | `.section-gap-sm` |
| MD | 16px | `--gap-md` | `.section-gap-md` |
| LG | 24px | `--gap-lg` | `.section-gap-lg` |
| XL | 32px | `--gap-xl` | `.section-gap-xl` |
| 2XL | 48px | `--gap-2xl` | `.section-gap-2xl` |
| 3XL | 64px | `--gap-3xl` | `.section-gap-3xl` |

---

## 4. Button System

**Источники:** `apps/frontend/src/components/ui/button.tsx`, `apps/frontend/src/app/globals.css`

### Размеры кнопок

| Size | Height | Padding X | Padding Y | Font Size | Tailwind Height |
|------|--------|-----------|-----------|-----------|-----------------|
| sm | 36px | 20px | 8px | 14px | `h-9` |
| default | 48px | 28px | 12px | 14px | `h-12` |
| lg | 56px | 40px | 16px | 18px | `h-14` |
| icon | 40px | 0 | 0 | - | `h-10 w-10` |

### Варианты кнопок

| Variant | Background | Text | Border | Использование |
|---------|------------|------|--------|---------------|
| `default` | Primary (#FF5722) | White | - | Основные CTA |
| `outline` | Transparent | Primary | 2px Primary | Вторичные действия |
| `secondary` | Background Secondary | Foreground | - | Третичные действия |
| `ghost` | Transparent | Foreground | - | Навигация, текстовые кнопки |
| `destructive` | Error (#FF3B3F) | White | - | Удаление, опасные действия |
| `link` | Transparent | Primary | - | Inline ссылки |

### Использование

```tsx
// Импорт
import { Button } from '@/components/ui/button'

// Примеры
<Button size="lg">Скачать приложение</Button>
<Button size="lg" variant="outline">Подробнее</Button>
<Button size="sm">Позвонить</Button>
<Button size="icon"><Phone /></Button>
```

---

## 5. Form Components

**Источники:** `apps/frontend/src/components/ui/input.tsx`, `apps/frontend/src/components/ui/textarea.tsx`, `apps/frontend/src/components/ui/label.tsx`

### Input

| Свойство | Значение |
|----------|----------|
| Height | 48px (`h-12`) |
| Padding X | 16px (`px-4`) |
| Padding Y | 8px (`py-2`) |
| Border | 2px solid `--border` |
| Border Radius | 8px (`rounded-md`) |
| Font Size | 16px (`text-base`) |
| Focus | Ring 2px Primary |

### Textarea

| Свойство | Значение |
|----------|----------|
| Min Height | 120px (`min-h-[120px]`) |
| Padding X | 16px (`px-4`) |
| Padding Y | 12px (`py-3`) |
| Border | 2px solid `--border` |
| Border Radius | 8px (`rounded-md`) |
| Font Size | 16px (`text-base`) |
| Focus | Ring 2px Primary |

### Label

| Свойство | Значение |
|----------|----------|
| Font Size | 14px (`text-sm`) |
| Font Weight | 500 (`font-medium`) |
| Color | Foreground |

### Использование

```tsx
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

<Label htmlFor="name">Имя</Label>
<Input id="name" placeholder="Иван Иванов" />
<Textarea placeholder="Ваше сообщение..." />
```

---

## 6. Card Components

**Источники:** `apps/frontend/src/components/ui/card.tsx`, `apps/frontend/src/components/ui/feature-card.tsx`

### Card (базовая)

| Свойство | Значение |
|----------|----------|
| Border Radius | 8px (`rounded-lg`) |
| Border | 1px solid `--border` |
| Background | White |
| Shadow | `shadow-sm` |
| Hover Shadow | `shadow-md` |

### CardHeader

| Свойство | Значение |
|----------|----------|
| Padding | 24px (`p-6`) |
| Gap | 6px (`space-y-1.5`) |

### CardContent

| Свойство | Значение |
|----------|----------|
| Padding | 24px (`p-6`) |
| Padding Top | 0 (`pt-0`) |

### FeatureCard

| Свойство | Значение |
|----------|----------|
| Padding | 24px (`p-6`) |
| Border Radius | 12px (`rounded-xl`) |
| Hover Background | `--background-secondary` |

### LinkCard

| Свойство | Значение |
|----------|----------|
| Hover Shadow | `shadow-lg` |
| Hover Border | Primary color |
| Cursor | Pointer |

### Использование

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FeatureCard, LinkCard } from '@/components/ui/feature-card'

<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>Контент</CardContent>
</Card>

<FeatureCard
  icon={<Clock />}
  title="Быстрый отклик"
  description="Мастер приедет за 15-30 минут"
/>

<LinkCard
  href="/services/shinomontazh"
  icon={<Wrench />}
  title="Шиномонтаж"
  description="Выездной шиномонтаж 24/7"
/>
```

---

## 7. Badge System

**Источник:** `apps/frontend/src/components/ui/badge.tsx`

### Размеры

| Size | Padding X | Padding Y | Font Size | Border Radius |
|------|-----------|-----------|-----------|---------------|
| sm | 8px | 2px | 12px | 4px |
| md | 12px | 4px | 14px | 8px |
| lg | 16px | 6px | 14px | 12px |

### Варианты

| Variant | Background | Text |
|---------|------------|------|
| `primary` | Primary | White |
| `secondary` | Secondary | White |
| `success` | Success | White |
| `error` | Error | White |
| `accent` | Accent | Foreground |
| `primary-soft` | Primary/10 | Primary |
| `secondary-soft` | Secondary/10 | Secondary |
| `success-soft` | Success/10 | Success |
| `error-soft` | Error/10 | Error |
| `accent-soft` | Accent/20 | Accent |
| `outline` | Transparent | Current |
| `outline-primary` | Transparent | Primary |

### Shapes

- `default` - Standard border radius
- `pill` - Fully rounded (`rounded-full`)

### Использование

```tsx
import { Badge, FeatureBadge, StatusBadge } from '@/components/ui/badge'

<Badge variant="success-soft">Онлайн</Badge>
<Badge variant="primary" shape="pill">Новинка</Badge>
<FeatureBadge>24/7</FeatureBadge>
<StatusBadge status="online" label="Доступен" />
```

---

## 8. Icon Circle

**Источник:** `apps/frontend/src/components/ui/icon-circle.tsx`

### Размеры

| Size | Container | Icon Size |
|------|-----------|-----------|
| sm | 32x32px | 16x16px |
| md | 40x40px | 20x20px |
| lg | 48x48px | 24x24px |
| xl | 64x64px | 32x32px |
| 2xl | 80x80px | 40x40px |

### Варианты

| Variant | Background | Icon Color |
|---------|------------|------------|
| `primary` | Primary | White |
| `secondary` | Secondary | White |
| `success` | Success | White |
| `accent` | Accent | Foreground |
| `primary-soft` | Primary/10 | Primary |
| `secondary-soft` | Secondary/10 | Secondary |
| `success-soft` | Success/10 | Success |
| `muted` | Background Secondary | Foreground Secondary |

### Использование

```tsx
import { IconCircle, NumberedCircle } from '@/components/ui/icon-circle'

<IconCircle icon={<Phone />} variant="primary" size="lg" />
<IconCircle icon={<Clock />} variant="primary-soft" size="xl" hoverScale />
<NumberedCircle number={1} variant="primary" size="md" />
```

---

## 9. Grid System

**Источники:** `apps/frontend/src/components/ui/grid.tsx`, `apps/frontend/src/app/globals.css`

### 12-колоночная сетка

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
```

### Column Spans

| Class | Columns |
|-------|---------|
| `.col-span-1` | 1 column |
| `.col-span-2` | 2 columns |
| `.col-span-3` | 3 columns (25%) |
| `.col-span-4` | 4 columns (33%) |
| `.col-span-6` | 6 columns (50%) |
| `.col-span-12` | Full width |

### Grid Component

| Cols | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 2 |
| 3 | 1 | 2 | 3 |
| 4 | 1 | 2 | 4 |
| 5 | 2 | 3 | 5 |
| 6 | 2 | 3 | 6 |

### Gap Sizes

| Size | Mobile | Desktop |
|------|--------|---------|
| sm | 16px | 24px |
| md | 24px | 32px |
| lg | 32px | 48px |
| xl | 40px | 64px |

### Использование

```tsx
import { Grid, Section, Stack, Row } from '@/components/ui/grid'

<Grid cols={3} gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

<Section id="services" bg="secondary" spacing="lg">
  Content
</Section>

<Stack gap="md">
  <div>Vertical item 1</div>
  <div>Vertical item 2</div>
</Stack>

<Row gap="lg" justify="between">
  <div>Left</div>
  <div>Right</div>
</Row>
```

---

## 10. Shadows

**Источник:** `apps/frontend/src/app/globals.css`

| Name | CSS Variable | Value |
|------|--------------|-------|
| SM | `--shadow-sm` | `0 2px 4px rgba(0, 0, 0, 0.06)` |
| MD | `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.08)` |
| LG | `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.12)` |
| XL | `--shadow-xl` | `0 16px 48px rgba(0, 0, 0, 0.16)` |
| 2XL | `--shadow-2xl` | `0 24px 64px rgba(0, 0, 0, 0.20)` |
| Inner | `--shadow-inner` | `inset 0 2px 4px rgba(0, 0, 0, 0.06)` |

---

## 11. Border Radius

**Источник:** `apps/frontend/src/app/globals.css`

| Name | CSS Variable | Value | Tailwind |
|------|--------------|-------|----------|
| SM | `--radius-sm` | 4px | `rounded-sm` |
| MD | `--radius-md` | 8px | `rounded-md` |
| LG | `--radius-lg` | 12px | `rounded-lg` |
| XL | `--radius-xl` | 16px | `rounded-xl` |
| 2XL | `--radius-2xl` | 20px | `rounded-2xl` |
| 3XL | `--radius-3xl` | 24px | `rounded-3xl` |
| Full | `--radius-full` | 9999px | `rounded-full` |

---

## 12. Breakpoints

**Источник:** `apps/frontend/src/lib/design-tokens.ts`

| Name | Width | CSS Media Query |
|------|-------|-----------------|
| Mobile | 375px | `@media (min-width: 375px)` |
| Mobile LG | 480px | `@media (min-width: 480px)` |
| Tablet | 768px | `@media (min-width: 768px)` |
| Desktop | 1024px | `@media (min-width: 1024px)` |
| Desktop LG | 1440px | `@media (min-width: 1440px)` |
| Wide | 1920px | `@media (min-width: 1920px)` |

### Tailwind Breakpoints

| Prefix | Min Width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

---

## 13. Z-Index Scale

**Источник:** `apps/frontend/src/app/globals.css`

| Name | CSS Variable | Value | Использование |
|------|--------------|-------|---------------|
| Dropdown | `--z-dropdown` | 1000 | Выпадающие меню |
| Sticky | `--z-sticky` | 1020 | Липкие элементы |
| Fixed | `--z-fixed` | 1030 | Фиксированные элементы |
| Modal Backdrop | `--z-modal-backdrop` | 1040 | Фон модальных окон |
| Modal | `--z-modal` | 1050 | Модальные окна |
| Popover | `--z-popover` | 1060 | Поповеры |
| Tooltip | `--z-tooltip` | 1070 | Тултипы |

---

## 14. Animation

**Источник:** `apps/frontend/src/app/globals.css`

### Duration

| Name | CSS Variable | Value |
|------|--------------|-------|
| Fastest | `--duration-fastest` | 0.15s |
| Fast | `--duration-fast` | 0.2s |
| Normal | `--duration-normal` | 0.3s |
| Slow | `--duration-slow` | 0.4s |
| Slower | `--duration-slower` | 0.6s |

### Easing

| Name | CSS Variable | Value |
|------|--------------|-------|
| Default | `--easing-default` | `ease-out` |
| In | `--easing-in` | `ease-in` |
| Out | `--easing-out` | `ease-out` |
| In-Out | `--easing-in-out` | `ease-in-out` |
| Spring | `--easing-spring` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` |
| Smooth | `--easing-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### CSS Animations

```css
/* Fade In */
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--easing-default);
}

/* Slide In */
.animate-slide-in {
  animation: slideIn var(--duration-slow) var(--easing-default);
}
```

---

## 15. UI Components

**Источник:** `apps/frontend/src/components/ui/`

### Полный список компонентов

| Компонент | Файл | Описание |
|-----------|------|----------|
| Accordion | `accordion.tsx` | Раскрывающиеся секции (FAQ) |
| Badge | `badge.tsx` | Метки и статусы |
| Breadcrumbs | `breadcrumbs.tsx` | Навигационные крошки |
| Button | `button.tsx` | Кнопки |
| Card | `card.tsx` | Карточки |
| Dialog | `dialog.tsx` | Модальные окна |
| Feature Card | `feature-card.tsx` | Карточки преимуществ/услуг |
| Grid | `grid.tsx` | Сетки и лейауты |
| Icon Circle | `icon-circle.tsx` | Круглые иконки |
| Input | `input.tsx` | Поля ввода |
| Label | `label.tsx` | Лейблы форм |
| Link Button | `link-button.tsx` | Ссылки со стрелкой |
| Section Header | `section-header.tsx` | Заголовки секций |
| Textarea | `textarea.tsx` | Многострочный ввод |
| Typography | `typography.tsx` | Типографика |

### Импорт компонентов

```tsx
// Через общий index
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Grid, 
  Section,
  SectionHeader,
  FeatureCard 
} from '@/components/ui'

// Или напрямую
import { Button } from '@/components/ui/button'
```

---

## 16. Страницы проекта

| Путь | Описание | Ключевые секции |
|------|----------|-----------------|
| `/` | Главная страница | Hero, HowItWorks, Services, Advantages, TrustBar, Reviews, Geography, CTA |
| `/about` | О компании | Hero, History, Team |
| `/cities` | Список городов | Hero, Cities Grid |
| `/cities/[slug]` | Страница города | Hero, Services, CTA |
| `/cities/[slug]/services/[serviceSlug]` | Услуга в городе | Hero, Details, Form, CTA |
| `/services` | Список услуг | Hero, Services Grid |
| `/services/[slug]` | Страница услуги | Hero, Features, CTA |
| `/partners` | Для партнёров | Hero, Benefits, Requirements, Form |
| `/contacts` | Контакты | Hero, Contact Info, Form |
| `/faq` | FAQ | Hero, Accordion |
| `/privacy` | Политика конфиденциальности | Text content |
| `/terms` | Условия использования | Text content |

---

## 17. Ключевые файлы

### CSS и стили
- `apps/frontend/src/app/globals.css` - Глобальные стили и CSS переменные

### TypeScript токены
- `apps/frontend/src/lib/design-system.ts` - Полная дизайн-система
- `apps/frontend/src/lib/design-tokens.ts` - Дизайн-токены

### UI компоненты
- `apps/frontend/src/components/ui/` - Все UI компоненты
- `apps/frontend/src/components/ui/index.ts` - Централизованный экспорт

### Секции
- `apps/frontend/src/components/sections/` - Секции страниц (Hero, Services, etc.)

### Формы
- `apps/frontend/src/components/forms/` - Формы (LeadForm)

### Layout
- `apps/frontend/src/components/layout/` - Header, Footer, Container

---

## Примеры использования

### Типичная страница

```tsx
import { Section, SectionHeader, Grid, Button } from '@/components/ui'
import { FeatureCard } from '@/components/ui/feature-card'

export default function Page() {
  return (
    <main>
      {/* Hero секция */}
      <section className="section-spacing-xl bg-gradient-to-b from-white to-[var(--background-secondary)]">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold">Заголовок</h1>
          <p className="text-lg text-[var(--foreground-secondary)]">Описание</p>
          <Button size="lg">Действие</Button>
        </div>
      </section>

      {/* Контент секция */}
      <Section id="features" bg="white" spacing="lg">
        <SectionHeader
          title="Заголовок секции"
          subtitle="Описание секции"
        />
        <Grid cols={3} gap="lg">
          <FeatureCard
            icon={<Icon />}
            title="Преимущество"
            description="Описание"
          />
        </Grid>
      </Section>
    </main>
  )
}
```

### Форма

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

<Card>
  <CardHeader>
    <CardTitle>Оставить заявку</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-6">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input id="name" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input id="phone" type="tel" className="mt-2" />
      </div>
      <Button size="lg" className="w-full">Отправить</Button>
    </form>
  </CardContent>
</Card>
```

---

## Changelog

| Дата | Версия | Изменения |
|------|--------|-----------|
| 2025-12-27 | 1.0 | Первоначальная документация |

---

*Документация создана автоматически на основе исходного кода проекта.*

