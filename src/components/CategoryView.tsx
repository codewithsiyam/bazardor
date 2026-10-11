"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import ProductGrid from "./ProductGrid";

type Sort = "default" | "asc" | "desc";

export default function CategoryView({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("default");

  // Sorting uses the numeric `price` field (never the Bengali display string).
  const sorted = useMemo(() => {
    if (sort === "default") return products;
    // Copy first (never mutate the shared array). Products without a price always go last.
    return [...products].sort((a, b) => {
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return sort === "asc" ? a.price - b.price : b.price - a.price;
    });
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl" aria-hidden>🧺</p>
        <h2 className="mt-3 text-xl font-bold">এই বিভাগে কোনো পণ্য পাওয়া যায়নি</h2>
        <Link href="/" className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          সাজান:
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none rounded-full border border-line bg-paper py-2 pl-4 pr-9 text-sm"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
            </svg>
          </span>
        </label>
      </div>
      <ProductGrid products={sorted} />
    </>
  );
}
