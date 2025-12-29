# Руководство по деплою фронтенда

## 📋 Базовая информация для подключения

### URL бекенда (API)

**Production URL:**
```
http://45.144.221.92/api/website/
```

**Базовый URL для всех запросов:**
```
http://45.144.221.92
```

### Документация API

- **Swagger UI (интерактивная документация):** http://45.144.221.92/api/docs/
- **ReDoc (альтернативная документация):** http://45.144.221.92/api/redoc/
- **OpenAPI Schema (JSON):** http://45.144.221.92/api/schema/

### CORS настройки

✅ **CORS уже настроен для вашего фронтенда!**

Ваш фронтенд на `89.169.1.53` уже добавлен в разрешенные источники. Убедитесь, что:

1. **В `.env.prod` на бекенде указан правильный порт:**
   ```env
   CORS_ALLOWED_ORIGINS=http://45.144.221.92,http://89.169.1.53:ПОРТ
   ```
   ⚠️ Замените `ПОРТ` на реальный порт вашего фронтенда (например, `:3000`, `:80`, `:8080`)

2. **Если фронт на HTTPS:**
   ```env
   CORS_ALLOWED_ORIGINS=http://45.144.221.92,https://89.169.1.53
   ```

3. **После изменения `.env.prod` пересоздайте контейнер:**
   ```bash
   docker compose --env-file .env.prod -f docker/docker-compose.prod.yml up -d --force-recreate web
   ```

---

## 🔗 Доступные API Endpoints

### Базовый путь: `/api/website/`

### 1. Города (`/api/website/cities/`)

```javascript
// Список всех городов
GET /api/website/cities/

// Детали города по slug
GET /api/website/cities/{slug}/
// Пример: /api/website/cities/moskva/

// Фильтрация и пагинация
GET /api/website/cities/?limit=20&offset=0
```

**Пример ответа:**
```json
{
  "count": 82,
  "next": "http://45.144.221.92/api/website/cities/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Москва",
      "slug": "moskva",
      "description": "Описание города",
      "is_active": true
    }
  ]
}
```

### 2. Услуги (`/api/website/services/`)

```javascript
// Список всех услуг
GET /api/website/services/

// Детали услуги по slug
GET /api/website/services/{slug}/
// Пример: /api/website/services/shinomontazh/

// Опции услуги
GET /api/website/services/{slug}/options/
```

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Шиномонтаж",
  "slug": "shinomontazh",
  "description": "Описание услуги",
  "icon": "http://45.144.221.92/media/icons/shinomontazh.png",
  "is_active": true
}
```

### 3. Услуга в городе (`/api/website/cities/{city_slug}/services/{service_slug}/`)

```javascript
// Информация об услуге в конкретном городе
GET /api/website/cities/moskva/services/shinomontazh/

// Возвращает:
// - Детали услуги
// - Опции услуги для этого города
// - Цены (если есть)
// - SEO метаданные для страницы
```

### 4. Опции услуг (`/api/website/options/`)

```javascript
// Список всех опций
GET /api/website/options/

// Фильтрация по городу и услуге
GET /api/website/options/?city=1&service=2

// Детали опции
GET /api/website/options/{id}/
```

### 5. Преимущества (`/api/website/advantages/`)

```javascript
// Список преимуществ
GET /api/website/advantages/

// Фильтр по целевой аудитории
GET /api/website/advantages/?target_audience=client
// Варианты: client, partner, both

// Детали преимущества
GET /api/website/advantages/{id}/
```

### 6. Метрики (`/api/website/metrics/`)

```javascript
// Список метрик платформы
GET /api/website/metrics/

// Фильтр по типу метрики
GET /api/website/metrics/?metric_type=platform
// Варианты: platform, financial, operational, quality

// Детали метрики
GET /api/website/metrics/{id}/
```

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Городов присутствия",
  "value": "82",
  "metric_type": "platform",
  "icon": "http://45.144.221.92/media/icons/cities.png"
}
```

### 7. Контакты (`/api/website/contacts/`)

```javascript
// Список контактов
GET /api/website/contacts/

// Фильтр по типу контакта
GET /api/website/contacts/?contact_type=phone
// Варианты: phone, email, address, social

// Детали контакта
GET /api/website/contacts/{id}/
```

### 8. Ссылки на приложения (`/api/website/app-links/`)

```javascript
// Список ссылок на мобильные приложения
GET /api/website/app-links/

// Детали ссылки
GET /api/website/app-links/{id}/
```

**Пример ответа:**
```json
{
  "id": 1,
  "platform": "ios",
  "url": "https://apps.apple.com/app/911",
  "qr_code": "http://45.144.221.92/media/qr/ios.png"
}
```

### 9. SEO метаданные (`/api/website/seo-meta/`)

```javascript
// Список SEO метаданных
GET /api/website/seo-meta/

// Фильтр по URL страницы
GET /api/website/seo-meta/?page_url=/moskva/shinomontazh/

// Детали SEO метаданных
GET /api/website/seo-meta/{id}/
```

**Пример ответа:**
```json
{
  "id": 1,
  "page_url": "/moskva/shinomontazh/",
  "title": "Шиномонтаж в Москве - 911",
  "description": "Описание для SEO",
  "keywords": "шиномонтаж, москва",
  "og_title": "Шиномонтаж в Москве",
  "og_description": "Описание для Open Graph",
  "og_image": "http://45.144.221.92/media/og/shinomontazh-moskva.jpg"
}
```

### 10. Создание заявки (`POST /api/website/leads/`)

**⚠️ Единственный endpoint с POST запросом (без аутентификации)**

