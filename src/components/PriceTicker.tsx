import type { Product } from "@/types";
import { formatPercent, formatPrice, getUnitName } from "@/lib/format";

const ARROWS = { up: "▲", down: "▼", flat: "—" } as const;
const COLORS = { up: "text-error", down: "text-success", flat: "text-base-content/60" } as const;

function TickerItem({ product }: { product: Product }) {
  const unit = getUnitName(product.unit);
  return (
    <span className="flex h-9 items-center gap-2 whitespace-nowrap border-r border-base-200 px-4 text-sm">
      <span aria-hidden="true">{product.image}</span>
      <span className="font-medium">{product.nameBn}</span>
      <span>
        {formatPrice(product.today)} টাকা{unit ? `/${unit}` : ""}
      </span>
      {product.change && (
        <span className={`font-semibold ${COLORS[product.change.dir]}`}>
          {ARROWS[product.change.dir]} {formatPercent(product.change.pct)}
        </span>
      )}
    </span>
  );
}

/** Infinite price strip. The list is rendered twice and shifted by -50% for a seamless loop. */
export default function PriceTicker({ products }: { products: Product[] }) {
  const items = products.filter((p) => p.today !== null);
  if (items.length === 0) return null;

  return (
    <div className="ticker overflow-hidden border-b border-base-300 bg-base-100" role="region" aria-label="আজকের দামের তালিকা">
      <div className="ticker-track" style={{ animationDuration: `${Math.max(40, items.length * 4)}s` }}>
        <div className="flex">
          {items.map((product) => (
            <TickerItem key={`a-${product.slug}`} product={product} />
          ))}
        </div>
        <div className="flex" aria-hidden="true">
          {items.map((product) => (
            <TickerItem key={`b-${product.slug}`} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
