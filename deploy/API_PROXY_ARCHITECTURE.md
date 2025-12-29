# API Proxy Architecture: Решение ERR_NAME_NOT_RESOLVED

## A) Причина ошибки ERR_NAME_NOT_RESOLVED

### Проблема

**Ошибка:** `net::ERR_NAME_NOT_RESOLVED` при запросах из браузера к API.

**Причина:**

1. **DNS в Docker Network vs DNS в браузере:**
   - Внутри Docker network контейнеры могут обращаться друг к другу по hostname (например, `backend:8000`)
   - Браузер работает на хосте, не в Docker network, поэтому не знает что такое `backend` или `host.docker.internal`
   - Когда Next.js передает `NEXT_PUBLIC_API_URL=http://backend:8000` в браузер, браузер пытается резолвить `backend` и падает

2. **Почему это проявляется на client-side fetch:**
   - `NEXT_PUBLIC_*` переменные попадают в браузерный bundle
   - Браузер выполняет fetch напрямую, минуя Docker network
   - DNS браузера не знает Docker hostnames

### Типичные ошибки:

```javascript
// ❌ НЕПРАВИЛЬНО: попадает в браузер
NEXT_PUBLIC_API_URL=http://backend:8000  // Браузер не знает "backend"
NEXT_PUBLIC_API_URL=http://host.docker.internal:8000  // Браузер не знает этот хост

// ✅ ПРАВИЛЬНО: относительный URL
NEXT_PUBLIC_API_BASE=/api/website  // Браузер делает запрос к своему домену
```

---

## B) Рекомендуемая архитектура

### Вариант: Next.js Rewrites (выбран)

**Почему rewrites лучше чем Route Handlers:**

1. **SEO-совместимость:**
   - Rewrites работают на уровне Next.js сервера
   - SSR/SSG запросы автоматически проксируются
   - Данные доступны на сервере для индексации

2. **Производительность:**
   - Нет дополнительного слоя (Route Handlers)
   - Прямое проксирование на уровне HTTP

3. **Прозрачность:**
   - Браузер видит только `/api/website/*`
   - Нет CORS проблем (same-origin)

4. **Кеширование:**
   - Next.js может кешировать ответы
   - Поддержка revalidate для SSG

### Архитектура потока:

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ GET /api/website/services/
       │ (relative URL)
       ▼
┌─────────────────┐
│  Next.js Server │
│  (SSR/SSG)      │
└──────┬──────────┘
       │ rewrites() → http://backend:8000/api/website/services/
       │ (Docker network)
       ▼
