import Link from "next/link";
import { formatTaka } from "@/lib/bn";
import type { Product } from "@/types";
import PriceBadge from "./PriceBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-soft text-3xl" aria-hidden>
        {product.emoji}
      </span>
      <div>
        <h3 className="text-lg font-semibold leading-snug group-hover:text-brand-dark">{product.name}</h3>
        <p className="text-sm text-muted">{product.unit}</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 border-t border-line pt-3">
        <div>
          <p className="text-xs text-muted">আজকের দাম</p>
          <p className="text-lg font-bold">{formatTaka(product.price)}</p>
        </div>
        <PriceBadge changePercent={product.changePercent} />
      </div>
    </Link>
  );
}
