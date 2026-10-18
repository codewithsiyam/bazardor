"use client";

import { useMemo, useState } from "react";
import type { Product, SortMode } from "@/types";
import { formatCount } from "@/lib/format";
import { sortProducts } from "@/lib/products";
import ProductGrid from "./ProductGrid";

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortMode>("default");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 rounded-2xl border border-base-300 bg-base-100 px-4 py-3">
        <label htmlFor="sort" className="text-sm">
          সাজান
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="select select-sm w-auto bg-base-100 shadow-sm"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-base-content/70" aria-live="polite">
        মোট {formatCount(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <ProductGrid products={sorted} />
    </div>
  );
}
