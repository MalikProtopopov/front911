# Логика вывода опций с ценами на странице услуги в городе

## 📋 Обзор

Документ описывает полную логику вывода опций услуг с ценами на странице `/cities/[slug]/services/[serviceSlug]`. Реализация включает загрузку всех цен для каждой опции через `/api/website/options/{id}/`, группировку опций по категориям техники и отображение в виде аккордеона.

---

## 🗂️ Структура файлов

### Основные файлы:

1. **Компонент страницы:**
   - `apps/frontend/src/app/cities/[slug]/services/[serviceSlug]/CityServiceContent.tsx`
   - Основной компонент для отображения услуги в городе

2. **API сервис:**
   - `apps/frontend/src/lib/api/services/cities.service.ts`
   - Определение типов и методы для работы с API
   - Загрузка всех цен через `/api/website/options/{id}/`

3. **Хук для данных:**
   - `apps/frontend/src/lib/api/hooks/useCities.ts`
   - Хук `useCityService` для загрузки данных

4. **Страница Next.js:**
   - `apps/frontend/src/app/cities/[slug]/services/[serviceSlug]/page.tsx`
   - Server Component обертка

---

## 📊 Структура данных

### Интерфейс цены (`OptionPrice`)

```typescript
interface OptionPrice {
  id: number                          // ID цены
  city_slug: string                   // Slug города
  city_title: string                  // Название города
  technic_category_id: number | null  // ID категории техники
  technic_category_title: string | null // Название категории техники
  amount: string                      // Цена в формате "500.00"
}
```

### Интерфейс опции (`CityServiceOption`)

```typescript
interface CityServiceOption {
  id: number                    // Уникальный ID опции
  title: string                 // Название опции (например, "Балансировка колеса")
  service_id: number            // ID услуги
  service_title: string         // Название услуги
  service_slug: string          // Slug услуги
  is_active: boolean           // Активна ли опция
  // Legacy single price (from base endpoint - only one price per option)
  price: {
    amount: string              // Сумма в формате "500.00"
    technic_category: string | null  // Категория техники (fallback)
  } | null
  // All prices for this option in the current city (from /api/website/options/{id}/)
  prices: OptionPrice[]         // МАССИВ всех цен для опции в текущем городе
}
```

**✅ Важно:** 
- Каждая опция имеет **МАССИВ цен** (`prices: OptionPrice[]`)
- Цены загружаются через `/api/website/options/{id}/` для каждой опции
- Цены фильтруются по текущему городу (`city_slug`)
- Опция может иметь цены для разных категорий техники
- Опция может появляться в нескольких категориях аккордеона

### Интерфейс ответа API (`CityServiceResponse`)

```typescript
interface CityServiceResponse {
  city: {
    id: number
    title: string
    slug: string
    partner_count: number
  }
  service: {
    id: number
    title: string
    slug: string
    icon_url?: string
    options_count: number
  }
  options: CityServiceOption[]  // Массив опций с массивом цен каждая
  content: { ... } | null       // HTML контент страницы
  seo: { ... } | null           // SEO метаданные
}
```

---

## 🔄 Поток данных

### 1. Загрузка базовой информации

**API запрос:**
```
GET /api/website/cities/{city_slug}/services/{service_slug}/
```

**Реализация:**
```typescript
// apps/frontend/src/lib/api/services/cities.service.ts
getServiceByCity: async (citySlug, serviceSlug) => {
  // Step 1: Get base information with options (each has only one price)
  const response = await Service.websiteCitiesServicesRetrieve(citySlug, serviceSlug)
  const baseOptions = Array.isArray(response?.options) ? response.options : []
  
  // Step 2: Load all prices for each option in parallel
  const optionsWithAllPrices = await Promise.all(
    baseOptions.map(async (option) => {
      // Get all prices for this option
      const optionDetail = await contentService.getOptionById(option.id)
      
      // Filter prices only for the current city
      const cityPrices = optionDetail.prices.filter(
        price => price.city_slug === citySlug
      )
      
      return {
        ...option,
        prices: cityPrices, // All prices for this city
      } as CityServiceOption
    })
  )
  
  return {
    ...response,
    options: optionsWithAllPrices,
  } as CityServiceResponse
}
```

**Процесс:**
1. Загружается базовая информация об услуге в городе
2. Для каждой опции параллельно загружаются все цены через `/api/website/options/{id}/`
3. Цены фильтруются по текущему городу
4. Возвращаются опции с полным массивом цен

### 2. Обработка данных

**Хук возвращает:**
```typescript
const {
  city,           // Город
  service,        // Услуга
  options,        // Массив опций с массивом цен каждая
  content,        // Контент
  seo,            // SEO
  isLoading,      // Загрузка
  isError,        // Ошибка
  error           // Объект ошибки
} = useCityService(citySlug, serviceSlug)
```

