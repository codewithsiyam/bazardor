import type { Product } from "@/types";
import ProductGrid from "./ProductGrid";

/** "আজ দাম বেড়েছে ▲" / "আজ দাম কমেছে ▼" — only products with real change data. */
export default function PriceMovers({ direction, products }: { direction: "up" | "down"; products: Product[] }) {
  const isUp = direction === "up";
  const title = isUp ? "আজ দাম বেড়েছে" : "আজ দাম কমেছে";
  const emptyText = isUp
    ? "এই মুহূর্তে দাম বাড়ার মতো পর্যাপ্ত তথ্য নেই।"
    : "এই মুহূর্তে দাম কমার মতো পর্যাপ্ত তথ্য নেই।";

  return (
    <section aria-labelledby={`movers-${direction}`} className="space-y-3">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={isUp ? "text-error" : "text-success"}>
          {isUp ? "▲" : "▼"}
        </span>
        <h2 id={`movers-${direction}`} className="text-xl font-bold">
          {title}
        </h2>
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-4 py-6 text-center text-sm text-base-content/60">
          {emptyText}
        </p>
      )}
    </section>
  );
}
