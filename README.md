# 🛍️ Trend Finder — AliExpress & Alibaba Product Research

Веб-аплікація для пошуку трендових товарів на AliExpress та Alibaba через Apify API.

## Стек

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** (glassmorphism design)
- **react-hook-form** + **zod** (валідація форм і API)
- **@tanstack/react-query** (кешування, retry, loading states)
- **Recharts** (графіки)
- **lucide-react** (іконки)
- **nuqs** (URL state sync)

## Швидкий старт

```bash
npm install
cp .env.example .env.local
# Додайте APIFY_API_TOKEN у .env.local (опціонально — без нього працює demo mode)
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000).

## Demo Mode

Без `APIFY_API_TOKEN` додаток працює в demo режимі з тестовими даними. Баннер вгорі повідомляє про це.

## Змінні середовища

| Змінна | Опис | Обов'язкова |
|--------|------|-------------|
| `APIFY_API_TOKEN` | Токен Apify API | Ні (без нього demo mode) |
| `UPSTASH_REDIS_REST_URL` | URL Redis для rate limiting | Ні |
| `UPSTASH_REDIS_REST_TOKEN` | Token Redis для rate limiting | Ні |

## Безпека

- Apify API token використовується **тільки на сервері** (Route Handler)
- Всі вхідні дані валідуються через zod
- Rate limiting: 10 запитів/хв на IP (in-memory, для production — Upstash)
- Security headers налаштовані в `next.config.ts`

## Деплой на Vercel

```bash
vercel deploy
```

Встанови змінні середовища в Vercel Dashboard → Settings → Environment Variables.

## Структура проекту

```
src/
├── app/
│   ├── api/search/route.ts   # Серверний Route Handler (проксі до Apify)
│   ├── layout.tsx
│   └── page.tsx              # Головна сторінка
├── components/
│   ├── SearchForm.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── ProductsTable.tsx
│   ├── Charts.tsx
│   ├── Skeletons.tsx
│   ├── Pagination.tsx
│   └── States.tsx
├── hooks/
│   └── useSearch.ts          # React Query + nuqs
├── lib/
│   ├── apify.ts              # Apify client (server-only)
│   ├── mock-data.ts          # Demo дані
│   ├── providers.tsx         # QueryClientProvider
│   ├── schemas.ts            # Zod schemas
│   └── utils.ts
└── types/
    └── index.ts
```
