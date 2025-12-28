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
