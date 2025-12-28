/**
 * App Links Utilities
 * 
 * Функции для обработки данных о ссылках на приложения
 */

import type { AppLink } from '@/lib/api/generated'

// Re-export enums for convenience
export { AppTypeEnum, PlatformEnum } from '@/lib/api/generated'

/**
 * Карта ссылок по платформам
 */
export interface AppLinksByPlatform {
  ios?: AppLink
  android?: AppLink
}

/**
 * Сравнивает версии в формате semver (1.0.0, 2.1.3 и т.д.)
 * Возвращает:
 *  - положительное число если a > b
 *  - отрицательное число если a < b
 *  - 0 если равны
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number)
  const partsB = b.split('.').map(Number)
  
  const maxLength = Math.max(partsA.length, partsB.length)
  
  for (let i = 0; i < maxLength; i++) {
    const numA = partsA[i] ?? 0
    const numB = partsB[i] ?? 0
    
    if (numA !== numB) {
      return numA - numB
    }
  }
  
  return 0
}

/**
 * Получает ссылки на приложения по типу (client/partner)
 * 
 * Логика:
 * 1. Фильтрует по is_active === true и app_type
 * 2. Дедуплицирует по платформе, оставляя ссылку с максимальной версией
 * 3. Возвращает объект { ios?: AppLink, android?: AppLink }
 * 
 * @param data - массив AppLink из API
 * @param appType - тип приложения ('client' | 'partner')
 * @returns объект с ссылками по платформам
 */
export function getAppLinksByType(
  data: AppLink[],
  appType: 'client' | 'partner'
): AppLinksByPlatform {
  // Фильтруем по is_active и app_type
  const filtered = data.filter(
    (link) => link.is_active !== false && link.app_type === appType
  )

  // Группируем по платформе и выбираем с максимальной версией
  const result: AppLinksByPlatform = {}

  for (const link of filtered) {
    const platform = link.platform as 'ios' | 'android'
    const existing = result[platform]

    if (!existing) {
      // Первая ссылка для этой платформы
      result[platform] = link
    } else if (link.version && existing.version) {
      // Сравниваем версии, берём большую
      if (compareVersions(link.version, existing.version) > 0) {
        result[platform] = link
      }
    } else if (link.version && !existing.version) {
      // Предпочитаем ссылку с указанной версией
      result[platform] = link
    }
    // Если у обоих нет версии или у existing есть, а у link нет — оставляем existing
  }

  return result
}

/**
 * Определяет, какой QR-код показывать
 * Приоритет: iOS > Android
 * 
 * @param links - объект с ссылками по платформам
 * @returns AppLink с qr_code_url или undefined
 */
export function getPreferredQrLink(links: AppLinksByPlatform): AppLink | undefined {
  // Приоритет iOS
  if (links.ios?.qr_code_url) {
    return links.ios
  }
  // Fallback на Android
  if (links.android?.qr_code_url) {
    return links.android
  }
  return undefined
}

/**
 * Проверяет, есть ли хотя бы одна активная ссылка
 */
export function hasAnyLink(links: AppLinksByPlatform): boolean {
  return Boolean(links.ios || links.android)
}

/**
 * Проверяет, есть ли QR-код для отображения
 */
export function hasQrCode(links: AppLinksByPlatform): boolean {
  return Boolean(links.ios?.qr_code_url || links.android?.qr_code_url)
}

