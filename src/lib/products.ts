import type { Market, MarketStats, Product, SortMode } from "@/types";

/** Numeric sort on the stored number (never on the Bengali display string). Missing prices go last. */
export function sortProducts(products: Product[], mode: SortMode): Product[] {
  if (mode === "default") return products;
  const list = [...products];
  list.sort((a, b) => {
    if (a.today === null && b.today === null) return 0;
    if (a.today === null) return 1;
    if (b.today === null) return -1;
    return mode === "price-asc" ? a.today - b.today : b.today - a.today;
  });
  return list;
}

/** Products whose change data (from the API, or derived from yesterday's price) says "up". */
export function getRisers(products: Product[], limit = 6): Product[] {
  return products
    .filter((p) => p.change?.dir === "up" && p.change.pct > 0)
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, limit);
}

export function getFallers(products: Product[], limit = 6): Product[] {
  return products
    .filter((p) => p.change?.dir === "down" && p.change.pct > 0)
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, limit);
}

/** Per-market average of its min and max. */
export function marketAverage(m: Market): number {
  return (m.min + m.max) / 2;
}

/** Min / max / average computed only from valid market records. Null when there are none. */
export function computeMarketStats(markets: Market[]): MarketStats | null {
  const valid = markets.filter((m) => Number.isFinite(m.min) && Number.isFinite(m.max) && m.min > 0 && m.max > 0);
  if (valid.length === 0) return null;
  let minM = valid[0];
  let maxM = valid[0];
  let total = 0;
  for (const m of valid) {
    if (m.min < minM.min) minM = m;
    if (m.max > maxM.max) maxM = m;
    total += marketAverage(m);
  }
  return {
    min: minM.min,
    minMarket: minM.market,
    max: maxM.max,
    maxMarket: maxM.market,
    avg: Math.round((total / valid.length) * 100) / 100,
  };
}

export function changeSummary(product: Product): string | null {
  if (!product.change) return null;
  if (product.change.dir === "up") return "গতকালের তুলনায় আজ দাম বেড়েছে";
  if (product.change.dir === "down") return "গতকালের তুলনায় আজ দাম কমেছে";
  return "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
}
