---
tags: [ope-157, apify, scraper, aliexpress, alibaba, api]
created: 2026-05-16
status: active
relates-to: "[[00 — OPE-157 Огляд проекту]]"
---

# 02 — Apify інтеграція

## Аутентифікація

Apify API використовує персональний токен:

```typescript
// src/lib/apify.ts — server-only
const APIFY_BASE = "https://api.apify.com/v2";

function getApiToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not configured");
  return token;
}
```

> ⚠️ Файл `apify.ts` ніколи не імпортується безпосередньо з клієнтського коду.
> Тільки через Route Handler (`/api/search/route.ts`), який є server-only.

## Actors

### AliExpress Scraper

| Параметр | Значення |
|---|---|
| Actor ID | `logical_scrapers/aliexpress-scraper` |
| Input | `{ search: query, maxItems: limit, sortBy: "default" }` |
| Час відповіді | 5–30 сек |

### Alibaba Scraper

| Параметр | Значення |
|---|---|
| Actor ID | `scraperx/alibaba-scraper` |
| Input | `{ keywords: query, maxItems: limit }` |
| Час відповіді | 10–40 сек |

## Flow виклику Actor

```
1. POST /acts/{actorId}/runs     → отримати runId
2. Polling GET /actor-runs/{id}  → чекати SUCCEEDED (до 60 × 2 сек = 2 хв)
3. GET /actor-runs/{id}/dataset/items → отримати результати
```

```typescript
async function runActor(actorId, input, token): Promise<unknown[]> {
  // 1. Запустити actor
  const run = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${token}`, {
    method: "POST",
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(90_000),
  });

  // 2. Polling статусу
  for (let i = 0; i < 60; i++) {
    await sleep(2000);
    const status = await getRunStatus(runId, token);
    if (status === "SUCCEEDED") break;
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status)) throw new Error(...);
  }

  // 3. Отримати dataset
  return fetch(`/actor-runs/${runId}/dataset/items?token=${token}&clean=true`);
}
```

## Нормалізація відповідей

Обидва scraper-и повертають різні поля. Нормалізуємо до єдиного `Product`:

### AliExpress → Product

```typescript
function normalizeAliExpressItem(item, index): Product {
  return {
    id: `ae-${item.productId ?? item.id ?? index}`,
    title: String(item.title ?? item.name ?? ""),
    price: Number(item.price ?? item.salePrice ?? 0),
    currency: String(item.currency ?? "USD"),
    rating: Number(item.rating ?? item.starRating ?? 0),
    orders: Number(item.orders ?? item.totalOrders ?? item.soldCount ?? 0),
    seller: String(item.store ?? item.storeName ?? item.seller ?? ""),
    imageUrl: String(item.image ?? item.imageUrl ?? item.mainImage ?? ""),
    productUrl: String(item.url ?? item.productUrl ?? ""),
    platform: "aliexpress",
  };
}
```

### Alibaba → Product

```typescript
function normalizeAlibabaItem(item, index): Product {
  return {
    id: `ab-${item.productId ?? item.id ?? index}`,
    title: String(item.title ?? item.subject ?? item.name ?? ""),
    price: Number(item.price ?? item.minPrice ?? item.priceFrom ?? 0),
    // ...
    seller: String(item.companyName ?? item.supplier ?? item.seller ?? ""),
    platform: "alibaba",
  };
}
```

## Паралельний запуск

При платформі `"both"` обидва actors запускаються паралельно через `Promise.allSettled`:

```typescript
const results = await Promise.allSettled([
  runAliExpress(query, limit, token),
  runAlibaba(query, limit, token),
]);

// Якщо один впав — беремо результати другого
// Якщо обидва впали — кидаємо помилку
```

## Demo Mode

Якщо `APIFY_API_TOKEN` не встановлено — Route Handler повертає mock дані з `src/lib/mock-data.ts`:

```typescript
const DEMO_MODE = !process.env.APIFY_API_TOKEN;

if (DEMO_MODE) {
  await sleep(800); // симуляція затримки
  return getMockResults(query, platform, page, limit);
}
```

Mock-дані містять 12 товарів з обох платформ різних категорій.

## Конфігурація

```
APIFY_API_TOKEN=apify_api_...   # https://console.apify.com/account/integrations
```

## Крайні випадки

| Ситуація | Поведінка |
|---|---|
| Actor повертає `FAILED` | `throw new Error("Actor run FAILED")` → 502 відповідь |
| Actor зависає > 2 хв | `AbortSignal.timeout(90_000)` — таймаут |
| Один actor впав, другий ок | `Promise.allSettled` — повертаємо часткові результати |
| Обидва actors впали | Помилка "All scrapers failed" → UI показує `ErrorState` |
| Поле відсутнє у відповіді | Nullish coalescing (`??`) у нормалізаторах |
| Rate limit Apify (429) | React Query retry × 2 з exponential backoff |
| `maxItems` перевищує plan | Actor повертає менше — пагінація адаптується |

## Pov'язані нотатки

- [[01 — Next.js App Router та структура]]
- [[05 — Безпека та валідація]]
