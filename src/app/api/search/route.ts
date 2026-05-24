import { NextRequest, NextResponse } from "next/server";
import { searchApiSchema } from "@/lib/schemas";
import { getMockResults } from "@/lib/mock-data";

const DEMO_MODE = !process.env.APIFY_API_TOKEN;

// Simple in-memory rate limiter (per IP, 10 req/min)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = request.nextUrl;
  const raw = {
    query: searchParams.get("query") ?? "",
    platform: searchParams.get("platform") ?? "both",
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("limit") ?? "20",
  };

  const parsed = searchApiSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { query, platform, page, limit } = parsed.data;

  try {
    let data;

    if (DEMO_MODE) {
      // Simulate latency in demo mode
      await new Promise((r) => setTimeout(r, 800));
      data = getMockResults(query, platform, page, limit);
    } else {
      const { searchProducts } = await import("@/lib/apify");
      data = await searchProducts(query, platform, page, limit);
    }

    return NextResponse.json(
      { ...data, demo: DEMO_MODE },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Demo-Mode": DEMO_MODE ? "true" : "false",
        },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("[/api/search] Error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
