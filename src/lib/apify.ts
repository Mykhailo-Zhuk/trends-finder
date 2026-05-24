import type { Product, SearchResponse } from "@/types";

const APIFY_BASE = "https://api.apify.com/v2";
const ALIEXPRESS_ACTOR = "logical_scrapers/aliexpress-scraper";
const ALIBABA_ACTOR = "scraperx/alibaba-scraper";

function getApiToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not configured");
  return token;
}

async function runActor(
  actorId: string,
  input: Record<string, unknown>,
  token: string
): Promise<unknown[]> {
  const runRes = await fetch(
    `${APIFY_BASE}/acts/${encodeURIComponent(actorId)}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(90_000),
    }
  );

  if (!runRes.ok) {
    const text = await runRes.text().catch(() => "");
    throw new Error(`Apify actor run failed: ${runRes.status} ${text}`);
  }

  const { data: run } = await runRes.json();
  const runId: string = run.id;

  // Poll for completion
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(
      `${APIFY_BASE}/actor-runs/${runId}?token=${token}`
    );
    const { data: status } = await statusRes.json();
    if (status.status === "SUCCEEDED") break;
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status.status)) {
      throw new Error(`Actor run ${status.status}`);
    }
  }

  // Fetch dataset
  const datasetRes = await fetch(
    `${APIFY_BASE}/actor-runs/${runId}/dataset/items?token=${token}&clean=true`
  );
  if (!datasetRes.ok) throw new Error("Failed to fetch dataset");
  return datasetRes.json();
}

function normalizeAliExpressItem(item: Record<string, unknown>, index: number): Product {
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
    category: String(item.category ?? ""),
  };
}

function normalizeAlibabaItem(item: Record<string, unknown>, index: number): Product {
  return {
    id: `ab-${item.productId ?? item.id ?? index}`,
    title: String(item.title ?? item.subject ?? item.name ?? ""),
    price: Number(item.price ?? item.minPrice ?? item.priceFrom ?? 0),
    currency: String(item.currency ?? "USD"),
    rating: Number(item.rating ?? item.score ?? 0),
    orders: Number(item.orders ?? item.monthlyOrders ?? 0),
    seller: String(item.companyName ?? item.supplier ?? item.seller ?? ""),
    imageUrl: String(item.image ?? item.imageUrl ?? item.mainImage ?? ""),
    productUrl: String(item.url ?? item.detailUrl ?? ""),
    platform: "alibaba",
    category: String(item.category ?? ""),
  };
}

export async function searchProducts(
  query: string,
  platform: "aliexpress" | "alibaba" | "both",
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse> {
  const token = getApiToken();
  const promises: Promise<Product[]>[] = [];

  if (platform === "aliexpress" || platform === "both") {
    promises.push(
      runActor(
        ALIEXPRESS_ACTOR,
        { search: query, maxItems: limit, sortBy: "default" },
        token
      ).then((items) =>
        (items as Record<string, unknown>[]).map(normalizeAliExpressItem)
      )
    );
  }

  if (platform === "alibaba" || platform === "both") {
    promises.push(
      runActor(
        ALIBABA_ACTOR,
        { keywords: query, maxItems: limit },
        token
      ).then((items) =>
        (items as Record<string, unknown>[]).map(normalizeAlibabaItem)
      )
    );
  }

  const results = await Promise.allSettled(promises);
  const products: Product[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      products.push(...result.value);
    }
  }

  if (products.length === 0 && results.every((r) => r.status === "rejected")) {
    throw new Error("All scrapers failed. Please try again later.");
  }

  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return {
    products: paginated,
    total: products.length,
    page,
    totalPages: Math.ceil(products.length / limit),
    cached: false,
  };
}
