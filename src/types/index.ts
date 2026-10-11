/** One bazar's price RANGE for today. `avg` is the midpoint of min and max. */
export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
  avg: number;
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
  /** Today's price in BDT as a real number (never a formatted string). `null` = the API gave no usable price. */
  price: number | null;
  /** Signed % change versus yesterday (+2.1, -2.9, 0). `null` = the API gave no genuine change data. */
  changePercent: number | null;
  /** Signed change in BDT versus yesterday. `null` = unavailable. */
  changeAmount: number | null;
  /** Reference prices from the API, when present. */
  yesterday: number | null;
  lastWeek: number | null;
  lastMonth: number | null;
  markets: MarketPrice[];
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
}
