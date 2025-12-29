# План деплоя проекта 911 Автопомощь (Frontend)

## Оглавление
1. [Обзор архитектуры](#обзор-архитектуры)
2. [Структура проекта](#структура-проекта)
3. [Development-конфигурация](#development-конфигурация)
4. [Production-конфигурация](#production-конфигурация)
5. [Настройка окружения](#настройка-окружения)
6. [SSL и безопасность](#ssl-и-безопасность)
7. [Пошаговая инструкция](#пошаговая-инструкция)
8. [CI/CD рекомендации](#cicd-рекомендации)
9. [Troubleshooting](#troubleshooting)

---

## Обзор архитектуры

### Окружения

| Окружение | Frontend URL | Backend URL | Порты |
|-----------|--------------|-------------|-------|
| **Development** | http://localhost:3000 | http://localhost:8000 | Frontend: 3000, Backend: 8000 |
| **Production** | http://89.169.1.53 | http://45.144.221.92 | Frontend: 80/443, Backend: 80/443 |

### Технологический стек (предположительно)
- **Frontend**: React/Next.js/Vue.js (уточните фреймворк)
- **Build tool**: Vite/Webpack/Next.js
- **Контейнеризация**: Docker + Docker Compose
- **Web Server**: Nginx (для production)
- **SSL**: Let's Encrypt / Certbot (опционально)

---

## Структура проекта

Создайте следующую структуру файлов в вашем проекте:

```
911-frontend/
├── .env.development           # Переменные для dev
├── .env.production            # Переменные для prod
├── .gitignore                 # Игнорируемые файлы
├── Dockerfile.dev             # Docker для разработки
├── Dockerfile                 # Docker для production
├── docker-compose.dev.yml     # Docker Compose для dev
├── docker-compose.prod.yml    # Docker Compose для prod
├── nginx.conf                 # Nginx конфигурация (без SSL)
├── nginx-ssl.conf             # Nginx конфигурация (с SSL)
├── package.json               # Зависимости Node.js
├── vite.config.js             # Vite конфигурация (если используется Vite)
└── src/                       # Исходный код
    └── ...
```

---

## Development-конфигурация

### 1. `.env.development`

Файл с переменными окружения для локальной разработки:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
# или REACT_APP_API_BASE_URL=http://localhost:8000 (для Create React App)
# или NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 (для Next.js)

# Environment
NODE_ENV=development

# Optional: enable hot reload
VITE_HMR_PORT=3000
```

### 2. `Dockerfile.dev`

```dockerfile
# Development Dockerfile с hot reload
FROM node:20-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода (будет перезаписано volume)
COPY . .

# Открываем порт для dev-сервера
EXPOSE 3000

# Запуск dev-сервера
# Для Vite:
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# Для Create React App:
# CMD ["npm", "start"]

# Для Next.js:
# CMD ["npm", "run", "dev"]
```

### 3. `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: 911_frontend_dev
    ports:
      - "3000:3000"  # Host:Container
    volumes:
      # Mount исходников для hot reload
      - .:/app
      # Изолируем node_modules от хоста (важно!)
      - node_modules_dev:/app/node_modules
    environment:
      - VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:8000}
      - NODE_ENV=development
    networks:
      - app_network
    stdin_open: true
    tty: true
    # Автоматическая установка зависимостей при запуске
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0 --port 3000"

volumes:
  # Named volume для изоляции node_modules
  node_modules_dev:

networks:
  app_network:
    driver: bridge
```

### 4. Команды для запуска DEV

```bash
# 1. Запуск dev-окружения
docker-compose -f docker-compose.dev.yml up -d

# 2. Просмотр логов
docker-compose -f docker-compose.dev.yml logs -f frontend

# 3. Остановка
docker-compose -f docker-compose.dev.yml down

# 4. Пересборка (при изменении package.json)
docker-compose -f docker-compose.dev.yml up -d --build

# 5. Проверка статуса
docker-compose -f docker-compose.dev.yml ps
```

**Доступ**: http://localhost:3000

---

## Production-конфигурация

### 1. `.env.production`

```env
# Backend API URL для production
VITE_API_BASE_URL=http://45.144.221.92
# или для SSL:
# VITE_API_BASE_URL=https://api.911.ru

# Environment
NODE_ENV=production

# Optional: Google Analytics, Sentry и т.д.
# VITE_GA_ID=UA-XXXXXXXXX-X
# VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 2. `Dockerfile` (Production)

```dockerfile
# Multi-stage build для оптимизации размера образа
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости (включая devDependencies для сборки)
RUN npm ci --only=production=false

# Копируем исходный код
COPY . .

# === ВАЖНО: Прокидываем переменные окружения для build ===
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Сборка приложения
RUN npm run build

# Stage 2: Production с Nginx
FROM nginx:alpine

# Копируем собранные файлы из builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Если у вас другая директория сборки:
# - Create React App: /app/build
# - Next.js: потребуется другой подход (standalone server)

# Копируем Nginx конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. `nginx.conf` (без SSL)

```nginx
server {
    listen 80;
    server_name 89.169.1.53 _;  # _ = любой домен
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression для оптимизации трафика
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - отдаем index.html для всех роутов
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }

    # Опционально: proxy для API (если хотите через фронтенд)
    # location /api/ {
    #     proxy_pass http://45.144.221.92/;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     proxy_cache_bypass $http_upgrade;
    # }
}
```

### 4. `nginx-ssl.conf` (с SSL)

```nginx
# HTTP → HTTPS редирект
server {
    listen 80;
    server_name 89.169.1.53;  # или ваш домен
    
    # Для Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Редирект на HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name 89.169.1.53;  # или ваш домен
    root /usr/share/nginx/html;
    index index.html;

    # SSL сертификаты
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # SSL настройки (современные и безопасные)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 5. `docker-compose.prod.yml` (без SSL)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    container_name: 911_frontend_prod
    ports:
      - "80:80"  # HTTP
    env_file:
      - .env.production
    networks:
      - app_prod_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

networks:
  app_prod_network:
    driver: bridge
```

### 6. `docker-compose.prod-ssl.yml` (с SSL)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    container_name: 911_frontend_prod
    ports:
      - "80:80"    # HTTP (редирект на HTTPS)
      - "443:443"  # HTTPS
    volumes:
      # Монтируем SSL сертификаты
      - ./ssl:/etc/nginx/ssl:ro
      - ./certbot/www:/var/www/certbot:ro
    env_file:
      - .env.production
    networks:
      - app_prod_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "https://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
    # Используем SSL-конфигурацию Nginx
    command: >
      sh -c "cp /etc/nginx/ssl-config/nginx-ssl.conf /etc/nginx/conf.d/default.conf &&
             nginx -g 'daemon off;'"

  # Certbot для автоматического обновления SSL сертификатов
  certbot:
    image: certbot/certbot:latest
    container_name: 911_certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    networks:
      - app_prod_network
    # Запускается вручную или по cron для обновления сертификатов
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  app_prod_network:
    driver: bridge
```

### 7. Команды для запуска PROD (без SSL)

```bash
# === На сервере 89.169.1.53 ===

# 1. Клонировать репозиторий (первый раз)
git clone <your-repo-url> 911-frontend
cd 911-frontend

# 2. Создать .env.production с правильными переменными
cat > .env.production <<EOF
VITE_API_BASE_URL=http://45.144.221.92
NODE_ENV=production
EOF

# 3. Собрать и запустить
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Проверить статус
docker-compose -f docker-compose.prod.yml ps

# 5. Проверить логи
docker-compose -f docker-compose.prod.yml logs -f frontend

# 6. Проверить доступность
curl http://89.169.1.53/health
# Должно вернуть: OK

# 7. Открыть в браузере
# http://89.169.1.53
```

**Доступ**: http://89.169.1.53

---

## Настройка окружения

### Переменные окружения по окружениям

| Переменная | Development | Production (без SSL) | Production (с SSL) |
|------------|-------------|---------------------|-------------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | `http://45.144.221.92` | `https://api.911.ru` |
| `NODE_ENV` | `development` | `production` | `production` |
| `PORT` | `3000` | `80` | `443` |

### Как изменить порты

#### Development
В `docker-compose.dev.yml`:
```yaml
ports:
  - "3001:3000"  # Изменить на 3001 вместо 3000
```

#### Production
В `docker-compose.prod.yml`:
```yaml
ports:
  - "8080:80"  # Внешний порт 8080 вместо 80
```

---

## SSL и безопасность

### Вариант 1: Без SSL (базовая настройка)

Используйте `nginx.conf` и `docker-compose.prod.yml` из секции выше.

**Плюсы:**
- ✅ Быстрая настройка
- ✅ Не нужны сертификаты
- ✅ Подходит для начального этапа

**Минусы:**
- ⚠️ Трафик не шифруется
- ⚠️ Браузеры показывают "Not secure"
- ⚠️ Не рекомендуется для production

### Вариант 2: SSL с Let's Encrypt (рекомендуется)

#### Шаг 1: Получение SSL сертификата

```bash
# === На сервере 89.169.1.53 ===

# 1. Установить Certbot (если не установлен)
sudo apt update
sudo apt install certbot

# 2. Создать директории для сертификатов
mkdir -p ssl certbot/www

# 3. Получить сертификат (интерактивно)
sudo certbot certonly --standalone \
  -d 89.169.1.53 \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# ИЛИ для домена:
# sudo certbot certonly --standalone \
#   -d 911.ru \
#   -d www.911.ru \
#   --email your-email@example.com \
#   --agree-tos

# 4. Скопировать сертификаты в проект
sudo cp /etc/letsencrypt/live/89.169.1.53/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/89.169.1.53/privkey.pem ./ssl/
sudo chmod 644 ./ssl/*.pem
```

#### Шаг 2: Использовать SSL-конфигурацию

```bash
# 1. Скопировать nginx-ssl.conf в проект
cp nginx-ssl.conf nginx.conf

# 2. Обновить docker-compose.prod.yml для монтирования сертификатов
# (см. docker-compose.prod-ssl.yml выше)

# 3. Запустить с SSL
docker-compose -f docker-compose.prod-ssl.yml up -d --build
```

#### Шаг 3: Автоматическое обновление сертификатов

```bash
# Добавить в crontab для автоматического обновления каждые 3 месяца
sudo crontab -e

# Добавить строку:
0 3 * * 1 certbot renew --quiet && docker-compose -f /path/to/911-frontend/docker-compose.prod-ssl.yml restart frontend
```

### Вариант 3: Самоподписанный сертификат (для тестирования SSL)

```bash
# Создать self-signed сертификат
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem \
  -out ssl/fullchain.pem \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=911/CN=89.169.1.53"

# Использовать nginx-ssl.conf
cp nginx-ssl.conf nginx.conf

# Запустить
docker-compose -f docker-compose.prod-ssl.yml up -d --build
```

**Примечание**: Браузеры будут показывать предупреждение о недоверенном сертификате.

---

## Пошаговая инструкция

### 🛠️ Подготовка проекта (локально)

#### Шаг 1: Создать структуру файлов

```bash
cd your-911-frontend-project

# Создать Docker файлы
touch Dockerfile Dockerfile.dev
touch docker-compose.dev.yml docker-compose.prod.yml
touch nginx.conf nginx-ssl.conf
touch .env.development .env.production

# Добавить в .gitignore
cat >> .gitignore <<EOF
.env.production
.env.development
.env.local
node_modules/
dist/
build/
ssl/
certbot/
EOF
```

#### Шаг 2: Скопировать конфигурации

Скопируйте содержимое файлов из секций выше:
- `Dockerfile.dev`
- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `nginx.conf`
- `nginx-ssl.conf`
- `.env.development`
- `.env.production`

#### Шаг 3: Настроить переменные окружения

**`.env.development`:**
```env
VITE_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

**`.env.production` (обновить после создания):**
```env
VITE_API_BASE_URL=http://45.144.221.92
NODE_ENV=production
```

#### Шаг 4: Обновить `vite.config.js` (если используете Vite)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // или vue, svelte и т.д.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Важно для Docker
  },
  build: {
    outDir: 'dist', // Директория для production build
  },
  // Если используете алиасы путей:
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

#### Шаг 5: Тестировать локально (dev)

```bash
# Запустить dev-окружение
docker-compose -f docker-compose.dev.yml up -d

# Проверить логи
docker-compose -f docker-compose.dev.yml logs -f

# Открыть http://localhost:3000
```

#### Шаг 6: Тестировать локально (prod build)

```bash
# Собрать production образ локально
docker-compose -f docker-compose.prod.yml build

# Запустить на порту 8080 (чтобы не конфликтовать с dev)
# Изменить порт в docker-compose.prod.yml на "8080:80"
docker-compose -f docker-compose.prod.yml up

# Открыть http://localhost:8080
```

#### Шаг 7: Закоммитить и запушить

```bash
git add .
git commit -m "Add Docker configuration for dev and prod"
git push origin main
```

---

### 🚀 Деплой на сервер

#### Шаг 1: Подключиться к серверу

```bash
ssh root@89.169.1.53
# или
ssh user@89.169.1.53
```

#### Шаг 2: Установить зависимости (если не установлены)

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo apt install docker-compose -y

# Добавить пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER
newgrp docker

# Проверить установку
docker --version
docker-compose --version
```

#### Шаг 3: Клонировать репозиторий

```bash
# Выбрать директорию для проекта
cd /var/www/  # или ~/projects/ или /opt/

# Клонировать репозиторий
git clone https://github.com/your-username/911-frontend.git
cd 911-frontend
```

#### Шаг 4: Создать `.env.production`

```bash
# Создать файл с переменными окружения
cat > .env.production <<EOF
VITE_API_BASE_URL=http://45.144.221.92
NODE_ENV=production
EOF
```

#### Шаг 5: Запустить без SSL

```bash
# Собрать и запустить production контейнер
docker-compose -f docker-compose.prod.yml up -d --build

# Проверить статус
docker-compose -f docker-compose.prod.yml ps

# Проверить логи
docker-compose -f docker-compose.prod.yml logs -f frontend

# Открыть в браузере: http://89.169.1.53
```

#### Шаг 6: (Опционально) Настроить SSL

```bash
# 1. Остановить контейнеры
docker-compose -f docker-compose.prod.yml down

# 2. Установить Certbot
sudo apt install certbot -y

# 3. Получить SSL сертификат
sudo certbot certonly --standalone \
  -d 89.169.1.53 \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# 4. Создать директории и скопировать сертификаты
mkdir -p ssl certbot/www
sudo cp /etc/letsencrypt/live/89.169.1.53/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/89.169.1.53/privkey.pem ./ssl/
sudo chown -R $USER:$USER ./ssl
chmod 644 ./ssl/*.pem

# 5. Заменить Nginx конфиг на SSL версию
cp nginx-ssl.conf nginx.conf

# 6. Обновить docker-compose на SSL версию
cp docker-compose.prod-ssl.yml docker-compose.prod.yml

# 7. Запустить с SSL
docker-compose -f docker-compose.prod.yml up -d --build

# 8. Открыть в браузере: https://89.169.1.53
```

#### Шаг 7: Настроить автообновление

```bash
# Создать скрипт для обновления
cat > update.sh <<'EOF'
#!/bin/bash
cd /var/www/911-frontend
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
EOF

chmod +x update.sh

# Теперь для обновления просто:
# ./update.sh
```

---

## CI/CD рекомендации

### Вариант 1: Ручной деплой через Git

```bash
# На сервере
cd /var/www/911-frontend
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

### Вариант 2: GitHub Actions (автоматический деплой)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: 89.169.1.53
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/911-frontend
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

**Настройка секретов в GitHub:**
1. Перейти в Settings → Secrets and variables → Actions
2. Добавить:
   - `SSH_USERNAME`: имя пользователя на сервере
   - `SSH_PRIVATE_KEY`: приватный SSH ключ для доступа к серверу

### Вариант 3: GitLab CI/CD

Создайте `.gitlab-ci.yml`:

```yaml
stages:
  - deploy

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SSH_USER@89.169.1.53 "
        cd /var/www/911-frontend &&
        git pull origin main &&
        docker-compose -f docker-compose.prod.yml up -d --build
      "
  only:
    - main
```

---

## Troubleshooting

### Проблема 1: `Failed to fetch dynamically imported module`

**Причина**: Несоответствие версий node_modules между хостом и контейнером.

**Решение**:
```bash
# Development
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build

# Production
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Проблема 2: Порт уже занят

**Ошибка**: `Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use`

**Решение**:
```bash
# Найти процесс, использующий порт
sudo lsof -i :80
# или
sudo netstat -tulpn | grep :80

# Убить процесс
sudo kill -9 <PID>

# Или изменить порт в docker-compose.prod.yml
ports:
  - "8080:80"  # Использовать 8080 вместо 80
```

### Проблема 3: API запросы не работают (CORS)

**Причина**: Backend не настроен для приема запросов с вашего домена.

**Решение 1**: Настроить CORS на backend (предпочтительно)
```javascript
// На backend (Node.js/Express пример)
app.use(cors({
  origin: ['http://89.169.1.53', 'https://89.169.1.53'],
  credentials: true
}));
```

**Решение 2**: Использовать Nginx proxy (на frontend)
В `nginx.conf` раскомментируйте секцию:
```nginx
location /api/ {
    proxy_pass http://45.144.221.92/;
    # ... остальные настройки proxy
}
```

И измените `VITE_API_BASE_URL` на относительный путь:
```env
VITE_API_BASE_URL=/api
```

### Проблема 4: SSL сертификат не работает

**Ошибка**: `NET::ERR_CERT_AUTHORITY_INVALID`

**Решение**:
```bash
# Проверить наличие сертификатов
ls -la ssl/

# Проверить права доступа
chmod 644 ssl/*.pem

# Проверить правильность путей в nginx-ssl.conf
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;

# Пересоздать контейнер
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Проблема 5: Health check fails

**Ошибка**: `Unhealthy` статус контейнера

**Решение**:
```bash
# Проверить логи
docker-compose -f docker-compose.prod.yml logs frontend

# Проверить endpoint вручную
docker-compose -f docker-compose.prod.yml exec frontend wget -O- http://localhost/health

# Если endpoint не работает, временно отключить healthcheck
# В docker-compose.prod.yml закомментировать секцию healthcheck
```

### Проблема 6: Изменения не применяются после rebuild

**Причина**: Docker использует старый кеш

**Решение**:
```bash
# Пересобрать без кеша
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Или очистить все
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### Проблема 7: Out of memory при сборке

**Ошибка**: `npm ERR! code ENOMEM`

**Решение**:
```bash
# Увеличить swap на сервере
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Или собрать образ локально и загрузить на Docker Hub
# Локально:
docker build -t your-username/911-frontend:latest .
docker push your-username/911-frontend:latest

# На сервере:
docker pull your-username/911-frontend:latest
docker tag your-username/911-frontend:latest 911_frontend_prod
docker-compose -f docker-compose.prod.yml up -d
```

---

## Контрольный чеклист

### Development ✅

- [ ] Создан `Dockerfile.dev`
- [ ] Создан `docker-compose.dev.yml`
- [ ] Создан `.env.development` с `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Используется named volume для `node_modules`
- [ ] Hot reload работает (изменения применяются без пересборки)
- [ ] Приложение доступно на `http://localhost:3000`
- [ ] API запросы идут на `http://localhost:8000`

### Production (без SSL) ✅

- [ ] Создан `Dockerfile` (multi-stage build)
- [ ] Создан `docker-compose.prod.yml`
- [ ] Создан `nginx.conf`
- [ ] Создан `.env.production` с `VITE_API_BASE_URL=http://45.144.221.92`
- [ ] Healthcheck настроен
- [ ] Приложение собирается без ошибок
- [ ] Приложение доступно на `http://89.169.1.53`
- [ ] API запросы идут на `http://45.144.221.92`
- [ ] Gzip compression включен
- [ ] Security headers добавлены
- [ ] SPA routing работает (обновление страницы не дает 404)

### Production (с SSL) ✅

- [ ] SSL сертификаты получены (Let's Encrypt или другой CA)
- [ ] Сертификаты скопированы в `./ssl/`
- [ ] Создан `nginx-ssl.conf`
- [ ] Создан `docker-compose.prod-ssl.yml`
- [ ] HTTP → HTTPS редирект работает
- [ ] HTTPS сайт доступен на `https://89.169.1.53`
- [ ] SSL Labs дает оценку A или выше (проверить на https://www.ssllabs.com/ssltest/)
- [ ] HSTS header добавлен
- [ ] Настроено автообновление сертификатов (cron)

### Дополнительно ✅

- [ ] `.env.production` добавлен в `.gitignore`
- [ ] `ssl/` директория добавлена в `.gitignore`
- [ ] Настроен мониторинг (uptimerobot, pingdom и т.д.)
- [ ] Настроен CI/CD (GitHub Actions, GitLab CI и т.д.)
- [ ] Создан скрипт для быстрого обновления (`update.sh`)
- [ ] Документация обновлена с актуальными URL и портами

---

## Полезные команды

### Docker

```bash
# Просмотр запущенных контейнеров
docker ps

# Просмотр всех контейнеров (включая остановленные)
docker ps -a

# Просмотр логов контейнера
docker logs <container_id> -f

# Остановить контейнер
docker stop <container_id>

# Удалить контейнер
docker rm <container_id>

# Удалить образ
docker rmi <image_id>

# Очистить неиспользуемые ресурсы
docker system prune -a

# Зайти в контейнер
docker exec -it <container_id> sh
```

### Docker Compose

```bash
# Запустить
docker-compose -f <file.yml> up -d

# Остановить
docker-compose -f <file.yml> down

# Пересобрать и запустить
docker-compose -f <file.yml> up -d --build

# Просмотр логов
docker-compose -f <file.yml> logs -f <service_name>

# Проверить статус
docker-compose -f <file.yml> ps

# Перезапустить сервис
docker-compose -f <file.yml> restart <service_name>

# Остановить и удалить volumes
docker-compose -f <file.yml> down -v
```

### Git

```bash
# Клонировать репозиторий
git clone <repo_url>

# Получить последние изменения
git pull origin main

# Посмотреть статус
git status

# Посмотреть историю коммитов
git log --oneline -10

# Откатиться на определенный коммит
git checkout <commit_hash>
```

### Nginx

```bash
# Проверить конфигурацию Nginx
nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx

# Посмотреть логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## Заключение

Этот план содержит всё необходимое для настройки деплоя вашего проекта 911 Автопомощь:

1. ✅ **Development-конфигурация** для локальной разработки (`localhost:3000`)
2. ✅ **Production-конфигурация** без SSL (`http://89.169.1.53`)
3. ✅ **Production-конфигурация** с SSL (`https://89.169.1.53`)
4. ✅ Настройки портов, окружения, переменных
5. ✅ Nginx конфигурации для SPA routing, gzip, security headers
6. ✅ Health checks и restart policies
7. ✅ Troubleshooting и решение типичных проблем
8. ✅ CI/CD рекомендации

### Рекомендуемый порядок действий:

1. **Локально**: Настроить dev-окружение → протестировать → закоммитить
2. **Локально**: Настроить prod-окружение (без SSL) → протестировать локально → закоммитить
3. **На сервере**: Развернуть без SSL → протестировать → убедиться что всё работает
4. **На сервере**: Настроить SSL → протестировать → проверить сертификаты
5. **Опционально**: Настроить CI/CD для автоматического деплоя

### Если возникнут вопросы:

- Проверьте раздел [Troubleshooting](#troubleshooting)
- Посмотрите логи: `docker-compose logs -f frontend`
- Проверьте healthcheck: `docker-compose ps`
- Зайдите в контейнер для отладки: `docker exec -it 911_frontend_prod sh`

Удачи с деплоем! 🚀

