import "server-only";
import { normalizeCategory, normalizeProduct, unwrapList, unwrapOne } from "./normalize";
import type { Category, Product } from "@/types";

/**
 * Primary API first, mirror second. Override with BAZARDOR_API_URL / BAZARDOR_API_URL_FALLBACK.
 * This is the only place that knows about URLs, so switching APIs is a one-line change.
 */
const BASES = [
  process.env.BAZARDOR_API_URL ?? "https://api.api-store.workers.dev/api/bazardor",
  process.env.BAZARDOR_API_URL_FALLBACK ?? "https://api.abcz.workers.dev/api/bazardor",
];

const REVALIDATE_SECONDS = 300;

export class ApiError extends Error {}

async function request(path: string): Promise<unknown | null> {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(10_000),
      });
      if (res.status === 404) return null; // a real "not found" — don't try the mirror
      if (!res.ok) continue;
      return await res.json();
    } catch {
      // network error / timeout: try the next base URL
    }
  }
  throw new ApiError("API unavailable");
}

export async function getProducts(category?: string): Promise<Product[]> {
  const json = await request(category ? `/products?category=${encodeURIComponent(category)}` : "/products");
  return unwrapList(json, ["products"])
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null);
}

export async function getProduct(slug: string): Promise<Product | null> {
  // Slug may be a real slug or the numeric id; resolve against the list first.
  const all = await getProducts();
  const hit = all.find((p) => p.slug === slug || p.id === slug);
  if (hit) return hit;
  const json = await request(`/products/${encodeURIComponent(slug)}`);
  const raw = unwrapOne(json, ["product"]);
  return raw ? normalizeProduct(raw) : null;
}

export async function getCategories(): Promise<Category[]> {
  const json = await request("/categories");
  return unwrapList(json, ["categories"])
    .map(normalizeCategory)
    .filter((c): c is Category => c !== null);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const json = await request(`/categories/${encodeURIComponent(slug)}`);
  const raw = unwrapOne(json, ["category"]);
  return raw ? normalizeCategory(raw) : null;
}
