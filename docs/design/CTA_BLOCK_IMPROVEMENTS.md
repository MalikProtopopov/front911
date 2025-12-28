# Улучшение CTA-блока "Нужна помощь на дороге"

## A) Два варианта компоновки

### Вариант 1: Классический (рекомендуемый)
**Структура:** Текст сверху, кнопки снизу по центру

**Преимущества:**
- Максимальная конверсия (фокус на тексте → действие)
- Идеально для мобильных (вертикальный поток)
- Простота восприятия
- Универсальность

**Сетка:**
- Контейнер: `max-w-7xl` (как на остальных секциях)
- Внутренний контент: `flex flex-col items-center`
- Текст: `max-w-2xl` (ограничение ширины для читаемости)
- Кнопки: `flex flex-col sm:flex-row gap-4` (столбик на mobile, ряд на desktop)

**Выравнивание:**
- Все элементы по центру (`text-center`, `items-center`)
- Кнопки выровнены по baseline через `items-center`

### Вариант 2: Витринный
**Структура:** Слева текст, справа кнопки (в одну строку)

**Преимущества:**
- Современный вид
- Эффективное использование пространства на desktop
- Визуальный баланс

**Сетка:**
- Контейнер: `max-w-7xl`
- Grid: `grid md:grid-cols-12 gap-8 md:gap-12`
- Текст: `md:col-span-7 lg:col-span-8` (левая часть)
- Кнопки: `md:col-span-5 lg:col-span-4` (правая часть)
- На mobile: `flex-col` (текст сверху, кнопки снизу)

**Выравнивание:**
- Desktop: текст `text-left`, кнопки `flex flex-col items-start`
- Mobile: `text-center`, кнопки `items-center`

---

## B) Конкретные отступы (8px grid)

### Вариант 1 (Классический):
```css
Секция:
- py-16 md:py-20 lg:py-24 (64px / 80px / 96px)

Внутренние отступы:
- H2 → описание: mb-4 md:mb-6 (16px / 24px)
- Описание → кнопки: mt-8 md:mt-10 (32px / 40px)

Отступы от соседних секций:
- Верх: py-16 (64px) - уже включено в секцию
- Низ: py-16 (64px) - уже включено в секцию
- Разделитель: не нужен (достаточно фона bg-[var(--background-secondary)])
```

### Вариант 2 (Витринный):
```css
Секция:
- py-16 md:py-20 lg:py-24 (64px / 80px / 96px)

Внутренние отступы:
- H2 → описание: mb-4 md:mb-6 (16px / 24px)
- Описание → кнопки: mt-8 md:mt-10 (32px / 40px)
- Gap между колонками: gap-8 md:gap-12 (32px / 48px)

Отступы от соседних секций:
- Аналогично варианту 1
```

---

## C) Типографика и контраст

### H2 (Заголовок):
```css
Desktop: text-3xl md:text-4xl lg:text-4xl
         font-bold
         leading-tight (1.2)
         text-[var(--foreground)]
         
Tablet: text-3xl
Mobile: text-2xl
```

### Описание:
```css
Desktop: text-lg md:text-xl
         leading-relaxed (1.625)
         text-[var(--foreground-secondary)]
         max-w-2xl (672px) - ограничение ширины
         
Tablet: text-lg
Mobile: text-base
```

### Ограничение ширины текста:
- **Вариант 1:** `max-w-2xl mx-auto` на текстовом блоке
- **Вариант 2:** `max-w-none` на тексте (ограничение через grid-колонки)

---

## D) Кнопки и их поведение

### Размеры:
```css
Высота: h-14 (56px) - size="lg"
Минимальная ширина: min-w-[160px] md:min-w-[180px]
Padding: px-8 md:px-10
```

### Стилизация:
```css
Primary (Позвонить):
- variant="default" (bg-[var(--color-primary)])
- size="lg"
- Иконка: Phone, w-5 h-5, mr-2

Secondary (Все города):
- variant="outline" (border-2 border-[var(--color-primary)])
- size="lg"
- Без иконки (или с иконкой MapPin)
```

