# 911 Corporate Website - Frontend

Корпоративный сайт 911 на Next.js 14 с TypeScript, Tailwind CSS и Shadcn UI.

## Технологический стек

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI)
- **Forms:** React Hook Form + Zod
- **API Client:** Auto-generated from OpenAPI spec
- **State Management:** Zustand
- **Data Fetching:** SWR
- **Animations:** Framer Motion + Three.js
- **Analytics:** Яндекс.Метрика
- **Icons:** Lucide React

## Начало работы

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Заполните необходимые переменные:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_YM_ID=your_metrika_id
NEXT_PUBLIC_APP_DOMAIN=https://yourdomain.com
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Сборка для production

```bash
npm run build
npm start
```

## Docker

### Сборка образа

```bash
docker build -t 911-frontend .
```

### Запуск с Docker Compose

```bash
cd ..
docker-compose up -d
```

## Структура проекта

```
frontend/
├── src/
│   ├── app/              # App Router страницы
│   │   ├── (pages)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/       # React компоненты
│   │   ├── ui/          # Shadcn UI компоненты
│   │   ├── layout/      # Header, Footer
│   │   ├── sections/    # Секции страниц
│   │   └── forms/       # Формы
│   ├── lib/             # Утилиты и конфиги
│   │   ├── api/         # API клиент
│   │   ├── utils.ts
│   │   └── design-tokens.ts
│   └── types/           # TypeScript типы
├── public/              # Статические файлы
├── Dockerfile
└── package.json
```

## Основные страницы

- `/` - Главная страница
- `/services` - Список услуг
- `/services/[slug]` - Детальная страница услуги
- `/cities` - Список городов
- `/cities/[slug]` - Страница города
- `/cities/[city]/services/[service]` - Услуга в конкретном городе
- `/partners` - Для партнёров
- `/about` - О компании
- `/contacts` - Контакты
- `/faq` - Частые вопросы
- `/privacy` - Политика конфиденциальности
- `/terms` - Пользовательское соглашение

## API интеграция

API клиент автоматически генерируется из OpenAPI спецификации:

```bash
npx openapi-typescript-codegen --input ../docs/'911 Corporate Website API (1).yaml' --output ./src/lib/api/generated --client fetch
```

## Дизайн-система

Проект использует дизайн-систему Emergency Concept с:

- **Цвета:** Primary #FF5722, Secondary #2C3E50, Accent #FFC107
- **Типографика:** Manrope (заголовки), Inter (текст)
- **Spacing:** 4/8/16/24/32/48/64px
- **Breakpoints:** Mobile 375px, Tablet 768px, Desktop 1440px

## Аналитика

Интегрирована Яндекс.Метрика для отслеживания:

- `install_intent` - клики на App Store/Google Play
- `lead_submit` - отправка форм
- `scroll_depth` - глубина прокрутки
- `phone_click` - клики на телефон
- `service_view` - просмотры услуг

## Performance

Оптимизация для Core Web Vitals:

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## Лицензия

Proprietary

## Контакты

Email: support@911.ru
