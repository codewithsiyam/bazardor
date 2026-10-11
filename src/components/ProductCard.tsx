import Link from "next/link";
import { formatNumber } from "@/lib/bn";
import type { Product } from "@/types";
import PriceBadge from "./PriceBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group flex w-full flex-col gap-4 rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-2xl" aria-hidden>
          {product.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-snug group-hover:text-brand-dark">{product.name}</h3>
          {product.unit && <p className="text-xs text-muted">{product.unit}</p>}
        </div>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-muted">আজকের দাম</p>
          {product.price === null ? (
            <p className="text-sm font-medium text-muted">দাম পাওয়া যায়নি</p>
          ) : (
            <p>
              <span className="text-xl font-bold">{formatNumber(product.price)}</span>{" "}
              <span className="text-sm font-medium">টাকা</span>
            </p>
          )}
        </div>
        <PriceBadge changePercent={product.changePercent} />
      </div>
    </Link>
  );
}