### Hover/Focus:
```css
Primary:
- hover:bg-[var(--color-primary-hover)]
- focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2

Secondary:
- hover:bg-[var(--color-primary)] hover:text-white
- focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
```

### Выравнивание:
```css
Mobile: flex-col gap-4 (кнопки в столбик, 100% ширины)
Desktop: flex-row gap-4 (кнопки в ряд, auto ширина)
Обе кнопки: одинаковый size="lg" для одинаковой высоты
```

---

## E) Адаптивные правила

### Mobile (< 640px):
```css
- Порядок: H2 → Описание → Кнопки (вертикально)
- Ширина кнопок: w-full sm:w-auto
- Spacing: mb-4, mt-8
- Текст: text-center
- Контейнер: px-4
```

### Tablet (640px - 1024px):
```css
- Кнопки: flex-row (в ряд)
- Ширина кнопок: auto (не растягиваются)
- Spacing: mb-6, mt-10
- Текст: text-center
```

### Desktop (≥ 1024px):
```css
- Кнопки: flex-row, gap-4
- Ширина текста: max-w-2xl (предотвращает растягивание)
- Spacing: mb-6, mt-10
- Контейнер: max-w-7xl
```

---

## F) Итоговый код (Вариант 1 - Классический)

```tsx
{/* CTA Section */}
<section className="py-16 md:py-20 lg:py-24 bg-[var(--background-secondary)]">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="flex flex-col items-center text-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] mb-4 md:mb-6">
        Нужна помощь на дороге в {city.title}?
      </h2>
      
      {/* Description */}
      <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-8 md:mb-10">
        Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки.
      </p>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button size="lg" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
          <a href="tel:+79991234567">
            <Phone className="w-5 h-5 mr-2" />
            Позвонить
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-w-[160px] md:min-w-[180px]">
          <Link href="/cities">Все города</Link>
        </Button>
      </div>
    </div>
  </div>
</section>
```

### Альтернативный код (Вариант 2 - Витринный):

```tsx
{/* CTA Section */}
<section className="py-16 md:py-20 lg:py-24 bg-[var(--background-secondary)]">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12 items-center">
      {/* Left: Text */}
      <div className="md:col-span-7 lg:col-span-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--foreground)] mb-4 md:mb-6">
          Нужна помощь на дороге в {city.title}?
        </h2>
        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--foreground-secondary)]">
          Наши специалисты готовы помочь вам 24/7. Позвоните или оставьте заявку — мы приедем в кратчайшие сроки.
        </p>
      </div>
      
      {/* Right: Buttons */}
      <div className="md:col-span-5 lg:col-span-4 flex flex-col sm:flex-row md:flex-col items-center md:items-start gap-4 w-full md:w-auto">
        <Button size="lg" asChild className="w-full sm:w-auto md:w-full min-w-[160px] md:min-w-0">
          <a href="tel:+79991234567">
            <Phone className="w-5 h-5 mr-2" />
            Позвонить
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto md:w-full min-w-[160px] md:min-w-0">
          <Link href="/cities">Все города</Link>
        </Button>
      </div>
    </div>
  </div>
</section>
```

---

## Критерии качества (чеклист)

✅ Вертикальный ритм по шагу 8px (4px * 2)
✅ Единый контейнер max-w-7xl с px-4
✅ Ограничение ширины текста max-w-2xl для читаемости
✅ Кнопки одинаковой высоты (size="lg" = 56px)
✅ Кнопки не "плавают" (min-width + правильный gap)
✅ Блок визуально отделен (bg-[var(--background-secondary)])
✅ Адаптивность: mobile столбик, desktop ряд
✅ Конверсионность: четкая иерархия и призыв к действию

---

## Рекомендация

**Выбрать Вариант 1 (Классический)** по следующим причинам:
1. Максимальная конверсия (вертикальный поток внимания)
2. Лучшая читаемость на всех устройствах
3. Проще в поддержке
4. Соответствует лучшим практикам CTA-блоков
5. Меньше рисков с адаптивностью

Вариант 2 можно использовать для других типов контента, где нужен более "витринный" подход.

