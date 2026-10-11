import { parseNumber } from "./bn";
import type { Category, MarketPrice, Product } from "@/types";

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);

/** First key from `keys` that exists on `obj` (case-insensitive, ignores _ and -). */
function pick(obj: Raw, keys: string[]): unknown {
  const flat = new Map<string, unknown>();
  for (const k of Object.keys(obj)) flat.set(k.toLowerCase().replace(/[_-]/g, ""), obj[k]);
  for (const k of keys) {
    const v = flat.get(k.toLowerCase().replace(/[_-]/g, ""));
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : fallback;

/** APIs often wrap lists as { data: [...] } / { products: [...] }. Unwrap defensively. */
export function unwrapList(json: unknown, keys: string[]): Raw[] {
  if (Array.isArray(json)) return json.filter(isObj);
  if (isObj(json)) {
    for (const k of [...keys, "data", "items", "results"]) {
      const v = json[k];
      if (Array.isArray(v)) return v.filter(isObj);
      if (isObj(v)) {
        const inner = unwrapList(v, keys);
        if (inner.length) return inner;
      }
    }
  }
  return [];
}

export function unwrapOne(json: unknown, keys: string[]): Raw | null {
  if (isObj(json)) {
    for (const k of [...keys, "data", "item", "result"]) {
      const v = json[k];
      if (isObj(v)) return v;
    }
    return json;
  }
  return null;
}

const UNIT_BN: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  pc: "প্রতি পিস",
  gram: "প্রতি গ্রাম",
  halli: "প্রতি হালি",
};

/** API sends English unit codes ("kg", "dozen"); show the Bengali label. Unknown values pass through. */
function normalizeUnit(raw: string): string {
  return UNIT_BN[raw.toLowerCase()] ?? raw;
}

/** Real API shape: [{ market, division, min, max }]. A plain { market, price } is also accepted. */
function normalizeMarkets(raw: unknown): MarketPrice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isObj)
    .map((m): MarketPrice | null => {
      const market = str(pick(m, ["market", "name", "bazar", "bazaar", "marketName"]));
      if (!market) return null;
      const single = parseNumber(pick(m, ["price", "todayPrice", "currentPrice", "amount"]));
      const min = parseNumber(pick(m, ["min", "minPrice"])) ?? single;
      const max = parseNumber(pick(m, ["max", "maxPrice"])) ?? single;
      if (min === null || max === null) return null;
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      return { market, division: str(pick(m, ["division", "district", "city"])), min: lo, max: hi, avg: (lo + hi) / 2 };
    })
    .filter((m): m is MarketPrice => m !== null);
}

export function normalizeProduct(raw: Raw): Product | null {
  const id = str(pick(raw, ["id", "_id", "productId"]));
  const name = str(pick(raw, ["nameBn", "name", "title", "productName"]));
  if (!name) return null;

  const markets = normalizeMarkets(pick(raw, ["markets", "marketPrices", "bazarPrices", "bazars"]));

  // Price: never default a missing price to 0. If only per-bazar prices exist, use their average.
  let price = parseNumber(pick(raw, ["today", "price", "todayPrice", "currentPrice"]));
  if (price === null && markets.length) price = markets.reduce((sum, m) => sum + m.avg, 0) / markets.length;
  const yesterday = parseNumber(pick(raw, ["yesterday", "yesterdayPrice", "previousPrice", "prevPrice", "oldPrice", "lastPrice"]));
  const lastWeek = parseNumber(pick(raw, ["lastWeek", "lastWeekPrice"]));
  const lastMonth = parseNumber(pick(raw, ["lastMonth", "lastMonthPrice"]));

  // Change. Real API: change = { dir: "up" | "down" | "flat", pct: 2.1 } (pct is signed).
  // Otherwise use explicit percent fields, otherwise compute from genuine current + previous prices.
  // If none exist the change stays null ("no data"), never 0.
  let changePercent: number | null = null;
  let dir = str(pick(raw, ["trend", "direction", "changeType"])).toLowerCase();
  const changeField = pick(raw, ["change"]);
  if (isObj(changeField)) {
    changePercent = parseNumber(pick(changeField, ["pct", "percent", "percentage", "value"]));
    dir = str(pick(changeField, ["dir", "direction", "trend"])).toLowerCase() || dir;
  }
  if (changePercent === null) {
    changePercent = parseNumber(
      pick(raw, ["changePercent", "percentChange", "changePct", "changePercentage", "percentageChange", "pct"]),
    );
  }
  let changeAmount = parseNumber(pick(raw, ["changeAmount", "priceChange", "diff", "difference"]));
  if (changeAmount === null && yesterday !== null && price !== null) changeAmount = price - yesterday;
  if (changePercent === null && yesterday && price !== null) {
    changePercent = ((price - yesterday) / yesterday) * 100;
  }
  if (changePercent === null && typeof changeField === "string" && changeField.includes("%")) {
    changePercent = parseNumber(changeField); // only a string that is explicitly a percentage
  }
  if (changePercent !== null) {
    if (dir === "down" || dir === "fall") changePercent = -Math.abs(changePercent);
    else if (dir === "up" || dir === "rise") changePercent = Math.abs(changePercent);
    else if (dir === "flat" || dir === "same") changePercent = 0;
    if (!Number.isFinite(changePercent)) changePercent = null;
  }

  const category = str(pick(raw, ["category", "categorySlug", "categoryId"]));
  const tagsRaw = pick(raw, ["tags"]);
  const categoryName = str(pick(raw, ["categoryNameBn", "categoryName", "categoryBn"]), category);

  return {
    id: id || name,
    slug: str(pick(raw, ["slug"])) || id || name,
    name,
    emoji: str(pick(raw, ["image", "emoji", "icon", "categoryIcon"]), "🛒"),
    unit: normalizeUnit(str(pick(raw, ["unitBn", "unit"]))),
    category,
    categoryName,
    tags: Array.isArray(tagsRaw) ? tagsRaw.map((t) => str(t)).filter(Boolean) : categoryName ? [categoryName] : [],
    description: str(pick(raw, ["description", "summary", "subtitle", "desc"])),
    price,
    changePercent,
    changeAmount,
    yesterday,
    lastWeek,
    lastMonth,
    markets,
  };
}

export function normalizeCategory(raw: Raw): Category | null {
  const slug = str(pick(raw, ["slug", "id", "_id", "key"]));
  const name = str(pick(raw, ["nameBn", "name", "title", "label"]));
  if (!slug && !name) return null;
  return { slug: slug || name, name: name || slug, icon: str(pick(raw, ["emoji", "icon"]), "🛒") };
}
