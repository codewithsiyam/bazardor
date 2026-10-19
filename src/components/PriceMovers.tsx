import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types";

interface PriceMoversProps {
  direction: "up" | "down";
  products: Product[];
}

const CONFIG = {
  up: {
    id: "price-risers",
    arrow: "▲",
    arrowClass: "text-error",
    title: "আজ দাম বেড়েছে",
    empty: "আজ দাম বাড়ার মতো কোনো তথ্য পাওয়া যায়নি।",
  },
  down: {
    id: "price-fallers",
    arrow: "▼",
    arrowClass: "text-success",
    title: "আজ দাম কমেছে",
    empty: "আজ দাম কমার মতো কোনো তথ্য পাওয়া যায়নি।",
  },
} as const;

/** Up to six items the API itself flags as risen / fallen (never guessed). */
export default function PriceMovers({ direction, products }: PriceMoversProps) {
  const config = CONFIG[direction];

  return (
    <section aria-labelledby={config.id} className="space-y-3">
      <h2 id={config.id} className="flex items-center gap-2 text-xl font-bold">
        <span aria-hidden="true" className={`text-base ${config.arrowClass}`}>
          {config.arrow}
        </span>
        {config.title}
      </h2>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-4 py-6 text-center text-sm text-base-content/70">
          {config.empty}
        </p>
      )}
    </section>
  );
}
