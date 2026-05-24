---
tags: [ope-157, next.js, app-router, typescript, structure]
created: 2026-05-16
status: active
relates-to: "[[00 — OPE-157 Огляд проекту]]"
---

# 01 — Next.js App Router та структура

## Чому Next.js 15 App Router

App Router дозволяє:
- Розділити серверний і клієнтський код в рамках одного проекту
- Використовувати **Route Handlers** як серверний API (проксі до Apify)
- Автоматичний `Cache-Control` для API відповідей
- Легкий деплой на Vercel без окремого бекенду

## Ключові файли

### `src/app/page.tsx` — Suspense wrapper

```tsx
import { Suspense } from "react";
import HomePage from "./page-client";

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
```

> **Чому Suspense?** Бібліотека `nuqs` для URL state використовує `useSearchParams()`,
> який в Next.js 15 вимагає Suspense boundary при SSR. Без нього білд падає.

### `src/app/page-client.tsx` — Головна сторінка

Client Component (`"use client"`). Містить всю логіку відображення:
- Перемикання між режимами (Grid / Table / Charts)
- Стан обраного товару для модального вікна
- Оркестрація всіх дочірніх компонентів

### `src/app/layout.tsx` — Root layout

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <NuqsAdapter>       {/* URL state adapter */}
          <Providers>       {/* QueryClientProvider */}
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
```

### `src/app/api/search/route.ts` — Route Handler

Серверний обробник запитів. Детально описаний у [[05 — Безпека та валідація]].

## TypeScript типи

Всі типи в `src/types/index.ts`:

```typescript
type Platform = "aliexpress" | "alibaba" | "both";

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  rating: number;       // 0–5
  orders: number;       // кількість замовлень
  seller: string;
  imageUrl: string;
  productUrl: string;
  platform: "aliexpress" | "alibaba";
  category?: string;
}

interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  cached: boolean;
  demo?: boolean;       // true якщо APIFY_API_TOKEN не встановлено
}
```

## Конфігурація Next.js

`next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.aliexpress.com" },
      { protocol: "https", hostname: "**.alicdn.com" },
      { protocol: "https", hostname: "**.alibaba.com" },
      // ...
    ],
  },
  async headers() {
    return [{
      source: "/api/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  },
};
```

## Tailwind конфігурація

`tailwind.config.ts` розширює базову конфігурацію:

| Кастомізація | Опис |
|---|---|
| `colors.teal` | Розширена палітра teal (50–950) |
| `fontFamily` | display / body / mono через CSS змінні |
| `animation` | fade-in, slide-up, pulse-slow, shimmer |
| `keyframes` | fadeIn, slideUp, shimmer (для skeleton) |

## Утиліти (`src/lib/utils.ts`)

| Функція | Опис |
|---|---|
| `cn(...inputs)` | clsx + tailwind-merge |
| `formatPrice(price, currency)` | `$12.99` через Intl.NumberFormat |
| `formatOrders(orders)` | `15.4K`, `1.2M` |
| `truncate(str, max)` | Обрізає з `…` |
| `getPriceRanges(prices[])` | 4 діапазони для PriceRange chart |

## Крайні випадки

| Ситуація | Поведінка |
|---|---|
| nuqs без Suspense | Білд падає з помилкою `useSearchParams` |
| Зображення з неліцензованого домену | next/image відхиляє — додати в `remotePatterns` |
| `"use client"` на root layout | Ламає RSC — layout завжди server component |
| Tailwind клас не знайдено | JIT не компілює динамічні рядки — використовувати повні назви класів |

## Пов'язані нотатки

- [[02 — Apify інтеграція]]
- [[03 — Компоненти та UI]]
- [[04 — Стан, кешування та URL sync]]
