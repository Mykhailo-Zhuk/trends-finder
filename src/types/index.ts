export type Platform = "aliexpress" | "alibaba" | "both";

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  rating: number;
  orders: number;
  seller: string;
  imageUrl: string;
  productUrl: string;
  platform: "aliexpress" | "alibaba";
  category?: string;
}

export interface SearchParams {
  query: string;
  platform: Platform;
  page: number;
  limit: number;
}

export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  cached: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface PriceRange {
  label: string;
  count: number;
  min: number;
  max: number;
}

export interface ChartDataPoint {
  name: string;
  rating: number;
  orders: number;
  price: number;
  platform: string;
}
