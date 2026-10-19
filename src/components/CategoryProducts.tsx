"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import SortSelect from "@/components/SortSelect";
import { toBengaliNumber } from "@/lib/format";
import { sortProducts } from "@/lib/products";
import type { Product, SortMode } from "@/types";

/**
 * Sort bar + grid. Sorting always uses the numeric `today` value; the Bengali
 * digits you see on screen are produced only at render time.
 */
export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortMode>("default");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <>
      <div className="flex items-center justify-end rounded-2xl border border-base-300 bg-base-100 p-4">
        <SortSelect value={sort} onChange={setSort} />
      </div>
      <p className="text-sm text-base-content/70" aria-live="polite">
        মোট {toBengaliNumber(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>
      <ProductGrid products={sorted} />
    </>
  );
}
