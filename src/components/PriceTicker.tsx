import { formatPercent, formatPrice, getTakaPerUnit } from "@/lib/format";
import { getProductEmoji } from "@/lib/products";
import type { Product } from "@/types";

const CHANGE_STYLE = {
  up: { arrow: "▲", className: "text-error" },
  down: { arrow: "▼", className: "text-success" },
  flat: { arrow: "—", className: "text-base-content/60" },
} as const;

function TickerList({ products, hidden = false }: { products: Product[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {products.map((product) => {
        const style = CHANGE_STYLE[product.change.dir];
        return (
          <li
            key={product.id}
            className="flex items-center gap-1.5 whitespace-nowrap border-r border-base-200 px-4 py-2 text-sm"
          >
            <span aria-hidden="true">{getProductEmoji(product)}</span>
            <span className="font-medium">{product.nameBn}</span>
            <span>
              {formatPrice(product.today)} {getTakaPerUnit(product.unit)}
            </span>
            <span className={`font-semibold ${style.className}`}>
              {style.arrow} {formatPercent(product.change.dir === "flat" ? 0 : product.change.pct)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Infinite horizontal price strip. The list is rendered twice and the track is
 * translated by -50%, which makes the loop seamless. Pauses on hover/focus and
 * stops (becomes scrollable) when the user prefers reduced motion.
 */
export default function PriceTicker({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const duration = Math.max(40, Math.round(products.length * 3.5));

  return (
    <section
      aria-label="আজকের পণ্যের দাম"
      className="bz-marquee overflow-hidden border-b border-base-300 bg-base-100"
    >
      <div className="bz-marquee-track" style={{ animationDuration: `${duration}s` }}>
        <TickerList products={products} />
        <TickerList products={products} hidden />
      </div>
    </section>
  );
}
