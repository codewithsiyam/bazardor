/**
 * Types below mirror the REAL responses of
 * https://api.api-store.workers.dev/api/bazardor  (/products and /categories),
 * which were inspected before this file was written.
 *
 * Fields that the UI can live without are optional so that a partially
 * incomplete record never crashes a page.
 */

export type PriceDirection = "up" | "down" | "flat";

export interface PriceChange {
  dir: PriceDirection;
  /** Signed percentage: negative when the price fell. */
  pct: number;
}

export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  /** e.g. "kg" | "litre" | "dozen" | "piece" */
  unit: string;
  /** Emoji used as the product illustration. */
  image?: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change: PriceChange;
  markets: MarketPrice[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export type SortMode = "default" | "price-asc" | "price-desc";

export interface PriceSummary {
  min: number;
  max: number;
  /** Mean of every market's (min + max) / 2, rounded to a whole taka. */
  avg: number;
  minMarket: MarketPrice;
  maxMarket: MarketPrice;
  marketCount: number;
}

export interface MarketRow extends MarketPrice {
  avg: number;
}
