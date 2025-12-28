# Промпт для AI: Исправить padding всех кнопок size="lg" на сайте

## Задача
Исправить внутренние отступы (padding) у всех кнопок размера `lg` на сайте, чтобы текст не прилипал к краям кнопок.

## Что было исправлено на странице /partners

В компоненте `apps/frontend/src/components/ui/button.tsx` размер `lg` уже исправлен:
- `lg: "h-14 rounded-md px-10 py-4 text-lg"` (px-10 = 40px, py-4 = 16px)

Но нужно добавить глобальные CSS стили, чтобы эти padding применялись ко всем кнопкам размера `lg` на сайте.

## Что нужно сделать

Добавь в файл `apps/frontend/src/app/globals.css` глобальные стили для всех кнопок размера `lg`:

```css
/* Global Button Padding Fix - All size="lg" buttons */
button.h-14,
a.h-14,
button[class*="h-14"][class*="rounded-md"],
a[class*="h-14"][class*="rounded-md"] {
  padding-left: 2.5rem !important;    /* 40px */
  padding-right: 2.5rem !important;   /* 40px */
  padding-top: 1rem !important;       /* 16px */
  padding-bottom: 1rem !important;     /* 16px */
}
```

Или используй более точный селектор через data-атрибут или класс:

```css
/* Fix padding for large buttons */
[class*="h-14"][class*="px-10"] {
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
```

## Требования
- Все кнопки с `size="lg"` должны иметь padding: 40px слева/справа, 16px сверху/снизу
- Стили должны применяться глобально через CSS
- Использовать `!important` для гарантированного применения
- Проверить, что стили работают для кнопок с `asChild` prop (когда Button рендерится как `<a>`)

## Файлы для проверки
Проверь, что стили применяются на всех страницах, где используются кнопки `size="lg"`:
- Главная страница (Hero секция)
- Страница партнёров
- Страницы городов
- Страницы услуг
- Формы (LeadForm)
- Header (мобильное меню)

