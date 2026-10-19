import type { Category, Product } from "@/types";

/** Runtime validation for API payloads (never trust an external response). */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  const change = value.change;
  return (
    isNumber(value.id) &&
    isText(value.slug) &&
    isText(value.nameBn) &&
    isText(value.category) &&
    isText(value.unit) &&
    isNumber(value.today) &&
    value.today > 0 &&
    isRecord(change) &&
    (change.dir === "up" || change.dir === "down" || change.dir === "flat") &&
    isNumber(change.pct) &&
    Array.isArray(value.markets)
  );
}

export function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    isText(value.id) &&
    isText(value.slug) &&
    isText(value.nameBn) &&
    isText(value.icon)
  );
}

/** Accepts a bare array or a wrapper such as { data: [...] } / { products: [...] }. */
export function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    for (const key of ["data", "products", "categories", "result", "items"]) {
      const candidate = payload[key];
      if (Array.isArray(candidate)) return candidate;
    }
  }
  return [];
}
