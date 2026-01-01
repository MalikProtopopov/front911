---
name: Switch to Pure SSR
overview: Переключение всех страниц с ISR (Incremental Static Regeneration) на чистый SSR (Server-Side Rendering) для получения актуальных данных на каждый запрос.
todos:
  - id: static-pages-ssr
    content: Заменить revalidate на dynamic='force-dynamic' в 10 статических страницах
    status: pending
  - id: dynamic-pages-ssr
    content: "Обновить 4 динамические страницы: убрать generateStaticParams, добавить dynamic"
    status: pending
  - id: test-build
    content: Протестировать сборку и работу SSR локально
    status: pending
  - id: deploy
    content: Задеплоить на сервер и проверить
    status: pending
---

# Переключение на чистый SSR

## Текущее состояние

- 14 страниц используют `export const revalidate = 3600` (ISR)
- 4 динамические страницы используют `generateStaticParams()` (SSG)
- При сборке генерируются ~431 статическая страница

## Что нужно изменить

### Замена ISR на SSR

На каждой странице заменить:

```typescript
// Было (ISR):
export const revalidate = 3600

// Станет (SSR):
export const dynamic = 'force-dynamic'
```

### Страницы для изменения (14 файлов)

**Статические страницы (10):**

| Файл | Изменение |

|------|-----------|

| [`page.tsx`](apps/frontend/src/app/page.tsx) | `revalidate` -> `dynamic` |

| [`about/page.tsx`](apps/frontend/src/app/about/page.tsx) | `revalidate` -> `dynamic` |

| [`contacts/page.tsx`](apps/frontend/src/app/contacts/page.tsx) | `revalidate` -> `dynamic` |

| [`cities/page.tsx`](apps/frontend/src/app/cities/page.tsx) | `revalidate` -> `dynamic` |

| [`services/page.tsx`](apps/frontend/src/app/services/page.tsx) | `revalidate` -> `dynamic` |

| [`partners/page.tsx`](apps/frontend/src/app/partners/page.tsx) | `revalidate` -> `dynamic` |

| [`faq/page.tsx`](apps/frontend/src/app/faq/page.tsx) | `revalidate` -> `dynamic` |

| [`documents/page.tsx`](apps/frontend/src/app/documents/page.tsx) | `revalidate` -> `dynamic` |

| [`terms/page.tsx`](apps/frontend/src/app/terms/page.tsx) | `revalidate` -> `dynamic` |

| [`privacy/page.tsx`](apps/frontend/src/app/privacy/page.tsx) | `revalidate` -> `dynamic` |

**Динамические страницы (4) - требуют доп. изменений:**

| Файл | Изменение |

|------|-----------|

| [`cities/[slug]/page.tsx`](apps/frontend/src/app/cities/[slug]/page.tsx) | Убрать `revalidate`, добавить `dynamic`, удалить `generateStaticParams` |

| [`cities/[slug]/services/[serviceSlug]/page.tsx`](apps/frontend/src/app/cities/[slug]/services/[serviceSlug]/page.tsx) | Убрать `revalidate`, добавить `dynamic`, удалить `generateStaticParams` |

| [`services/[slug]/page.tsx`](apps/frontend/src/app/services/[slug]/page.tsx) | Убрать `revalidate`, добавить `dynamic`, удалить `generateStaticParams` |

| [`documents/[slug]/page.tsx`](apps/frontend/src/app/documents/[slug]/page.tsx) | Убрать `revalidate`, добавить `dynamic`, удалить `generateStaticParams` |

## Последствия перехода на SSR

### Преимущества:

- Данные всегда актуальные (SEO, контент)
- Сборка будет быстрее (не нужно генерировать 431 страницу)
- Проще деплой (нет статической генерации)

### Недостатки:

- Каждый запрос = рендеринг на сервере
- Медленнее для пользователя (нет готового HTML)
- Больше нагрузка на API
- Нет кеширования страниц

## Рекомендация

Для SEO-страниц оптимальнее оставить ISR с коротким интервалом (например, 60 секунд), чем чистый SSR. Это дает баланс между актуальностью данных и производительностью.

Альтернатива - уменьшить `revalidate`:

```typescript
export const revalidate = 60  // Обновление каждую минуту
```