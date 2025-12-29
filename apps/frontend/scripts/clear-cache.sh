#!/bin/bash
# Script to clear Next.js and Tailwind cache

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🧹 Clearing node_modules/.cache..."
rm -rf node_modules/.cache

echo "✅ Cache cleared! Now restart your dev server:"
echo "   npm run dev"