┌─────────────┐
│   Backend   │
│  (Django)   │
└─────────────┘
```

---

## C) Конкретные правки

### 1. next.config.ts

```typescript
async rewrites() {
  const backendUrl = process.env.API_INTERNAL_BASE || 
    (process.env.NODE_ENV === 'development'
      ? 'http://backend:8000/api/website'
      : 'http://45.144.221.92/api/website')

  return [
    {
      source: '/api/website/:path*',
      destination: `${backendUrl}/:path*`,
    },
  ]
}
```

**Важно:**
- `rewrites()` работают только на сервере Next.js
- Браузер видит только `/api/website/*`
- Переменная `API_INTERNAL_BASE` не попадает в браузер (без префикса `NEXT_PUBLIC_`)

### 2. Единый API_BASE_URL

**Важно:** OpenAPI сгенерированные URL уже содержат `/api/website/` префикс!

**Client-side:**
```typescript
// config/index.ts
const apiBaseUrl = isServer 
  ? process.env.API_INTERNAL_BASE.replace(/\/api\/website\/?$/, '')  // http://backend:8000 (БЕЗ /api/website)
  : ''  // Пустой, так как OpenAPI URLs уже содержат /api/website/
```

**Пример:**
- OpenAPI URL: `/api/website/services/`
- Client BASE: `''` → итого: `/api/website/services/` ✅
- Server BASE: `http://backend:8000` → итого: `http://backend:8000/api/website/services/` ✅

**Переменные окружения:**
- `API_INTERNAL_BASE=http://backend:8000` - для сервера (БЕЗ `/api/website`, так как OpenAPI URLs уже содержат этот префикс)
- Для клиента BASE пустой (`''`), так как OpenAPI сгенерированные URL уже содержат `/api/website/`

### 3. Обновление request.ts

```typescript
// Поддержка относительных URL
const isRelative = url.startsWith('/');
const isAbsolute = url.startsWith('http://') || url.startsWith('https://');

if (!url || (!isRelative && !isAbsolute)) {
  throw new Error(`Invalid URL: ${url}`);
}
```

### 4. Обработка ошибок и логирование

```typescript
// request.ts
if (process.env.NODE_ENV === 'development') {
  const location = typeof window === 'undefined' ? 'Server' : 'Client';
  console.log(`[API Request ${location}] URL:`, url);
  console.log(`[API Request ${location}] BASE:`, config.BASE);
}
```

---

## D) Docker Compose шаблоны

### Структура файлов:

```
deploy/
├── docker-compose.yml          # Базовая конфигурация (сеть, backend, frontend)
├── docker-compose.dev.yml      # Dev override (volumes, hot reload)
├── docker-compose.prod.yml     # Prod override (nginx, healthchecks)
├── .env.development            # Dev переменные
└── .env.production             # Prod переменные
```

### Запуск:

**Dev:**
```bash
cd deploy
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Prod:**
```bash
cd deploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Сеть:

```yaml
networks:
  appnet:
    driver: bridge
    name: 911_appnet
```

**Hostname:**
- `backend` - доступен из frontend контейнера
- `frontend` - доступен из backend контейнера

---

## E) SEO-важные рекомендации

### 1. Какие запросы переносить на сервер:

**SSR (Server-Side Rendering):**
- ✅ Главная страница (services, advantages, metrics)
- ✅ Страницы городов (cities)
- ✅ Страницы услуг (services)
- ✅ SEO-критичный контент

**CSR (Client-Side Rendering):**
- ⚠️ Интерактивные формы (leads)
- ⚠️ Фильтры и поиск
- ⚠️ Динамический контент

### 2. Кеширование и revalidate:

```typescript
// app/page.tsx
export const revalidate = 3600; // 1 час

// Или динамический:
export async function generateStaticParams() {
  // SSG для статичных страниц
}
```

### 3. Влияние на индексацию:

- ✅ Контент доступен в HTML (SSR)
- ✅ Нет пустых страниц для ботов
- ✅ Быстрая загрузка (SSG для статики)

---

## F) Чеклист проверки

### 1. Проверка Request URL в DevTools:

**Откройте Network tab:**
- ✅ URL должен быть: `http://localhost:3000/api/website/services/`
- ❌ НЕ должно быть: `http://backend:8000/...` или `http://host.docker.internal/...`

**Проверка:**
```javascript
// В браузерной консоли
console.log(process.env.NEXT_PUBLIC_API_BASE)  // Должно быть: /api/website
```

### 2. Проверка проксирования на сервере:

**Логи Next.js контейнера:**
```bash
docker logs 911_frontend_dev | grep "API Request Server"
```

**Должно быть:**
```
[API Request Server] URL: http://backend:8000/api/website/services/
[API Request Server] BASE: http://backend:8000/api/website
```

### 3. Исключение CORS/mixed content:

**CORS:**
- ✅ Нет проблем (same-origin запросы)
- ✅ Браузер видит только свой домен

**Mixed Content:**
- ⚠️ Если фронт на HTTPS, backend должен быть HTTPS
- ⚠️ Или используйте относительные URL (проксирование)

### 4. Типичные ошибки:

**Ошибка 1: Переменная попадает в браузер**
```bash
# ❌ НЕПРАВИЛЬНО
NEXT_PUBLIC_API_INTERNAL_BASE=http://backend:8000

# ✅ ПРАВИЛЬНО
API_INTERNAL_BASE=http://backend:8000  # Без NEXT_PUBLIC_
```

**Ошибка 2: Пересборка контейнера**
```bash
# После изменения .env файлов
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Ошибка 3: Rewrites не работают на клиенте**
- Rewrites работают только на сервере Next.js
- Клиентские запросы должны использовать относительные URL

**Ошибка 4: localhost в браузере != localhost в контейнере**
- Браузер: `localhost` = хост машина
- Docker: `localhost` = сам контейнер
- Решение: используйте относительные URL или `host.docker.internal`

---

## Быстрый старт

1. **Обновите .env файлы:**
   ```bash
   # .env.development
   # OpenAPI URLs уже содержат /api/website/, поэтому BASE БЕЗ этого префикса
   API_INTERNAL_BASE=http://host.docker.internal:8000
   ```

2. **Пересоберите контейнеры:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml down
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

3. **Проверьте в браузере:**
   - Network tab: URL должен быть `/api/website/...`
   - Нет ошибок `ERR_NAME_NOT_RESOLVED`

4. **Проверьте на бекенде:**
   - Добавьте в `ALLOWED_HOSTS`: `localhost`, `127.0.0.1`, `backend`

---

## Дополнительные ресурсы

- [Next.js Rewrites Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [Docker Networking](https://docs.docker.com/network/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