---

## 🎯 Логика группировки опций

### Функция `groupOptionsByCategory()`

**Расположение:** `CityServiceContent.tsx`, строки 35-83

**Логика:**

```typescript
function groupOptionsByCategory(options: CityServiceOption[]) {
  const grouped: Record<string, CityServiceOption[]> = {}
  const uncategorized: CityServiceOption[] = []
  const categorySet = new Set<string>()

  options.forEach(option => {
    // Check if option has prices
    if (option.prices && option.prices.length > 0) {
      // Group by technic_category_title from prices
      const categoriesInOption = new Set<string>()
      
      option.prices.forEach(price => {
        if (price.technic_category_title) {
          categoriesInOption.add(price.technic_category_title)
          categorySet.add(price.technic_category_title)
        }
      })
      
      // If option has prices with categories, add to those categories
      if (categoriesInOption.size > 0) {
        categoriesInOption.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = []
          }
          // Only add option once per category (avoid duplicates)
          if (!grouped[category].find(opt => opt.id === option.id)) {
            grouped[category].push(option)
          }
        })
      } else {
        // Option has prices but no categories
        uncategorized.push(option)
      }
    } else if (option.price?.technic_category) {
      // Fallback to legacy single price structure
      const category = option.price.technic_category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(option)
      categorySet.add(category)
    } else {
      // Option has no prices or categories
      uncategorized.push(option)
    }
  })

  return { grouped, uncategorized, categoryNames: Array.from(categorySet).sort() }
}
```

**Результат:**
- `grouped` - объект, где ключ = название категории, значение = массив опций
- `uncategorized` - массив опций без категории
- `categoryNames` - отсортированный массив названий категорий

**Особенности:**
- Опция может быть в нескольких категориях, если у неё есть цены для разных категорий
- Опция добавляется в категорию только один раз (проверка на дубликаты)
- Поддержка fallback на legacy структуру с одной ценой

**Пример:**
```typescript
// Входные данные:
options = [
  {
    id: 1,
    title: "Балансировка колеса",
    prices: [
      { amount: "500", technic_category_title: "Грузовой автомобиль" },
      { amount: "300", technic_category_title: "Легковой автомобиль" }
    ]
  },
  {
    id: 2,
    title: "Шиномонтаж R13-R15",
    prices: [
      { amount: "300", technic_category_title: "Легковой автомобиль" }
    ]
  },
  {
    id: 3,
    title: "Ремонт прокола",
    prices: [
      { amount: "400", technic_category_title: "Грузовой автомобиль" }
    ]
  },
  {
    id: 4,
    title: "Диагностика",
    prices: [
      { amount: "200", technic_category_title: null }
    ]
  }
]

// Результат:
{
  grouped: {
    "Грузовой автомобиль": [опция1, опция3],  // Опция1 есть в двух категориях!
    "Легковой автомобиль": [опция1, опция2]
  },
  uncategorized: [опция4],
  categoryNames: ["Грузовой автомобиль", "Легковой автомобиль"]
}
```

**Использование:**
```typescript
const { grouped, uncategorized, categoryNames } = useMemo(() => {
  return groupOptionsByCategory(options)
}, [options])
```

---

## 🎨 Компоненты отображения

### 1. Компонент `PriceRow`

**Назначение:** Отображение одной опции с ценой в виде строки

**Параметры:**
```typescript
{
  title: string              // Название опции
  price: string | number     // Цена в формате "500.00"
  description?: string       // Опциональное описание
}
```

**Структура:**
```
┌─────────────────────────────────────────┐
│ Название опции             500 ₽        │
└─────────────────────────────────────────┘
```

**Код:**
```typescript
// apps/frontend/src/components/ui/price-accordion.tsx
export function PriceRow({ 
  title, 
  price, 
  description,
  className 
}: PriceRowProps) {
  return (
    <div className={cn(
      'flex items-center justify-between py-4 px-5',
      'hover:bg-[var(--background-secondary)] transition-colors duration-150',
      className
    )}>
      <div className="flex-grow pr-4">
        <p className="text-[var(--foreground-primary)] font-medium">
          {title}
        </p>
        {description && (
          <p className="text-sm text-[var(--foreground-tertiary)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="font-semibold text-[var(--color-primary)] whitespace-nowrap">
          {formatPrice(price)}
        </span>
      </div>
    </div>
  )
}
```

### 2. Компонент `PriceAccordionCategory`

**Назначение:** Аккордеон-карточка для группы опций одной категории

**Параметры:**
```typescript
{
  value: string              // Уникальное значение для аккордеона
  title: string              // Название категории
  count?: number             // Количество опций в категории
  icon?: React.ReactNode     // Иконка категории
  children: React.ReactNode  // Содержимое (список опций)
}
```

