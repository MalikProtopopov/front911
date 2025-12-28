# API Спецификация

> **Note:** OpenAPI спецификация была перемещена во время реорганизации.
> 
> Если файл отсутствует, восстановите его из:
> 1. Бэкенд проекта
> 2. Git истории
> 3. Регенерируйте API клиент: `./scripts/generate-api-client.sh`

## Генерация API клиента

```bash
cd /Users/mak/Desktop/web_911
./scripts/generate-api-client.sh
```

## Структура API

- Base URL: `http://localhost:8000/api/website/`
- Endpoints:
  - `/services/` - Услуги
  - `/cities/` - Города
  - `/advantages/` - Преимущества
  - `/metrics/` - Метрики
  - `/leads/` - Заявки
  - `/seo/` - SEO метаданные

