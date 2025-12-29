# Быстрый старт: API Proxy через Next.js

## Проблема решена ✅

Теперь все API запросы проксируются через Next.js:
- **Браузер** → `/api/website/*` (относительный URL)
- **Next.js Server** → `http://backend:8000/api/website/*` (Docker network)

## Шаги для запуска

### 1. Настройте backend ALLOWED_HOSTS

В вашем Django/FastAPI backend добавьте:

```python
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'backend',  # Docker network hostname
    'host.docker.internal',  # Для dev (backend на хосте)
    '45.144.221.92',  # Prod IP
]
```

### 2. Обновите .env файлы

**`.env.development`:**
```bash
# OpenAPI URLs уже содержат /api/website/, поэтому BASE должен быть БЕЗ этого префикса
API_INTERNAL_BASE=http://host.docker.internal:8000
```

**`.env.production`:**
```bash
# OpenAPI URLs уже содержат /api/website/, поэтому BASE должен быть БЕЗ этого префикса
API_INTERNAL_BASE=http://backend:8000
```

### 3. Запустите Docker

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

### 4. Проверьте в браузере

1. Откройте DevTools → Network
2. Найдите запрос к API (например, `services/`)
3. **URL должен быть:** `http://localhost:3000/api/website/services/`
4. **НЕ должно быть:** `http://backend:8000/...` или `http://host.docker.internal/...`

### 5. Проверьте логи

**Frontend контейнер:**
```bash
docker logs 911_frontend_dev | grep "API Request"
```

Должно быть:
- `[API Request Client] URL: /api/website/services/` (браузер)
- `[API Request Server] URL: http://backend:8000/api/website/services/` (SSR)

## Что изменилось

### ✅ Исправлено:
- ❌ `ERR_NAME_NOT_RESOLVED` → ✅ Относительные URL
- ❌ CORS проблемы → ✅ Same-origin запросы
- ❌ Хардкод IP в коде → ✅ Environment variables

### 📁 Измененные файлы:
- `next.config.ts` - добавлены rewrites
- `src/lib/config/index.ts` - поддержка относительных URL
- `src/lib/api/generated/core/request.ts` - валидация относительных URL
- `docker-compose.yml` - базовая конфигурация
- `docker-compose.dev.yml` - dev override
- `docker-compose.prod.yml` - prod override

## Типичные проблемы

### Проблема: Все еще вижу ERR_NAME_NOT_RESOLVED

**Решение:**
1. Убедитесь что `NEXT_PUBLIC_API_BASE=/api/website` (относительный URL)
2. Пересоберите контейнер: `docker compose up --build`
3. Очистите кеш браузера

### Проблема: 404 на /api/website/*

**Решение:**
1. Проверьте что `rewrites()` в `next.config.ts` настроены
2. Проверьте `API_INTERNAL_BASE` переменную
3. Проверьте что backend доступен по указанному URL

### Проблема: Backend не отвечает из Docker

**Решение:**
1. Если backend на хосте: используйте `host.docker.internal:8000`
2. Если backend в Docker: используйте `backend:8000` (hostname из docker-compose.yml)
3. Проверьте сеть: `docker network inspect 911_appnet`

## Дополнительная информация

См. `API_PROXY_ARCHITECTURE.md` для детального объяснения архитектуры.

