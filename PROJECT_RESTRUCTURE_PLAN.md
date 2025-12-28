# Реорганизация структуры проекта 911

## Текущие проблемы

1. Docker-compose файлы на верхнем уровне, но относятся к развертыванию
2. Nginx конфигурация на верхнем уровне, но используется только в production
3. Frontend в подпапке, хотя это единственное приложение
4. Документация разбросана по разным уровням
5. Нет четкого разделения между dev/prod конфигурациями

## Целевая структура

```
web_911/                          # Корень проекта
├── README.md                     # Главный README
├── .gitignore                    # Общий gitignore
│
├── apps/                         # Приложения (монорепо-подход)
│   └── frontend/                 # Next.js приложение
│       ├── src/                  # Исходный код
│       ├── public/               # Статические файлы
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── Dockerfile            # Development Dockerfile
│       ├── .env.example          # Пример переменных окружения
│       └── README.md
│
├── deploy/                       # Развертывание и конфигурация
│   ├── docker/                   # Docker конфигурации
│   │   ├── frontend/
│   │   │   ├── Dockerfile.dev    # Dev сборка
│   │   │   └── Dockerfile.prod   # Production сборка
│   │   └── nginx/
│   │       ├── nginx.conf
│   │       ├── nginx.dev.conf
│   │       └── ssl/
│   │           └── README.md
│   │
│   ├── docker-compose.yml        # Локальная разработка
│   ├── docker-compose.dev.yml    # Dev окружение
│   └── docker-compose.prod.yml   # Production окружение
│
├── docs/                         # Вся документация
│   ├── api/                      # API спецификации
│   │   └── openapi.yaml          # OpenAPI спецификация
│   ├── design/                   # Дизайн и концепты
│   │   └── landing-concept.md
│   ├── guides/                   # Руководства
│   │   ├── api-setup.md
│   │   ├── deployment.md
│   │   └── ui-kit.md
│   └── architecture/             # Архитектура
│       ├── frontend.md
│       └── infrastructure.md
│
├── scripts/                      # Утилиты и скрипты
│   ├── generate-api-client.sh    # Генерация API клиента
│   ├── setup-dev.sh              # Настройка dev окружения
│   └── deploy.sh                 # Скрипты деплоя
│
└── .github/                      # CI/CD (если используете GitHub)
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

## План миграции

### Этап 1: Создание новой структуры

1. Создать папки:
   - `apps/frontend/`
   - `deploy/docker/`
   - `deploy/docker/frontend/`
   - `deploy/docker/nginx/`
   - `docs/api/`
   - `docs/design/`
   - `docs/guides/`
   - `scripts/`

### Этап 2: Перемещение файлов

2. Переместить frontend:
   ```bash
   # Переместить содержимое frontend → apps/frontend
   mv frontend/src apps/frontend/
   mv frontend/public apps/frontend/
   mv frontend/package*.json apps/frontend/
   mv frontend/tsconfig.json apps/frontend/
   mv frontend/next.config.ts apps/frontend/
   # ... остальные конфигурационные файлы
   ```

3. Переместить Docker конфигурации:
   ```bash
   mv docker-compose*.yml deploy/
   mv frontend/Dockerfile deploy/docker/frontend/Dockerfile.dev
   # Создать Dockerfile.prod для production
   ```

4. Переместить Nginx:
   ```bash
   mv nginx/* deploy/docker/nginx/
   ```

5. Реорганизовать документацию:
   ```bash
   mv docs/911\ Corporate\ Website\ API\ \(1\).yaml docs/api/openapi.yaml
   mv docs/APP_LANDING_DESIGN_CONCEPT.md docs/design/landing-concept.md
   mv frontend/API_SETUP.md docs/guides/api-setup.md
   mv frontend/UI_KIT.md docs/guides/ui-kit.md
   ```

### Этап 3: Обновление путей

6. Обновить docker-compose файлы:
   - Изменить пути к Dockerfile
   - Обновить volume mappings
   - Исправить context paths

7. Обновить README файлы:
   - Обновить инструкции с новыми путями
   - Добавить навигацию по документации

### Этап 4: Очистка

8. Удалить старые папки:
   ```bash
   rm -rf frontend/  # После переноса всего содержимого
   rm -rf nginx/     # После переноса в deploy/
   ```

## Преимущества новой структуры

### ✅ Для разработчика

- **Понятная иерархия**: четкое разделение приложений, конфигураций, документации
- **Масштабируемость**: легко добавить backend, admin-panel и другие приложения
- **Изолированные окружения**: dev/prod конфигурации отдельно
- **Централизованная документация**: вся документация в одном месте

### ✅ Для DevOps

- **Организованный деплой**: все конфигурации деплоя в `deploy/`
- **Переиспользуемые скрипты**: утилиты в `scripts/`
- **Четкое разделение**: development vs production конфигурации

### ✅ Для команды

- **Onboarding**: новому разработчику легко понять структуру
- **Поддержка**: логическая организация упрощает поиск файлов
- **Консистентность**: единый подход к организации кода

## Альтернативный вариант (упрощенный)

Если монорепо избыточен, можно использовать более простую структуру:

```
web_911/
├── src/              # Frontend код (вместо apps/frontend/src)
├── public/
├── deploy/           # Docker + nginx
├── docs/
├── scripts/
├── package.json
└── README.md
```

## Дополнительные улучшения

### .gitignore structure

```gitignore
# Dependencies
node_modules/
npm-debug.log*

# Production builds
.next/
out/
dist/
build/

# Environment files
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Docker
docker-compose.override.yml
```

### Структура scripts/

```bash
scripts/
├── dev-setup.sh          # Установка зависимостей, настройка .env
├── generate-api.sh       # Генерация TypeScript клиента из OpenAPI
├── build-dev.sh          # Сборка dev образов
├── build-prod.sh         # Сборка prod образов
├── start-dev.sh          # Запуск dev окружения
└── deploy-prod.sh        # Деплой на prod
```

## Следующие шаги

1. **Создать резервную копию**:
   ```bash
   cp -r /Users/mak/Desktop/web_911 /Users/mak/Desktop/web_911_backup
   ```

2. **Выбрать структуру**: монорепо (apps/) или упрощенная

3. **Выполнить миграцию** по этапам

4. **Протестировать** работу после миграции

5. **Обновить CI/CD** (если есть)

