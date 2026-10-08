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

function normalizeMarkets(raw: unknown): MarketPrice[] {
  if (Array.isArray(raw)) {
    return raw
      .filter(isObj)
      .map((m): MarketPrice | null => {
        const name = str(pick(m, ["market", "name", "bazar", "bazaar", "marketName"]));
        const price = parseNumber(pick(m, ["price", "todayPrice", "currentPrice", "amount"]));
        return name && price !== null ? { market: name, price } : null;
      })
      .filter((m): m is MarketPrice => m !== null);
  }
  if (isObj(raw)) {
    return Object.entries(raw)
      .map(([market, v]) => ({ market, price: parseNumber(isObj(v) ? pick(v, ["price"]) : v) }))
      .filter((m): m is MarketPrice => m.price !== null);
  }
  return [];
}

export function normalizeProduct(raw: Raw): Product | null {
  const id = str(pick(raw, ["id", "_id", "productId"]));
  const name = str(pick(raw, ["nameBn", "name", "title", "productName"]));
  if (!name) return null;

  const price =
    parseNumber(pick(raw, ["price", "todayPrice", "currentPrice", "today", "avgPrice"])) ?? 0;
  const yesterday = parseNumber(pick(raw, ["yesterdayPrice", "previousPrice", "prevPrice", "oldPrice"]));

  let changePercent = parseNumber(
    pick(raw, ["changePercent", "percentChange", "changePct", "change_percent", "percent", "change"]),
  );
  let changeAmount = parseNumber(pick(raw, ["changeAmount", "priceChange", "diff"]));
  if (changeAmount === null && yesterday !== null) changeAmount = price - yesterday;
  if (changePercent === null) {
    changePercent = yesterday ? ((price - yesterday) / yesterday) * 100 : 0;
  }
  // Some APIs send direction separately ("up" | "down") with an unsigned percent.
  const dir = str(pick(raw, ["trend", "direction", "changeType"])).toLowerCase();
  if (dir === "down" || dir === "fall") changePercent = -Math.abs(changePercent);
  if (dir === "up" || dir === "rise") changePercent = Math.abs(changePercent);

  const markets = normalizeMarkets(pick(raw, ["markets", "marketPrices", "bazars", "prices"]));
  const category = str(pick(raw, ["category", "categorySlug", "categoryId"]));
  const tagsRaw = pick(raw, ["tags"]);
  const categoryName = str(pick(raw, ["categoryName", "categoryBn"]), category);

  return {
    id: id || name,
    slug: str(pick(raw, ["slug"])) || id || name,
    name,
    emoji: str(pick(raw, ["emoji", "icon", "image"]), "🛒"),
    unit: str(pick(raw, ["unit", "unitBn"]), "প্রতি কেজি"),
    category,
    categoryName,
    tags: Array.isArray(tagsRaw) ? tagsRaw.map((t) => str(t)).filter(Boolean) : categoryName ? [categoryName] : [],
    description: str(pick(raw, ["description", "summary", "subtitle", "desc"])),
    price,
    changePercent: Number.isFinite(changePercent) ? changePercent : 0,
    changeAmount,
    markets,
  };
}

export function normalizeCategory(raw: Raw): Category | null {
  const slug = str(pick(raw, ["slug", "id", "_id", "key"]));
  const name = str(pick(raw, ["nameBn", "name", "title", "label"]));
  if (!slug && !name) return null;
  return { slug: slug || name, name: name || slug, icon: str(pick(raw, ["emoji", "icon"]), "🛒") };
}