**Структура:**
```
┌─────────────────────────────────────────┐
│ 🚚 Грузовой автомобиль (2 опции)    ▼   │ ← Заголовок (кликабельный)
├─────────────────────────────────────────┤
│ Балансировка колеса           500 ₽     │
│ Ремонт прокола                 400 ₽     │
└─────────────────────────────────────────┘
```

### 3. Функция форматирования цены `formatPrice()`

**Код:**
```typescript
// apps/frontend/src/components/ui/price-accordion.tsx
export function formatPrice(amount: number | string | null | undefined): string {
  if (!amount) return 'По запросу'
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return 'По запросу'
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}
```

**Примеры:**
- `"500.00"` → `"500 ₽"`
- `"1500.50"` → `"1 501 ₽"`
- `null` → `"По запросу"`

---

## 🖼️ Рендеринг на странице

### Структура секции с ценами

**Расположение:** `CityServiceContent.tsx`, строки 200-290

**Код:**
```typescript
{/* Options with prices */}
<div className="py-8 md:py-12">
  {/* Заголовок секции */}
  <PriceSectionHeader 
    title={`Цены на ${service.title}`}
    totalCount={options?.length ?? 0}
  />

  {!options || options.length === 0 || (categoryNames.length === 0 && uncategorized.length === 0) ? (
    <PriceEmptyState message="Цены для данной услуги в этом городе пока не указаны.">
      <Button asChild>
        <Link href="/contacts">Узнать цены</Link>
      </Button>
    </PriceEmptyState>
  ) : (
    <PriceAccordion 
      type="multiple" 
      defaultValue={categoryNames.length > 0 ? [`category-0`] : uncategorized.length > 0 ? ['uncategorized'] : []}
    >
      {/* Options grouped by category */}
      {categoryNames.map((category, index) => {
        const categoryOptions = grouped[category] || []
        return (
          <PriceAccordionCategory
            key={category}
            value={`category-${index}`}
            title={category}
            count={categoryOptions.length}
            icon={<Truck />}
          >
            {categoryOptions.map(option => {
              // Filter prices for this specific category
              const categoryPrices = option.prices?.filter(
                price => price.technic_category_title === category
              ) || []
              
              // If no prices in prices array, fallback to legacy price
              const pricesToShow: OptionPrice[] = categoryPrices.length > 0 
                ? categoryPrices 
                : (option.price?.technic_category === category && option.price 
                    ? [{ /* legacy price object */ }] 
                    : [])
              
              // Show option with all prices for this category (usually one)
              if (pricesToShow.length === 0) return null
              
              return pricesToShow.map((price, priceIndex) => (
                <PriceRow 
                  key={`${option.id}-${priceIndex}`}
                  title={option.title}
                  price={price.amount}
                />
              ))
            })}
          </PriceAccordionCategory>
        )
      })}

      {/* Uncategorized options */}
      {uncategorized.length > 0 && (
        <PriceAccordionCategory
          value="uncategorized"
          title="Прочие услуги"
          count={uncategorized.length}
          icon={<Truck />}
        >
          {uncategorized.map(option => {
            // Get prices without category or fallback to legacy price
            const pricesWithoutCategory = option.prices?.filter(
              price => !price.technic_category_title
            ) || []
            
            const pricesToShow: OptionPrice[] = pricesWithoutCategory.length > 0
              ? pricesWithoutCategory
              : (option.price && !option.price.technic_category
                  ? [{ /* legacy price object */ }]
                  : [])
            
            if (pricesToShow.length === 0) return null
            
            return pricesToShow.map((price, priceIndex) => (
              <PriceRow 
                key={`${option.id}-uncategorized-${priceIndex}`}
                title={option.title}
                price={price.amount}
              />
            ))
          })}
        </PriceAccordionCategory>
      )}
    </PriceAccordion>
  )}
</div>
```

**Логика отображения:**

1. **Если опций нет** (`options.length === 0`):
   - Показывается пустое состояние с текстом и кнопкой "Узнать цены"

2. **Если опции есть**:
   - Сначала отображаются категории техники (отсортированные по алфавиту)
   - Первая категория открыта по умолчанию (`defaultValue={['category-0']}`)
   - Для каждой опции в категории фильтруются цены только для этой категории
   - Опция может иметь несколько цен в одной категории (показываются все)
   - Затем отображаются опции без категории в разделе "Прочие услуги"
   - Раздел "Прочие услуги" открыт только если нет категорий

3. **Особенности:**
   - Опция может появляться в нескольких категориях, если у неё есть цены для разных категорий
   - В каждой категории показываются только цены для этой категории
   - Если у опции нет цен для категории, она не отображается в этой категории

---

## ⚙️ Особенности реализации

### 1. Параллельная загрузка цен

