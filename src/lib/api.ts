import type { Category, Market, PriceChange, Product } from "@/types";
import { toNumber } from "./format";

/**
 * Centralised BazarDor API client.
 *
 * - Bases are tried in order; a base is only accepted when its response passes the
 *   validators below (so an incompatible schema is skipped, never mixed in silently).
 * - Every response is status-checked, validated and cached with Next's data cache.
 */

const DEFAULT_BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const TIMEOUT_MS = 8000;
const REVALIDATE_SECONDS = 120;

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

function getBases(): string[] {
  const fromEnv = process.env.BAZARDOR_API_BASES;
  if (!fromEnv) return DEFAULT_BASES;
  const list = fromEnv
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_BASES;
}

/* ───────────── low-level helpers ───────────── */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** A positive price, or null (zero / negative / unreadable values are treated as "missing"). */
function price(value: unknown): number | null {
  const n = toNumber(value);
  return n !== null && n > 0 ? n : null;
}

function unwrapList(json: unknown, keys: string[]): unknown[] | null {
  if (Array.isArray(json)) return json;
  if (isRecord(json)) {
    for (const key of [...keys, "data", "result", "results", "items"]) {
      const candidate = json[key];
      if (Array.isArray(candidate)) return candidate;
    }
  }
  return null;
}

function unwrapObject(json: unknown, keys: string[]): UnknownRecord | null {
  if (!isRecord(json)) return null;
  for (const key of [...keys, "data", "result"]) {
    const candidate = json[key];
    if (isRecord(candidate)) return candidate;
  }
  return json;
}

/* ───────────── normalisers (shape per the assignment guide's schema) ───────────── */

function normalizeChange(raw: unknown, today: number | null, yesterday: number | null): PriceChange | null {
  if (isRecord(raw)) {
    const dir = raw.dir;
    const pct = toNumber(raw.pct);
    if ((dir === "up" || dir === "down" || dir === "flat") && pct !== null) {
      return { dir, pct: Math.abs(pct) };
    }
  }
  // Defensible fallback built only from real API prices.
  if (today !== null && yesterday !== null) {
    const diff = today - yesterday;
    const pct = Math.round((Math.abs(diff) / yesterday) * 1000) / 10;
    return { dir: diff > 0 ? "up" : diff < 0 ? "down" : "flat", pct };
  }
  return null;
}

function normalizeMarkets(raw: unknown): Market[] {
  if (!Array.isArray(raw)) return [];
  const markets: Market[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const market = str(item.market);
    const min = price(item.min);
    const max = price(item.max);
    if (!market || min === null || max === null) continue;
    markets.push({ market, division: str(item.division), min, max });
  }
  return markets;
}

export function normalizeProduct(raw: unknown): Product | null {
  if (!isRecord(raw)) return null;
  const slug = str(raw.slug);
  const nameBn = str(raw.nameBn);
  if (!slug || !nameBn) return null;

  const today = price(raw.today);
  const yesterday = price(raw.yesterday);
  const categoryIcon = str(raw.categoryIcon);
  const id = typeof raw.id === "number" || typeof raw.id === "string" ? String(raw.id) : slug;

  return {
    id,
    slug,
    nameBn,
    category: str(raw.category),
    categoryNameBn: str(raw.categoryNameBn),
    categoryIcon,
    unit: str(raw.unit),
    image: str(raw.image) || categoryIcon || "🛒",
    description: str(raw.description) || null,
    today,
    yesterday,
    lastWeek: price(raw.lastWeek),
    lastMonth: price(raw.lastMonth),
    change: normalizeChange(raw.change, today, yesterday),
    markets: normalizeMarkets(raw.markets),
  };
}

export function normalizeCategory(raw: unknown): Category | null {
  if (!isRecord(raw)) return null;
  const slug = str(raw.slug);
  const nameBn = str(raw.nameBn);
  if (!slug || !nameBn) return null;
  const id = typeof raw.id === "number" || typeof raw.id === "string" ? String(raw.id) : slug;
  return { id, slug, nameBn, icon: str(raw.icon) };
}

export function parseProducts(json: unknown): Product[] | null {
  const list = unwrapList(json, ["products"]);
  if (!list) return null;
  const products = list.map(normalizeProduct).filter((p): p is Product => p !== null);
  // A non-empty payload with zero valid items means the schema is not what we expect.
  if (list.length > 0 && products.length === 0) return null;
  return products;
}

export function parseCategories(json: unknown): Category[] | null {
  const list = unwrapList(json, ["categories"]);
  if (!list) return null;
  const categories = list.map(normalizeCategory).filter((c): c is Category => c !== null);
  if (list.length > 0 && categories.length === 0) return null;
  return categories;
}

/* ───────────── request with failover ───────────── */

async function request<T>(
  path: string,
  parse: (json: unknown) => T | null,
  options: { notFoundOnInvalid?: boolean } = {},
): Promise<T> {
  let sawNotFound = false;
  let sawInvalid = false;

  for (const base of getBases()) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (res.status === 404) {
        sawNotFound = true;
        continue;
      }
      if (!res.ok) continue;
      const parsed = parse((await res.json()) as unknown);
      if (parsed !== null) return parsed;
      sawInvalid = true;
    } catch {
      // network error, timeout or invalid JSON → try the next base
    }
  }

  if (sawNotFound || (options.notFoundOnInvalid && sawInvalid)) {
    throw new ApiError("Resource not found", 404);
  }
  throw new ApiError("BazarDor API is unavailable", 503);
}

/* ───────────── public API ───────────── */

export function getProducts(): Promise<Product[]> {
  return request("/products", parseProducts);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    return await request(`/products?category=${encodeURIComponent(slug)}`, parseProducts);
  } catch (error) {
    if (isNotFoundError(error)) return [];
    throw error;
  }
}

export function getCategories(): Promise<Category[]> {
  return request("/categories", parseCategories);
}

/** Returns null for an unknown category; throws ApiError(503) when the API is unreachable. */
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    return await request(
      `/categories/${encodeURIComponent(slug)}`,
      (json) => normalizeCategory(unwrapObject(json, ["category"])),
      { notFoundOnInvalid: true },
    );
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

/**
 * Resolves the route param to a product. The param is matched against `slug` first;
 * a numeric id is only used as a lookup fallback (a numeric id is never assumed to be a slug).
 */
export async function getProductBySlug(param: string): Promise<Product | null> {
  const products = await getProducts();
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const byId = products.find((p) => p.id === param);
  if (byId) return byId;

  if (/^\d+$/.test(param)) {
    try {
      return await request(`/products/${param}`, (json) => normalizeProduct(unwrapObject(json, ["product"])), {
        notFoundOnInvalid: true,
      });
    } catch (error) {
      if (isNotFoundError(error)) return null;
      throw error;
    }
  }
  return null;
}
