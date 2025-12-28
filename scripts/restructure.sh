#!/bin/bash
set -e

echo "🔄 Начинаем реорганизацию структуры проекта..."

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="/Users/mak/Desktop/web_911"
cd "$PROJECT_ROOT"

# Функция для создания директории
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo -e "${GREEN}✓${NC} Создана директория: $1"
    fi
}

# Функция для перемещения файла/директории
move_item() {
    if [ -e "$1" ]; then
        mv "$1" "$2"
        echo -e "${GREEN}✓${NC} Перемещено: $1 → $2"
    else
        echo -e "${YELLOW}⚠${NC} Не найдено: $1"
    fi
}

echo ""
echo -e "${BLUE}=== Этап 1: Создание новой структуры директорий ===${NC}"

# Создаем новую структуру
create_dir "apps/frontend"
create_dir "deploy/docker/frontend"
create_dir "deploy/docker/nginx"
create_dir "docs/api"
create_dir "docs/design"
create_dir "docs/guides"
create_dir "docs/summaries"
create_dir "scripts"

echo ""
echo -e "${BLUE}=== Этап 2: Перемещение frontend приложения ===${NC}"

# Перемещаем содержимое frontend
if [ -d "frontend" ]; then
    echo "Перемещаем frontend файлы..."
    
    # Основные директории и файлы
    move_item "frontend/src" "apps/frontend/"
    move_item "frontend/public" "apps/frontend/"
    move_item "frontend/package.json" "apps/frontend/"
    move_item "frontend/package-lock.json" "apps/frontend/"
    move_item "frontend/tsconfig.json" "apps/frontend/"
    move_item "frontend/next.config.ts" "apps/frontend/"
    move_item "frontend/next-env.d.ts" "apps/frontend/"
    move_item "frontend/components.json" "apps/frontend/"
    move_item "frontend/eslint.config.mjs" "apps/frontend/"
    move_item "frontend/postcss.config.mjs" "apps/frontend/"
    
    # Dockerfile
    move_item "frontend/Dockerfile" "deploy/docker/frontend/Dockerfile"
    
    # Документация
    move_item "frontend/README.md" "apps/frontend/"
    move_item "frontend/API_SETUP.md" "docs/guides/api-setup.md"
    move_item "frontend/UI_KIT.md" "docs/guides/ui-kit.md"
    move_item "frontend/DESIGN_SYSTEM_RULES.md" "docs/design/design-system-rules.md"
fi

echo ""
echo -e "${BLUE}=== Этап 3: Перемещение Docker конфигураций ===${NC}"

move_item "docker-compose.yml" "deploy/"
move_item "docker-compose.dev.yml" "deploy/"
move_item "docker-compose.prod.yml" "deploy/"

echo ""
echo -e "${BLUE}=== Этап 4: Перемещение Nginx ===${NC}"

if [ -d "nginx" ]; then
    move_item "nginx/nginx.conf" "deploy/docker/nginx/"
    move_item "nginx/ssl" "deploy/docker/nginx/"
    move_item "nginx/logs" "deploy/docker/nginx/"
fi

echo ""
echo -e "${BLUE}=== Этап 5: Реорганизация документации ===${NC}"

# API спецификация
move_item "docs/911 Corporate Website API (1).yaml" "docs/api/openapi.yaml"

# Дизайн концепты
move_item "docs/APP_LANDING_DESIGN_CONCEPT.md" "docs/design/landing-concept.md"

# Summary документы
move_item "BUTTON_PADDING_UPDATE.md" "docs/summaries/button-padding-update.md"
move_item "DESIGN_UPDATE_SUMMARY.md" "docs/summaries/design-update-summary.md"
move_item "GRID_FIX_SUMMARY.md" "docs/summaries/grid-fix-summary.md"
move_item "IMPLEMENTATION_SUMMARY.md" "docs/summaries/implementation-summary.md"
move_item "PROJECT_RESTRUCTURE_PLAN.md" "docs/guides/project-structure.md"

echo ""
echo -e "${BLUE}=== Этап 6: Создание .env.example ===${NC}"

if [ ! -f "apps/frontend/.env.example" ]; then
    cat > "apps/frontend/.env.example" << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
NEXT_PUBLIC_APP_NAME=911

# Analytics (optional)
NEXT_PUBLIC_YM_ID=

# Feature Flags
NEXT_PUBLIC_FEATURE_REVIEWS=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true
EOF
    echo -e "${GREEN}✓${NC} Создан .env.example"
fi

echo ""
echo -e "${BLUE}=== Этап 7: Создание вспомогательных скриптов ===${NC}"

# Скрипт для генерации API клиента
cat > "scripts/generate-api-client.sh" << 'EOF'
#!/bin/bash
# Генерация TypeScript клиента из OpenAPI спецификации

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

echo "🔄 Генерация API клиента..."

cd "$PROJECT_ROOT/apps/frontend"
npx openapi-typescript-codegen \
  --input "$PROJECT_ROOT/docs/api/openapi.yaml" \
  --output ./src/lib/api/generated \
  --client fetch

echo "✅ API клиент сгенерирован"
EOF

chmod +x "scripts/generate-api-client.sh"
echo -e "${GREEN}✓${NC} Создан scripts/generate-api-client.sh"

# Скрипт для настройки dev окружения
cat > "scripts/dev-setup.sh" << 'EOF'
#!/bin/bash
# Настройка окружения для разработки

cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

echo "🚀 Настройка окружения для разработки..."

# Установка зависимостей
echo "📦 Установка зависимостей..."
cd "$PROJECT_ROOT/apps/frontend"
npm install

# Создание .env.local если не существует
if [ ! -f ".env.local" ]; then
    echo "📝 Создание .env.local..."
    cp .env.example .env.local
fi

echo ""
echo "✅ Окружение настроено!"
echo ""
echo "Следующие шаги:"
echo "  1. Отредактируйте apps/frontend/.env.local"
echo "  2. Запустите: cd apps/frontend && npm run dev"
echo ""
EOF

chmod +x "scripts/dev-setup.sh"
echo -e "${GREEN}✓${NC} Создан scripts/dev-setup.sh"

echo ""
echo -e "${BLUE}=== Этап 8: Очистка старых директорий ===${NC}"

# Удаляем пустые директории
if [ -d "frontend" ] && [ -z "$(ls -A frontend 2>/dev/null)" ]; then
    rm -rf "frontend"
    echo -e "${GREEN}✓${NC} Удалена пустая директория frontend/"
fi

if [ -d "nginx" ] && [ -z "$(ls -A nginx 2>/dev/null)" ]; then
    rm -rf "nginx"
    echo -e "${GREEN}✓${NC} Удалена пустая директория nginx/"
fi

if [ -d "docs" ] && [ -z "$(ls -A docs 2>/dev/null)" ]; then
    rm -rf "docs"
    echo -e "${GREEN}✓${NC} Удалена пустая директория docs/"
fi

echo ""
echo -e "${GREEN}=== ✅ Реорганизация завершена! ===${NC}"
echo ""
echo "Новая структура проекта:"
echo "  📁 apps/frontend/        - Next.js приложение"
echo "  📁 deploy/               - Docker и Nginx конфигурации"
echo "  📁 docs/                 - Документация"
echo "  📁 scripts/              - Утилиты"
echo ""
echo "Следующие шаги:"
echo "  1. Обновите пути в docker-compose файлах"
echo "  2. Запустите: ./scripts/dev-setup.sh"
echo "  3. Проверьте работу: cd apps/frontend && npm run dev"
echo ""

