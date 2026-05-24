"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import type { SearchResponse } from "@/types";

async function fetchProducts(
  query: string,
  platform: string,
  page: number
): Promise<SearchResponse & { demo?: boolean }> {
  const params = new URLSearchParams({
    query,
    platform,
    page: String(page),
    limit: "12",
  });
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error ?? "Search failed");
  }
  return res.json();
}

export function useSearch() {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [platform, setPlatform] = useQueryState(
    "platform",
    parseAsString.withDefault("both")
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const enabled = query.trim().length > 0;

  const result = useQuery({
    queryKey: ["search", query, platform, page],
    queryFn: () => fetchProducts(query, platform, page),
    enabled,
    placeholderData: (prev) => prev,
  });

  function search(q: string, p: string) {
    setQuery(q);
    setPlatform(p);
    setPage(1);
  }

  return {
    query,
    platform,
    page,
    setPage,
    search,
    ...result,
  };
}
