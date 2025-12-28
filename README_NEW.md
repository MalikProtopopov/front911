# 911 Platform - Корпоративный сайт

Корпоративный сайт 911 на Next.js 14 с TypeScript, Tailwind CSS и Shadcn UI.

## 📁 Структура проекта

```
web_911/
├── apps/
│   └── frontend/          # Next.js приложение
│       ├── src/           # Исходный код
│       ├── public/        # Статические файлы
│       └── package.json
│
├── deploy/                # Развертывание
│   ├── docker/           # Docker конфигурации
│   │   ├── frontend/
│   │   └── nginx/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
│
├── docs/                  # Документация
│   ├── api/              # OpenAPI спецификация
│   ├── design/           # Дизайн концепты
│   ├── guides/           # Руководства
│   └── summaries/        # Итоги изменений
│
└── scripts/               # Утилиты
    ├── dev-setup.sh
    └── generate-api-client.sh
```

## 🚀 Быстрый старт

### Установка и настройка

```bash
# Настройка dev окружения
./scripts/dev-setup.sh

# Или вручную:
cd apps/frontend
npm install
cp .env.example .env.local
```

### Запуск в режиме разработки

```bash
cd apps/frontend
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## 🐳 Docker

### Development

```bash
cd deploy
docker-compose up -d
```

### Production

```bash
cd deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Документация

- [Настройка API](docs/guides/api-setup.md) - подключение к backend
- [UI Kit](docs/guides/ui-kit.md) - библиотека UI компонентов
- [API спецификация](docs/api/openapi.yaml) - OpenAPI схема
- [Дизайн концепт](docs/design/landing-concept.md) - концепция дизайна
- [Структура проекта](docs/guides/project-structure.md) - детальная структура

## 🛠 Технологии

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI (Radix UI)
- **Forms:** React Hook Form + Zod
- **API Client:** Auto-generated from OpenAPI
- **State:** Zustand
- **Data Fetching:** SWR
- **Animations:** Framer Motion
- **Analytics:** Яндекс.Метрика
- **Icons:** Lucide React

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (production)
- **CI/CD:** GitHub Actions (опционально)

## 📝 Скрипты

```bash
# Генерация API клиента из OpenAPI спецификации
./scripts/generate-api-client.sh

# Настройка dev окружения
./scripts/dev-setup.sh
```

## 🔧 Конфигурация

### Environment Variables

Создайте `.env.local` в `apps/frontend/`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# App
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
NEXT_PUBLIC_APP_NAME=911

# Analytics (optional)
NEXT_PUBLIC_YM_ID=
```

### Docker Compose

Для локальной разработки:
```bash
cd deploy
docker-compose up
```

Для production:
```bash
cd deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Разработка

### Структура apps/frontend/src

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── [pages]/
├── components/       # React компоненты
│   ├── ui/          # UI Kit компоненты
│   ├── layout/      # Header, Footer
│   ├── sections/    # Секции страниц
│   └── forms/       # Формы
├── lib/             # Утилиты и конфигурация
│   ├── api/         # API клиент и сервисы
│   ├── config/      # Конфигурация
│   └── errors/      # Обработка ошибок
└── store/           # Zustand стейт менеджмент
```

### Команды

```bash
cd apps/frontend

# Development
npm run dev          # Запуск dev сервера
npm run build        # Production сборка
npm run start        # Запуск prod сборки
npm run lint         # Линтинг

# API
npm run generate-api # Генерация API клиента
```

## 📋 Roadmap

- [x] Базовая структура и компоненты
- [x] UI Kit и дизайн-система
- [x] Интеграция с API
- [x] SEO оптимизация (ISR/SSG)
- [ ] Аналитика и мониторинг
- [ ] CI/CD pipeline
- [ ] Performance оптимизация
- [ ] Тесты (Unit + E2E)

## 🤝 Contributing

1. Создайте ветку от `main`
2. Внесите изменения
3. Запустите линтер: `npm run lint`
4. Создайте Pull Request

## 📄 Лицензия

Proprietary - 911 Platform

## 📞 Контакты

- Email: support@911.ru
- Website: https://911.ru

