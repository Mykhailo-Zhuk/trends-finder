---
tags: [ope-157, react-query, nuqs, state, caching, url-sync]
created: 2026-05-16
status: active
relates-to: "[[00 — OPE-157 Огляд проекту]]"
---

# 04 — Стан, кешування та URL sync

## Архітектура стану

```
URL params (nuqs)           React Query cache
?q=...&platform=...   ←→   ["search", q, platform, page]
&page=...
```

Весь стан пошуку зберігається в URL. React Query кешує результати по ключу `[q, platform, page]`.

## React Query

Налаштований у `src/lib/providers.tsx`:

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 хв — не робити повторний запит
      gcTime: 10 * 60 * 1000,     // 10 хв — зберігати в пам'яті
      retry: 2,                    // 2 повторні спроби при помилці
      retryDelay: (attempt) =>     // exponential backoff: 1s, 2s, 4s...
        Math.min(1000 * 2 ** attempt, 8000),
    },
  },
})
```

### Query key

```typescript
queryKey: ["search", query, platform, page]
```

Зміна будь-якого параметра → новий запит (або з кешу якщо є).

### `placeholderData`

```typescript
placeholderData: (prev) => prev
```

При переході на наступну сторінку показуємо попередні результати замість skeleton.

## Hook `useSearch` (`src/hooks/useSearch.ts`)

Єдина точка входу для пошукового стану:

```typescript
const {
  query,        // string — з URL
  platform,     // string — з URL
  page,         // number — з URL
  setPage,      // (p: number) => void
  search,       // (q: string, p: string) => void — оновлює URL
  data,         // SearchResponse | undefined
  isLoading,    // true при першому завантаженні
  isFetching,   // true при будь-якому завантаженні (включно з фоновим)
  error,        // Error | null
  refetch,      // () => void
} = useSearch();
```

### Метод `search`

```typescript
function search(q: string, p: string) {
  setQuery(q);      // → ?q=...
  setPlatform(p);   // → &platform=...
  setPage(1);       // → &page=1 (скидаємо на першу сторінку)
}
```

## URL Sync (nuqs)

Бібліотека `nuqs` синхронізує React state з URL query params.

```typescript
const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
const [platform, setPlatform] = useQueryState("platform", parseAsString.withDefault("both"));
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
```

**Результат:** посилання вигляду:
```
https://trend-finder.vercel.app/?q=wireless+earbuds&platform=aliexpress&page=2
```

Таким посиланням можна ділитися — результати відтворяться одразу.

**Вимога:** `<NuqsAdapter>` у root layout + `<Suspense>` на сторінці.

## Запит до API

```typescript
async function fetchProducts(query, platform, page): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, platform, page, limit: "12" });
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}
```

**Limit:** 12 товарів на сторінку (оптимально для grid 4×3).

## Стани завантаження

| Стан | Значення | UI |
|---|---|---|
| `!query` | До першого пошуку | `InitialState` |
| `isLoading && !data` | Перший запит | Skeleton |
| `isFetching && data` | Фоновий рефетч | Стара data + spinner у кнопці |
| `data.products.length === 0` | Нічого не знайдено | `EmptyState` |
| `error` | Помилка API | `ErrorState` з retry |

## Кешування на рівні API

Route Handler повертає `Cache-Control` заголовок:

```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

- Vercel CDN кешує відповідь на 5 хв
- Додатково 10 хв stale-while-revalidate
- React Query кешує ще 5 хв на клієнті

Результат: повторний однаковий запит не йде до Apify взагалі.

## Крайні випадки

| Ситуація | Поведінка |
|---|---|
| Користувач оновив сторінку | URL зберігає стан → React Query робить запит автоматично |
| Запит при порожньому query | `enabled: query.trim().length > 0` — запит не виконується |
| Apify відповідає 15 сек | `isFetching = true`, попередні дані залишаються на екрані |
| Дві вкладки з однаковим URL | Один кеш між ними (React Query deduplication) |
| Сторінка > totalPages | Pagination не показує таку кнопку |

## Пов'язані нотатки

- [[01 — Next.js App Router та структура]]
- [[05 — Безпека та валідація]]
