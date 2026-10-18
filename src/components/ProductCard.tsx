import Link from "next/link";
import type { Product } from "@/types";
import { formatTaka, getUnitBn } from "@/lib/format";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  const unit = getUnitBn(product.unit);
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group block rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:border-primary/50 hover:shadow-md focus-visible:border-primary"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl"
          aria-hidden="true"
        >
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-6">{product.nameBn}</h3>
          {unit && <p className="text-xs leading-4 text-base-content/60">{unit}</p>}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs leading-4 text-base-content/60">আজকের দাম</p>
          <p className="text-xl font-bold leading-7">{formatTaka(product.today)}</p>
        </div>
        <ChangeBadge change={product.change} />
      </div>
    </Link>
  );
}
