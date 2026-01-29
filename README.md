# 911 Автопомощь — Корпоративный веб-сайт

Современный веб-сайт для сервиса экстренной автопомощи "911", построенный на Next.js 16 с TypeScript. Сайт предоставляет информацию об услугах, городах работы, ценах и позволяет оставлять заявки на услуги.

## 📋 Содержание

- [Технологический стек](#технологический-стек)
- [Структура проекта](#структура-проекта)
- [Архитектура](#архитектура)
- [Основные директории](#основные-директории)
- [Конфигурация](#конфигурация)
- [Разработка](#разработка)
- [Деплой](#деплой)
- [API интеграция](#api-интеграция)

## 🛠 Технологический стек

### Основные технологии
- **Next.js 16.1.1** — React фреймворк с SSR/ISR
- **React 19.2.3** — UI библиотека
- **TypeScript 5** — типизация
- **Tailwind CSS 4** — стилизация
- **Zustand 5.0.9** — управление состоянием
- **SWR 2.3.8** — кэширование и синхронизация данных
- **React Hook Form 7.69.0** — работа с формами
- **Zod 4.2.1** — валидация схем

### UI библиотеки
- **Radix UI** — доступные компоненты (Accordion, Dialog, Label)
- **Lucide React** — иконки
- **Framer Motion** — анимации
- **Sonner** — уведомления (toasts)

### Инструменты разработки
- **ESLint** — линтинг кода
- **OpenAPI TypeScript Codegen** — генерация типов из OpenAPI схемы
- **Docker** — контейнеризация

## 📁 Структура проекта

```
front911/
├── apps/
│   └── frontend/              # Основное приложение Next.js
│       ├── src/
│       │   ├── app/           # Next.js App Router (страницы)
│       │   ├── components/    # React компоненты
│       │   ├── lib/           # Утилиты, API клиент, конфигурация
│       │   ├── store/         # Zustand store (state management)
│       │   └── types/         # TypeScript типы
│       ├── public/            # Статические файлы
│       ├── docker/            # Docker конфигурация для разработки
│       └── scripts/           # Вспомогательные скрипты
├── deploy/                    # Конфигурация для production деплоя
│   ├── docker/                # Docker файлы для production
│   └── docker-compose.prod.yml
└── DEPLOYMENT_CHECKLIST.md    # Чеклист деплоя
```

## 🏗 Архитектура

### Принципы архитектуры

1. **SSR-first подход** — данные загружаются на сервере для лучшего SEO и производительности
2. **ISR (Incremental Static Regeneration)** — страницы ревалидируются по расписанию
3. **Клиентское кэширование** — SWR для синхронизации данных на клиенте
4. **Типобезопасность** — полная типизация через TypeScript и сгенерированные типы из OpenAPI
5. **Компонентная архитектура** — переиспользуемые компоненты с четким разделением ответственности

### Поток данных

```
API Backend → OpenAPI Client → Services → Hooks → Components
                ↓
         Generated Types
                ↓
         Zustand Store (опционально)
```

## 📂 Основные директории

### `/apps/frontend/src/app/` — Страницы (App Router)

Next.js App Router с файловой маршрутизацией:

- **`page.tsx`** — главная страница с секциями (Hero, Services, Advantages, etc.)
- **`layout.tsx`** — корневой layout с Header, Footer, метаданными
- **`services/`** — страницы услуг
  - `page.tsx` — список всех услуг
  - `[slug]/page.tsx` — детальная страница услуги
- **`cities/`** — страницы городов
  - `page.tsx` — список городов
  - `[slug]/page.tsx` — детальная страница города
  - `[slug]/services/[serviceSlug]/page.tsx` — услуга в конкретном городе
- **`documents/`** — документы (политики, условия)
- **`about/`**, **`contacts/`**, **`partners/`**, **`faq/`** — информационные страницы
- **`sitemap.ts`** — генерация sitemap.xml
- **`robots.ts`** — robots.txt конфигурация

**Особенности:**
- Все страницы используют SSR для начальной загрузки данных
- ISR с `revalidate` для обновления контента
- Динамические метаданные из SEO API

### `/apps/frontend/src/components/` — React компоненты

Организованы по категориям:

#### `common/` — Переиспользуемые компоненты
- **`LoadingSpinner.tsx`** — индикатор загрузки
- **`ErrorMessage.tsx`** — отображение ошибок
- **`EmptyState.tsx`** — пустое состояние
- **`Skeleton.tsx`** — скелетоны для загрузки
- **`ContactLink.tsx`** — ссылки на контакты (телефон, email, соцсети)
- **`PhoneButton.tsx`** — кнопка звонка
- **`DownloadButtons.tsx`** — кнопки скачивания приложений
- **`RetryButton.tsx`** — кнопка повтора запроса
- **`SectionDivider.tsx`** — разделитель секций

#### `layout/` — Компоненты макета
- **`Header.tsx`** — шапка сайта с навигацией
- **`Footer.tsx`** — подвал сайта
- **`Container.tsx`** — контейнер для контента
- **`PageLayout.tsx`** — обертка для страниц

#### `sections/` — Секции главной страницы
- **`Hero.tsx`** — главный баннер
- **`Services.tsx`** — секция услуг
- **`HowItWorks.tsx`** — как это работает
- **`Advantages.tsx`** — преимущества
- **`TrustBar.tsx`** — метрики доверия
- **`Reviews.tsx`** — отзывы
- **`Geography.tsx`** — география работы
- **`CTASection.tsx`** — призыв к действию
- **`HeroPhoneMockup.tsx`** — мокап телефона для Hero

#### `ui/` — UI компоненты (Design System)
Базовые компоненты на основе Radix UI и Tailwind:

- **`button.tsx`** — кнопки различных вариантов
- **`input.tsx`**, **`textarea.tsx`** — поля ввода
- **`card.tsx`** — карточки
- **`service-card.tsx`** — карточка услуги
- **`city-card.tsx`** — карточка города
- **`city-grid.tsx`** — сетка городов
- **`service-list.tsx`** — список услуг
- **`accordion.tsx`** — аккордеон
- **`price-accordion.tsx`** — аккордеон с ценами
- **`dialog.tsx`** — модальные окна
- **`badge.tsx`** — бейджи
- **`breadcrumbs.tsx`** — хлебные крошки
- **`section.tsx`**, **`section-header.tsx`** — секции и заголовки
- **`typography.tsx`** — типографика
- **`grid.tsx`** — сетка
- **`feature-card.tsx`** — карточка фичи
- **`icon-circle.tsx`** — иконка в круге
- **`link-button.tsx`** — кнопка-ссылка

#### `patterns/` — Паттерны и композиции
- **`HeroSection.tsx`** — паттерн Hero секции
- **`CTABanner.tsx`** — баннер призыва к действию
- **`FormSidebar.tsx`** — форма в сайдбаре
- **`PageCTA.tsx`** — CTA на странице
- **`RichText.tsx`** — форматированный текст

#### `forms/` — Формы
- **`LeadForm.tsx`** — форма заявки (лида)

#### `seo/` — SEO компоненты
- **`JsonLd.tsx`** — JSON-LD структурированные данные
- **`RelatedCities.tsx`** — связанные города
- **`RelatedServices.tsx`** — связанные услуги

### `/apps/frontend/src/lib/` — Библиотеки и утилиты

#### `api/` — API клиент и сервисы

**`generated/`** — Автогенерированный OpenAPI клиент
- **`core/`** — базовые классы (ApiError, ApiRequestOptions, OpenAPI)
- **`models/`** — TypeScript типы из OpenAPI схемы
- **`services/`** — сервисы API (Service, WebsiteService, SeoService)

**`services/`** — Обертки над API сервисами
- **`services.service.ts`** — работа с услугами
- **`cities.service.ts`** — работа с городами и услугами в городах
- **`content.service.ts`** — контент (преимущества, метрики, контакты, ссылки на приложения)
- **`documents.service.ts`** — документы
- **`leads.service.ts`** — отправка заявок (лидов)
- **`seo.service.ts`** — SEO метаданные
- **`index.ts`** — экспорт всех сервисов

**`hooks/`** — React хуки для работы с API
- **`useServices.ts`** — хуки для услуг
- **`useCities.ts`** — хуки для городов
- **`useContent.ts`** — хуки для контента
- **`useSeo.ts`** — хуки для SEO
- **`useLeadForm.ts`** — хук для формы заявки
- **`useLeads.ts`** — хуки для отправки лидов
- **`useClientData.ts`** — клиентские данные
- **`prefetch.ts`** — префетчинг данных
- **`index.ts`** — экспорт хуков

**`client.ts`** — Конфигурация OpenAPI клиента
- Настройка BASE URL из конфигурации
- Экспорт всех сгенерированных типов и сервисов

#### `config/` — Конфигурация приложения

**`constants.ts`** — Константы приложения
- `QUERY_KEYS` — ключи для SWR кэширования
- `SWR_CONFIG` — конфигурация SWR
- `PAGINATION` — настройки пагинации
- `ANIMATION` — длительности анимаций
- `BREAKPOINTS` — брейкпоинты
- `STORAGE_KEYS` — ключи localStorage
- `ROUTES` — маршруты приложения
- `EXTERNAL_LINKS` — внешние ссылки (fallback)
- `CONTACT_INFO` — контактная информация (fallback)
- `META` — метаданные по умолчанию

**`index.ts`** — Централизованная конфигурация
- Чтение переменных окружения
- Настройка API URL (с обработкой client/server различий)
- Конфигурация аналитики, feature flags, error tracking
- SEO дефолты

#### `utils/` — Утилиты

- **`utils.ts`** — общие утилиты (cn, formatPhone, etc.)
- **`appLinks.ts`** — работа со ссылками на приложения
- **`contacts.tsx`** — утилиты для контактов
- **`serverLogger.ts`** — логирование на сервере

#### `errors/` — Обработка ошибок

- **`ApiError.ts`** — класс ошибки API
- **`ErrorBoundary.tsx`** — React Error Boundary
- **`errorHandlers.ts`** — обработчики ошибок
- **`index.ts`** — экспорт

#### `analytics.tsx`** — Аналитика
- Интеграция Яндекс.Метрики

### `/apps/frontend/src/store/` — State Management (Zustand)

Централизованное управление состоянием через Zustand:

**`index.ts`** — Главный store
- Объединение всех слайсов
- Middleware: devtools, persist, subscribeWithSelector
- Селекторы для оптимизации ре-рендеров

**`slices/`** — Слайсы состояния

- **`uiSlice.ts`** — UI состояние
  - Модальные окна
  - Мобильное меню
  - Состояние скролла

- **`leadFormSlice.ts`** — Состояние формы заявки
  - Черновик формы (сохраняется в localStorage)
  - Выбранный город/услуга
  - Отслеживание отправок (защита от спама)

- **`filtersSlice.ts`** — Фильтры
  - Поисковый запрос
  - Выбранный город/услуга
  - Пагинация

### `/apps/frontend/src/types/` — TypeScript типы

**`index.ts`** — Типы приложения
- `Service`, `City`, `Option`, `Price`
- `Advantage`, `Metric`, `Contact`, `AppLink`
- `SeoMeta`, `Lead`
- `PaginatedResponse`, `CityServiceData`

> **Примечание:** Большинство типов генерируются из OpenAPI схемы в `lib/api/generated/models/`

### `/apps/frontend/public/` — Статические файлы

- **`images/`** — изображения
  - `icons/` — иконки приложений (App Store, Google Play)
  - `screenshots/` — скриншоты приложения
- **`design-system.html`** — документация дизайн-системы
- SVG иконки (file, globe, window, etc.)

### `/apps/frontend/docker/` — Docker для разработки

- **`Dockerfile.dev`** — Dockerfile для разработки
- **`docker-compose.dev.yml`** — docker-compose для локальной разработки
- **`Dockerfile`** — production Dockerfile
- **`docker-compose.prod.yml`** — production docker-compose
- **`nginx.conf`** — конфигурация Nginx

### `/apps/frontend/scripts/` — Скрипты

- **`clear-cache.sh`** — очистка кэша Next.js

### `/deploy/` — Production деплой

- **`docker/frontend/Dockerfile`** — production Dockerfile
- **`docker/nginx/nginx.conf`** — Nginx конфигурация
- **`docker-compose.prod.yml`** — production docker-compose

## ⚙️ Конфигурация

### Переменные окружения

Создайте `.env.local` в `apps/frontend/` для локальной разработки:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000

# Приложение
NEXT_PUBLIC_APP_NAME=911
NEXT_PUBLIC_APP_ENV=development

# Аналитика (опционально)
NEXT_PUBLIC_YM_ID=your_yandex_metrika_id
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Error Tracking (опционально)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**Важно:** 
- Переменные `NEXT_PUBLIC_*` встраиваются в клиентский код во время сборки
- Для production используйте Docker build args (см. `DEPLOYMENT_CHECKLIST.md`)

### Next.js конфигурация (`next.config.ts`)

- **Output:** `standalone` для Docker
- **Images:** настройки оптимизации изображений
- **Security headers:** CSP, X-Frame-Options, etc.
- **Redirects:** редиректы для SEO (trailing slash, исправление slug'ов)
- **Performance:** оптимизация пакетов, компрессия

### TypeScript конфигурация (`tsconfig.json`)

- Строгий режим с полной проверкой типов
- Path aliases: `@/*` → `./src/*`
- React JSX режим

## 🚀 Разработка

### Установка зависимостей

```bash
cd apps/frontend
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

### Сборка для production

```bash
npm run build
npm start
```

### Линтинг

```bash
npm run lint
```

### Очистка кэша

```bash
npm run clean
# или
./scripts/clear-cache.sh
```

## 🐳 Деплой

### Docker (Production)

Подробная инструкция в `DEPLOYMENT_CHECKLIST.md`

**Краткая версия:**

```bash
cd deploy
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d
```

### Переменные окружения для Docker

Передаются через build args в `docker-compose.prod.yml`:

```yaml
build:
  args:
    NEXT_PUBLIC_API_URL: http://45.144.221.92
    NEXT_PUBLIC_APP_DOMAIN: http://89.169.1.53
```

## 🔌 API интеграция

### OpenAPI клиент

Проект использует автогенерированный клиент из OpenAPI схемы:

1. **Генерация типов:**
   ```bash
   # Типы генерируются автоматически при изменении OpenAPI схемы
   # Используется openapi-typescript-codegen
   ```

2. **Использование:**
   ```typescript
   import { servicesService } from '@/lib/api/services'
   
   // Получить все услуги
   const services = await servicesService.getAll()
   ```

### Структура API запросов

```
BASE_URL (из NEXT_PUBLIC_API_URL)
  └── /api/website/
      ├── /services/          # Услуги
      ├── /cities/            # Города
      ├── /cities/{slug}/services/{serviceSlug}/  # Услуга в городе
      ├── /contacts/          # Контакты
      ├── /advantages/        # Преимущества
      ├── /metrics/           # Метрики
      ├── /app-links/        # Ссылки на приложения
      ├── /documents/        # Документы
      ├── /seo/{slug}/       # SEO метаданные
      └── /leads/            # Отправка заявок (POST)
```

### Кэширование (SWR)

- **SSR-first:** данные загружаются на сервере
- **Клиентское кэширование:** SWR для синхронизации
- **Ключи кэша:** определены в `lib/config/constants.ts` → `QUERY_KEYS`

### Обработка ошибок

- **ApiError** — класс для ошибок API
- **ErrorBoundary** — React компонент для отлова ошибок
- **Логирование** — серверное логирование через `serverLogger`

## 📝 Особенности реализации

### SEO оптимизация

- **SSR/ISR** — все страницы рендерятся на сервере
- **Динамические метаданные** — из SEO API
- **JSON-LD** — структурированные данные
- **Sitemap** — автоматическая генерация
- **Robots.txt** — конфигурация для поисковиков
- **Canonical URLs** — правильные канонические ссылки

### Производительность

- **Code splitting** — автоматический через Next.js
- **Image optimization** — Next.js Image компонент
- **Font optimization** — next/font для шрифтов
- **Bundle optimization** — оптимизация импортов (lucide-react, framer-motion)
- **Standalone output** — минимальный Docker образ

### Безопасность

- **CSP** — Content Security Policy
- **Security headers** — X-Frame-Options, X-Content-Type-Options, etc.
- **CORS** — настройка на бекенде
- **Input validation** — Zod схемы для форм

### Доступность (A11y)

- **Radix UI** — доступные компоненты из коробки
- **Семантический HTML** — правильная структура
- **ARIA атрибуты** — где необходимо

## 📚 Дополнительные ресурсы

- **Чеклист деплоя:** `DEPLOYMENT_CHECKLIST.md`
- **Дизайн-система:** `public/design-system.html` (если доступна)

## 🤝 Вклад в проект

При работе с проектом:

1. Следуйте структуре компонентов (common/ui/patterns/sections)
2. Используйте TypeScript типы из `lib/api/generated`
3. Используйте сервисы из `lib/api/services` вместо прямых вызовов API
4. Добавляйте ошибки в ErrorBoundary
5. Тестируйте на разных устройствах (responsive design)

## 📄 Лицензия

Приватный проект для сервиса "911 Автопомощь"