```javascript
POST /api/website/leads/
Content-Type: application/json

{
  "name": "Иван Иванов",           // Обязательно (2-100 символов)
  "phone": "+79991234567",         // Обязательно (10-12 цифр)
  "email": "ivan@example.com",     // Опционально
  "city": 1,                       // Опционально (ID города)
  "service": 2,                    // Опционально (ID услуги)
  "message": "Нужен шиномонтаж",   // Опционально
  "source_page": "/moskva/shinomontazh/",  // Опционально (URL страницы)
  "utm_source": "google",          // Опционально (UTM метки)
  "utm_medium": "cpc",              // Опционально
  "utm_campaign": "summer2024"      // Опционально
}
```

**Успешный ответ (201 Created):**
```json
{
  "id": 123,
  "name": "Иван Иванов",
  "phone": "+79991234567",
  "email": "ivan@example.com",
  "city": 1,
  "city_title": "Москва",
  "service": 2,
  "service_title": "Шиномонтаж",
  "message": "Нужен шиномонтаж",
  "source_page": "/moskva/shinomontazh/",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "summer2024",
  "status": "new",
  "status_display": "Новая",
  "created_at": "2024-01-15T10:30:00Z",
  "processed_at": null
}
```

**Ошибка валидации (400 Bad Request):**
```json
{
  "name": ["Имя должно содержать минимум 2 символа"],
  "phone": ["Номер телефона должен содержать от 10 до 12 цифр"]
}
```

---

## 🔧 Технические детали

### Формат запросов

- **Content-Type:** `application/json`
- **Методы:** Только `GET` (кроме `/api/website/leads/` - там `POST`)
- **Аутентификация:** Не требуется для публичных endpoints

### Пагинация

Все списковые endpoints поддерживают пагинацию:

```javascript
GET /api/website/cities/?limit=20&offset=0
```

- `limit` - количество элементов (по умолчанию 20, максимум 100)
- `offset` - смещение от начала (по умолчанию 0)

**Ответ с пагинацией:**
```json
{
  "count": 82,
  "next": "http://45.144.221.92/api/website/cities/?limit=20&offset=20",
  "previous": null,
  "results": [...]
}
```

### Фильтрация

Многие endpoints поддерживают фильтрацию через query-параметры:

```javascript
// Опции для конкретного города и услуги
GET /api/website/options/?city=1&service=2

// Преимущества для клиентов
GET /api/website/advantages/?target_audience=client

// Контакты - только телефоны
GET /api/website/contacts/?contact_type=phone
```

### Обработка ошибок

**404 Not Found:**
```json
{
  "detail": "Not found."
}
```

**400 Bad Request (валидация):**
```json
{
  "field_name": ["Сообщение об ошибке"]
}
```

**500 Internal Server Error:**
```json
{
  "detail": "A server error occurred."
}
```

---

## 📝 Примеры использования

### React/Next.js пример

```javascript
// config/api.js
export const API_BASE_URL = 'http://45.144.221.92/api/website';

// services/cities.js
export async function getCities() {
  const response = await fetch(`${API_BASE_URL}/cities/`);
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  return response.json();
}

export async function getCity(slug) {
  const response = await fetch(`${API_BASE_URL}/cities/${slug}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch city');
  }
  return response.json();
}

// services/leads.js
export async function createLead(leadData) {
  const response = await fetch(`${API_BASE_URL}/leads/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create lead');
  }
  
  return response.json();
}

// Использование
import { getCities, createLead } from './services';

// Получить города
const cities = await getCities();
console.log(cities.results);

// Создать заявку
try {
  const lead = await createLead({
    name: 'Иван Иванов',
    phone: '+79991234567',
    city: 1,
    service: 2,
    message: 'Нужен шиномонтаж',
    source_page: window.location.pathname,
  });
  console.log('Lead created:', lead);
} catch (error) {
  console.error('Error creating lead:', error);
}
```

### Axios пример

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://45.144.221.92/api/website',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Получить города
const cities = await api.get('/cities/');

// Создать заявку
const lead = await api.post('/leads/', {
  name: 'Иван Иванов',
  phone: '+79991234567',
  city: 1,
  service: 2,
});
```

---

## ✅ Чеклист перед деплоем

- [ ] Убедитесь, что URL бекенда правильный: `http://45.144.221.92`
- [ ] Проверьте, что CORS настроен для вашего фронтенда (порт указан правильно)
- [ ] Протестируйте основные endpoints:
  - [ ] `GET /api/website/cities/`
  - [ ] `GET /api/website/services/`
  - [ ] `POST /api/website/leads/`
- [ ] Проверьте обработку ошибок (404, 400, 500)
- [ ] Убедитесь, что UTM метки передаются при создании заявок
- [ ] Проверьте, что `source_page` передается при создании заявок

---

## 🆘 Если что-то не работает

### CORS ошибки

1. Проверьте, что ваш URL добавлен в `CORS_ALLOWED_ORIGINS` в `.env.prod` на бекенде
2. Убедитесь, что указан правильный порт (если не стандартный)
3. Пересоздайте контейнер web после изменения `.env.prod`

### 404 ошибки

- Проверьте правильность slug (города, услуги)
- Убедитесь, что объект активен (`is_active: true`)

### 400 ошибки при создании заявки

- Проверьте формат телефона (10-12 цифр)
- Убедитесь, что имя минимум 2 символа
- Проверьте, что `city` и `service` - это числа (ID)

### Проблемы с подключением

- Проверьте, что бекенд доступен: `curl http://45.144.221.92/api/website/`
- Проверьте логи бекенда: `docker compose logs web`

---

## 📞 Контакты для поддержки

Если возникли проблемы с API, проверьте:
1. Документацию: http://45.144.221.92/api/docs/
2. Логи бекенда на сервере
3. Статус контейнеров: `docker compose ps`

---

**Последнее обновление:** 2024-01-15  
**Версия API:** 1.0.0

