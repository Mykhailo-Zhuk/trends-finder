import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatOrders(orders: number): string {
  if (orders >= 1_000_000) return `${(orders / 1_000_000).toFixed(1)}M`;
  if (orders >= 1_000) return `${(orders / 1_000).toFixed(1)}K`;
  return orders.toString();
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

export function getPriceRanges(prices: number[]) {
  if (!prices.length) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const step = (max - min) / 4 || 1;

  return [
    { label: `$${min.toFixed(0)}–$${(min + step).toFixed(0)}`, min, max: min + step, count: 0 },
    { label: `$${(min + step).toFixed(0)}–$${(min + 2 * step).toFixed(0)}`, min: min + step, max: min + 2 * step, count: 0 },
    { label: `$${(min + 2 * step).toFixed(0)}–$${(min + 3 * step).toFixed(0)}`, min: min + 2 * step, max: min + 3 * step, count: 0 },
    { label: `$${(min + 3 * step).toFixed(0)}+`, min: min + 3 * step, max: Infinity, count: 0 },
  ].map((range) => ({
    ...range,
    count: prices.filter((p) => p >= range.min && p < range.max).length,
  }));
}
