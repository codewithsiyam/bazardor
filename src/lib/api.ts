import { cache } from "react";
import type { Category, Product } from "@/types";
import { extractList, isCategory, isProduct } from "@/lib/guards";
import { findProductByParam } from "@/lib/products";

/**
 * Centralised BazarDor API client.
 *
 * - Primary source: https://openapi.programming-hero.com/api/bazardor (the "main API" of the
 *   assignment). Its schema was inspected live and is identical to the two mirrors below.
 * - The mirrors (api-store / abcz workers) are tried ONLY when the primary host fails
 *   (network error, non-2xx, or a payload that does not match the schema).
 * - A source is never merged with another: each list comes whole from the first
 *   source that answers with valid records.
 * - Every payload is validated at runtime; nothing is invented or patched.
 */

const DEFAULT_BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  readonly failures: string[];

  constructor(message: string, failures: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.failures = failures;
  }
}

function apiBases(): string[] {
  const custom = process.env.BAZARDOR_API_URL?.trim().replace(/\/+$/, "");
  if (!custom) return DEFAULT_BASES;
  return [custom, ...DEFAULT_BASES.filter((base) => base !== custom)];
}

async function fetchList<T>(
  path: string,
  guard: (value: unknown) => value is T,
  label: string,
): Promise<T[]> {
  const failures: string[] = [];

  for (const base of apiBases()) {
    try {
      const response = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        failures.push(`${base}${path} → HTTP ${response.status}`);
        continue;
      }

      const payload: unknown = await response.json();
      const records = extractList(payload).filter(guard);
      if (records.length === 0) {
        failures.push(`${base}${path} → no valid ${label} records`);
        continue;
      }
      return records;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown error";
      failures.push(`${base}${path} → ${reason}`);
    }
  }

  throw new ApiError(`${label} could not be loaded from any API source`, failures);
}

/** `cache()` de-duplicates the call within a single server render. */
export const getProducts = cache(
  async (): Promise<Product[]> => fetchList("/products", isProduct, "products"),
);

export const getCategories = cache(
  async (): Promise<Category[]> => fetchList("/categories", isCategory, "categories"),
);

/** Resolves by slug (canonical) or numeric id. Returns null when unknown. */
export async function getProductByParam(param: string): Promise<Product | null> {
  const products = await getProducts();
  return findProductByParam(products, param);
}

export interface CategoryWithProducts {
  category: Category;
  products: Product[];
}

/** Returns null when the slug is not a real category (-> 404 page). */
export async function getCategoryWithProducts(slug: string): Promise<CategoryWithProducts | null> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;
  return {
    category,
    products: products.filter((product) => product.category === category.slug),
  };
}
