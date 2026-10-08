export interface MarketPrice {
  market: string;
  price: number;
  unit?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  category: string;
  categoryName: string;
  tags: string[];
  description: string;
  /** Today's price in BDT — always a real number, never a formatted string. */
  price: number;
  /** Signed percentage change versus yesterday (+2.1, -2.9, 0). */
  changePercent: number;
  changeAmount: number | null;
  markets: MarketPrice[];
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
}
