export type PriceDirection = "up" | "down" | "flat";

export interface PriceChange {
  dir: PriceDirection;
  /** Absolute percentage, e.g. 2.1 means 2.1% */
  pct: number;
}

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  /** Emoji (or short glyph) used as the product picture */
  image: string;
  description: string | null;
  today: number | null;
  yesterday: number | null;
  lastWeek: number | null;
  lastMonth: number | null;
  /** null when neither the API nor yesterday's price allows a defensible value */
  change: PriceChange | null;
  markets: Market[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export type SortMode = "default" | "price-asc" | "price-desc";

export interface MarketStats {
  min: number;
  minMarket: string;
  max: number;
  maxMarket: string;
  avg: number;
}
