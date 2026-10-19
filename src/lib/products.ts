import type { MarketRow, PriceSummary, Product, SortMode } from "@/types";

/** Pure product helpers (sorting, movers, price statistics). */

/** Never mutates the input. Sorting is numeric (by `today`), never alphabetical. */
export function sortProducts(products: Product[], mode: SortMode): Product[] {
  const copy = [...products];
  if (mode === "price-asc") return copy.sort((a, b) => a.today - b.today);
  if (mode === "price-desc") return copy.sort((a, b) => b.today - a.today);
  return copy;
}

/** Top risers, biggest percentage increase first. Only items the API flags as "up". */
export function getRisers(products: Product[], limit = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit);
}

/** Top fallers, biggest percentage drop first. Only items the API flags as "down". */
export function getFallers(products: Product[], limit = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit);
}

/** Looks a product up by slug first; a purely numeric value is treated as an id. */
export function findProductByParam(products: Product[], param: string): Product | null {
  const bySlug = products.find((product) => product.slug === param);
  if (bySlug) return bySlug;
  if (/^\d+$/.test(param)) {
    return products.find((product) => product.id === Number(param)) ?? null;
  }
  return null;
}

/** Only market records with real, sane numbers take part in any statistic. */
export function getValidMarkets(product: Product): MarketRow[] {
  return product.markets
    .filter(
      (market) =>
        typeof market.market === "string" &&
        market.market.trim() !== "" &&
        Number.isFinite(market.min) &&
        Number.isFinite(market.max) &&
        market.min > 0 &&
        market.max >= market.min,
    )
    .map((market) => ({ ...market, avg: (market.min + market.max) / 2 }));
}

/** Market table order: cheapest average first (ties by name). */
export function getMarketRows(product: Product): MarketRow[] {
  return getValidMarkets(product).sort(
    (a, b) => a.avg - b.avg || a.market.localeCompare(b.market, "bn"),
  );
}

/** Returns null when there is no valid market record to calculate from. */
export function getPriceSummary(product: Product): PriceSummary | null {
  const markets = getValidMarkets(product);
  if (markets.length === 0) return null;

  let minMarket = markets[0];
  let maxMarket = markets[0];
  let avgTotal = 0;
  for (const market of markets) {
    if (market.min < minMarket.min) minMarket = market;
    if (market.max > maxMarket.max) maxMarket = market;
    avgTotal += market.avg;
  }

  return {
    min: minMarket.min,
    max: maxMarket.max,
    avg: Math.round(avgTotal / markets.length),
    minMarket,
    maxMarket,
    marketCount: markets.length,
  };
}

/** Absolute difference between today's and yesterday's price, when both are real. */
export function getDayDifference(product: Product): number | null {
  if (typeof product.yesterday !== "number" || !Number.isFinite(product.yesterday)) return null;
  return Math.abs(product.today - product.yesterday);
}

/** Emoji used for the product illustration, with safe fallbacks. */
export function getProductEmoji(product: Product): string {
  return product.image || product.categoryIcon || "🛒";
}