```typescript
const optionsWithAllPrices = await Promise.all(
  baseOptions.map(async (option) => {
    const optionDetail = await contentService.getOptionById(option.id)
    const cityPrices = optionDetail.prices.filter(
      price => price.city_slug === citySlug
    )
    return { ...option, prices: cityPrices }
  })
)
```

Все цены загружаются параллельно для лучшей производительности.

### 2. Мемоизация группировки

```typescript
const { grouped, uncategorized, categoryNames } = useMemo(() => {
  return groupOptionsByCategory(options)
}, [options])
```

Группировка пересчитывается только при изменении `options`.

### 3. Fallback на legacy структуру

Если не удалось загрузить цены через `/api/website/options/{id}/`, используется fallback на старую структуру с одной ценой (`option.price`).

### 4. Фильтрация цен по категории

В каждой категории аккордеона показываются только цены для этой категории:

```typescript
const categoryPrices = option.prices?.filter(
  price => price.technic_category_title === category
) || []
```

### 5. Адаптивность

- Используются responsive классы: `md:py-4`, `md:text-base`
- Минимальные высоты: `min-h-[56px]`, `min-h-[64px]`
- Отступы адаптируются: `px-5`, `py-4`

---

## 📝 Примеры использования

### Пример 1: Опция с ценами для разных категорий

**Входные данные:**
```typescript
option = {
  id: 1,
  title: "Балансировка колеса",
  prices: [
    { 
      id: 181,
      amount: "500.00", 
      technic_category_title: "Грузовой автомобиль",
      city_slug: "arhangelsk"
    },
    { 
      id: 182,
      amount: "300.00", 
      technic_category_title: "Легковой автомобиль",
      city_slug: "arhangelsk"
    },
    { 
      id: 183,
      amount: "350.00", 
      technic_category_title: "Кроссовер",
      city_slug: "arhangelsk"
    }
  ]
}
```

**Результат группировки:**
- Опция появляется в категории "Грузовой автомобиль"
- Опция появляется в категории "Легковой автомобиль"
- Опция появляется в категории "Кроссовер"

**Отображение:**
```
┌─────────────────────────────────────────┐
│ 🚚 Грузовой автомобиль (1 опция)    ▼   │
├─────────────────────────────────────────┤
│ Балансировка колеса           500 ₽     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🚚 Легковой автомобиль (1 опция)    ▼   │
├─────────────────────────────────────────┤
│ Балансировка колеса           300 ₽     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🚚 Кроссовер (1 опция)              ▼   │
├─────────────────────────────────────────┤
│ Балансировка колеса           350 ₽     │
└─────────────────────────────────────────┘
```

### Пример 2: Несколько опций в одной категории

**Входные данные:**
```typescript
options = [
  {
    id: 1,
    title: "Балансировка колеса",
    prices: [{ amount: "500", technic_category_title: "Грузовой автомобиль" }]
  },
  {
    id: 3,
    title: "Ремонт прокола",
    prices: [{ amount: "400", technic_category_title: "Грузовой автомобиль" }]
  }
]
```

**Отображение:**
```
┌─────────────────────────────────────────┐
│ 🚚 Грузовой автомобиль (2 опции)    ▼   │
├─────────────────────────────────────────┤
│ Балансировка колеса           500 ₽     │
│ Ремонт прокола                 400 ₽     │
└─────────────────────────────────────────┘
```

### Пример 3: Опции без категорий

**Входные данные:**
```typescript
options = [
  {
    id: 1,
    title: "Консультация",
    prices: [{ amount: "0.00", technic_category_title: null }]
  },
  {
    id: 2,
    title: "Выезд мастера",
    prices: []
  }
]
```

**Отображение:**
```
┌─────────────────────────────────────────┐
│ 🚚 Прочие услуги (2 опции)          ▼   │
├─────────────────────────────────────────┤
│ Консультация                     0 ₽     │
│ Выезд мастера          По запросу        │
└─────────────────────────────────────────┘
```

---

## 🔗 Связанные файлы

- `apps/frontend/src/app/cities/[slug]/services/[serviceSlug]/CityServiceContent.tsx` - Основной компонент
- `apps/frontend/src/lib/api/services/cities.service.ts` - API сервис с загрузкой цен
- `apps/frontend/src/lib/api/services/content.service.ts` - Сервис для загрузки деталей опции
- `apps/frontend/src/lib/api/hooks/useCities.ts` - Хук для данных
- `apps/frontend/src/components/ui/price-accordion.tsx` - UI компоненты аккордеона

---

## 📅 История изменений

- **2025-12-29** - Обновлена реализация для загрузки всех цен через `/api/website/options/{id}/`
- **2025-12-29** - Добавлена поддержка массива цен в опциях
- **2025-12-29** - Обновлена группировка опций по категориям на основе массива цен
- **2025-12-29** - Опции теперь могут появляться в нескольких категориях

---

**Дата создания документа:** 2025-12-29  
**Статус:** ✅ Актуально (ветка development)

