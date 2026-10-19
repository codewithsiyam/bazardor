import Link from "next/link";
import ChangeBadge from "@/components/ChangeBadge";
import { formatTaka, getPerUnitBn } from "@/lib/format";
import { getProductEmoji } from "@/lib/products";
import type { Product } from "@/types";

/** Whole card is a link to the (protected) product detail page. */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group block h-full rounded-2xl border border-base-300 bg-base-100 transition-all hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-base-200 text-2xl"
          >
            {getProductEmoji(product)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold group-hover:text-primary">
              {product.nameBn}
            </h3>
            <p className="text-xs text-base-content/70">{getPerUnitBn(product.unit)}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-base-content/70">আজকের দাম</p>
            <p className="text-xl font-bold">{formatTaka(product.today)}</p>
          </div>
          <ChangeBadge change={product.change} />
        </div>
      </div>
    </Link>
  );
}
