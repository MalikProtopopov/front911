# Развёртывание и SSL (Certbot) через Docker

Кратко: как поднять проект и выдать SSL-сертификат Let's Encrypt с помощью Docker и Certbot.

---

## 1. Что есть в проекте

- **Frontend**: Next.js 16 в `apps/frontend/`.
- **Docker**:
  - `docker-compose.dev.yml` — разработка (hot-reload, порт 3000).
  - `docker-compose.prod.simple.yml` — прод без nginx (Next.js на порту 80).
  - `docker-compose.prod.yml` — прод с **nginx** (80/443) и **certbot** (SSL).

Домен в конфиге: **sluzhba911.com** (и www). API: **https://api.sluzhba911.com**.

---

## 2. Поднять проект (разработка)

```bash
cd apps/frontend
cp .env.example .env.development   # при необходимости поправить переменные
cd docker
docker compose -f docker-compose.dev.yml up -d --build
```

Сайт: http://localhost:3000

Остановка: `docker compose -f docker-compose.dev.yml down`

---

## 3. Поднять прод без SSL (простой вариант)

Next.js слушает порт 80, без nginx и HTTPS:

```bash
cd apps/frontend
# Создать .env.production (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_DOMAIN и т.д.)
cd docker
docker compose -f docker-compose.prod.simple.yml up -d --build
```

Сайт: http://localhost (или http://ВАШ_IP).

---

## 4. Прод с nginx и SSL (Certbot)

Используются **nginx** (прокси + HTTPS) и **certbot** (Let's Encrypt). Сертификаты хранятся в Docker-volume, не на хосте.

### 4.1 Требования

- Сервер с белым IP.
- Домен **sluzhba911.com** (и при необходимости www) указывает A-записями на этот IP.
- Порты **80** и **443** свободны.

### 4.2 Первый запуск (получение SSL)

**Шаг 1.** Включить временный nginx без HTTPS (иначе nginx не стартует без сертификатов):

```bash
cd apps/frontend/docker
cp nginx.conf nginx.conf.backup
cp nginx.initial.conf nginx.conf
```

**Шаг 2.** Запустить только frontend и nginx (certbot пока не трогаем):

```bash
docker compose -f docker-compose.prod.yml up -d --build frontend nginx
```

Проверить: http://sluzhba911.com должен открываться (по HTTP).

**Шаг 3.** Создать volume для certbot (если ещё не созданы) и один раз получить сертификат:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL@example.com \
  --agree-tos \
  --no-eff-email \
  -d sluzhba911.com \
  -d www.sluzhba911.com
```

Подставьте свой `YOUR_EMAIL@example.com`. При успехе в логе будет что-то вроде: `Successfully received certificate`.

**Шаг 4.** Вернуть полный nginx с HTTPS и перезапустить nginx:

```bash
mv nginx.conf.backup nginx.conf
docker compose -f docker-compose.prod.yml up -d --force-recreate nginx
```

**Шаг 5.** Запустить certbot для автоматического продления:

```bash
docker compose -f docker-compose.prod.yml up -d certbot
```

Проверка: https://sluzhba911.com

### 4.3 Если сертификаты уже есть (не первый запуск)

Убедитесь, что в `nginx.conf` указаны пути к сертам (как сейчас):

- `ssl_certificate /etc/letsencrypt/live/sluzhba911.com/fullchain.pem;`
- `ssl_certificate_key /etc/letsencrypt/live/sluzhba911.com/privkey.pem;`

И что nginx смонтировал volume с сертификатами (в compose уже есть `certbot-etc:/etc/letsencrypt:ro`). Затем:

```bash
cd apps/frontend/docker
docker compose -f docker-compose.prod.yml up -d --build
```

Все три сервиса (frontend, nginx, certbot) будут работать; certbot раз в 12 часов проверяет продление.

### 4.4 Продление сертификата (авто и вручную)

- **Авто**: контейнер `certbot` в compose уже запущен с циклом `certbot renew` раз в 12 часов. Ничего делать не нужно.
- **Вручную** (например, тест):

```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 5. Полезные команды

| Действие | Команда |
|----------|--------|
| Логи (все сервисы) | `docker compose -f docker-compose.prod.yml logs -f` |
| Логи nginx | `docker compose -f docker-compose.prod.yml logs -f nginx` |
| Логи certbot | `docker compose -f docker-compose.prod.yml logs -f certbot` |
| Остановить прод | `docker compose -f docker-compose.prod.yml down` |
| Пересобрать frontend | `docker compose -f docker-compose.prod.yml up -d --build frontend` |

---

## 6. Свой домен / несколько доменов

1. В **nginx.conf** и **nginx.initial.conf** замените `sluzhba911.com` и `www.sluzhba911.com` на свои имена.
2. В **docker-compose.prod.yml** в `args` frontend при необходимости поменяйте `NEXT_PUBLIC_API_URL` и убедитесь, что в `.env.production` задан нужный `NEXT_PUBLIC_APP_DOMAIN` (например `https://yourdomain.com`).
3. При первом получении серта в команде certbot укажите свои `-d yourdomain.com -d www.yourdomain.com`.
4. В nginx.conf пути к сертификатам будут вида `/etc/letsencrypt/live/YOURDOMAIN.com/...` — при смене домена поменяйте их.

---

## 7. Переменные окружения (прод)

В `apps/frontend/.env.production` (или через `env_file` в compose) должны быть заданы минимум:

- `NEXT_PUBLIC_API_URL` — URL бэкенда (например `https://api.sluzhba911.com`).
- `NEXT_PUBLIC_APP_DOMAIN` — публичный URL сайта (например `https://sluzhba911.com`).

Остальное по необходимости (аналитика, фичи и т.д.) — см. `.env.example`.
