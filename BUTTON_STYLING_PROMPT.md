# Промпт для исправления стилей кнопок на всем сайте

## Контекст задачи

На странице `/partners` были исправлены стили кнопок - добавлены правильные внутренние отступы (padding), чтобы текст внутри кнопок не прилипал к краям. Теперь нужно применить такие же исправления ко всем кнопкам на сайте.

## Что было исправлено

### 1. Компонент Button (`apps/frontend/src/components/ui/button.tsx`)

**Изменения в размере `lg`:**
- **Было:** `lg: "h-14 rounded-md px-8 text-lg"`
- **Стало:** `lg: "h-14 rounded-md px-10 py-4 text-lg"`

**Изменения:**
- Горизонтальный padding увеличен с `px-8` (32px) до `px-10` (40px)
- Добавлен явный вертикальный padding `py-4` (16px сверху и снизу)

### 2. CSS стили в `apps/frontend/src/app/globals.css`

Для секции partners были добавлены дополнительные стили с `!important` для гарантированного применения:

```css
/* Partners Hero Section - Button Padding */
#partners-hero-section .grid > div:first-child .flex a,
#partners-hero-section .grid > div:first-child .flex button {
  padding-left: 2.5rem !important;    /* 40px */
  padding-right: 2.5rem !important;   /* 40px */
  padding-top: 1rem !important;       /* 16px */
  padding-bottom: 1rem !important;    /* 16px */
}
```

## Задача

Применить аналогичные исправления ко всем кнопкам на сайте, чтобы у всех кнопок размера `lg` были правильные внутренние отступы.

## Что нужно сделать

### Вариант 1: Универсальное решение (рекомендуется)

Добавить глобальные CSS стили в `apps/frontend/src/app/globals.css` для всех кнопок размера `lg`, чтобы они имели правильные padding:

```css
/* Global Button Padding Fix for size="lg" */
button[class*="h-14"],
a[class*="h-14"],
button.size-lg,
a.size-lg {
  padding-left: 2.5rem !important;    /* 40px */
  padding-right: 2.5rem !important;   /* 40px */
  padding-top: 1rem !important;        /* 16px */
  padding-bottom: 1rem !important;     /* 16px */
}
```

Или более специфично через классы Tailwind:

```css
/* Fix padding for all large buttons */
.h-14[class*="px-"],
.h-14[class*="rounded-md"] {
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
```

### Вариант 2: Улучшение компонента Button

Убедиться, что в компоненте `Button` размер `lg` имеет правильные значения:
- `px-10` (40px горизонтальный padding)
- `py-4` (16px вертикальный padding)

Это уже сделано, но нужно проверить, что это применяется везде.

## Файлы, где используются кнопки size="lg"

Найди все использования `<Button size="lg">` в следующих файлах и убедись, что стили применяются правильно:

1. `apps/frontend/src/app/partners/page.tsx` - уже исправлено
2. `apps/frontend/src/components/sections/Geography.tsx`
3. `apps/frontend/src/components/sections/CTASection.tsx`
4. `apps/frontend/src/components/sections/Hero.tsx`
5. `apps/frontend/src/components/sections/Services.tsx`
6. `apps/frontend/src/app/cities/[slug]/CityDetailContent.tsx`
7. `apps/frontend/src/app/cities/[slug]/services/[serviceSlug]/CityServiceContent.tsx`
8. `apps/frontend/src/app/services/page.tsx`
9. `apps/frontend/src/app/cities/CitiesList.tsx`
10. `apps/frontend/src/components/forms/LeadForm.tsx`
11. `apps/frontend/src/components/layout/Header.tsx`
12. `apps/frontend/src/components/ui/feature-card.tsx`

## Требования к исправлению

1. **Все кнопки размера `lg`** должны иметь:
   - Горизонтальный padding: `2.5rem` (40px) слева и справа
   - Вертикальный padding: `1rem` (16px) сверху и снизу

2. **Стили должны применяться глобально** через CSS, чтобы не нужно было менять каждый компонент отдельно

3. **Использовать `!important`** только если необходимо для переопределения других стилей

4. **Проверить визуально** в браузере, что все кнопки имеют правильные отступы

## Проверка результата

После применения изменений:
1. Открой страницы с кнопками в браузере
2. Проверь в DevTools, что padding кнопок размера `lg` составляет:
   - `padding-left: 40px` (2.5rem)
   - `padding-right: 40px` (2.5rem)
   - `padding-top: 16px` (1rem)
   - `padding-bottom: 16px` (1rem)
3. Убедись, что текст внутри кнопок не прилипает к краям

## Дополнительные заметки

- Компонент Button использует `class-variance-authority` (cva) для управления вариантами
- Кнопки могут использоваться с `asChild` prop, что означает, что стили применяются к дочернему элементу (обычно `<a>`)
- Некоторые кнопки могут иметь дополнительные классы через `className` prop

