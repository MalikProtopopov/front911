# Troubleshooting: API Proxy не работает

## Проблема: 404 на /api/website/*

### Проверка 1: Rewrites работают?

**Проверьте логи Next.js контейнера:**
```bash
docker logs 911_frontend_dev | grep "Next.js Rewrites"
```

**Должно быть:**
```
[Next.js Rewrites] Backend base: http://host.docker.internal:8000
[Next.js Rewrites] Rewriting /api/website/* to: http://host.docker.internal:8000/api/website/*
```

### Проверка 2: Бекенд доступен из Docker?

**Проверьте что бекенд работает на хосте:**
```bash
curl http://localhost:8000/api/website/services/
```

**Должен вернуть 200 OK**

**Проверьте что из Docker контейнера доступен:**
```bash
# Войдите в контейнер
docker exec -it 911_frontend_dev sh

# Попробуйте подключиться к бекенду
wget -O- http://host.docker.internal:8000/api/website/services/ 2>&1 | head -20
```

### Проверка 3: Переменные окружения

**Проверьте что API_INTERNAL_BASE установлена:**
```bash
docker exec 911_frontend_dev printenv | grep API_INTERNAL_BASE
```

**Должно быть:**
```
API_INTERNAL_BASE=http://host.docker.internal:8000
```

### Проверка 4: Rewrites в next.config.ts

**Убедитесь что rewrites правильно настроены:**
```typescript
async rewrites() {
  const backendBase = process.env.API_INTERNAL_BASE?.replace(/\/api\/website\/?$/, '') || 
    'http://host.docker.internal:8000'
  
  return [
    {
      source: '/api/website/:path*',
      destination: `${backendBase}/api/website/:path*`,
    },
  ]
}
```

### Проверка 5: Браузер Network tab

**Откройте DevTools → Network:**
- Request URL должен быть: `http://localhost:3000/api/website/services/`
- Status должен быть: `200` (не `404`)
- Response Headers должны содержать заголовки от бекенда (не Next.js)

## Типичные проблемы

### Проблема: Rewrites не работают

**Причина:** Next.js не видит переменную окружения или rewrites не применяются

**Решение:**
1. Пересоберите контейнер: `docker compose up --build`
2. Проверьте что переменная установлена в `.env.development`
3. Проверьте логи Next.js при старте

### Проблема: Бекенд недоступен из Docker

**Причина:** `host.docker.internal` не работает или бекенд не слушает на правильном интерфейсе

**Решение:**
1. Убедитесь что в `docker-compose.dev.yml` есть:
   ```yaml
   extra_hosts:
     - "host.docker.internal:host-gateway"
   ```
2. Убедитесь что бекенд слушает на `0.0.0.0:8000` (не только `127.0.0.1:8000`)

### Проблема: Все еще 404

**Проверьте:**
1. Бекенд действительно работает на `localhost:8000`?
2. Путь `/api/website/services/` существует на бекенде?
3. Rewrites логи показывают правильный destination?

## Быстрая диагностика

```bash
# 1. Проверьте бекенд на хосте
curl http://localhost:8000/api/website/services/

# 2. Проверьте логи Next.js
docker logs 911_frontend_dev --tail 50

# 3. Проверьте переменные окружения
docker exec 911_frontend_dev printenv | grep API

# 4. Пересоберите если нужно
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

