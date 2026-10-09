import type { Product } from "@/types";
import ProductGrid from "./ProductGrid";

export default function ProductSection({
  id, title, subtitle, products,
}: { id?: string; title: string; subtitle?: string; products: Product[] }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-5">
        {products.length ? <ProductGrid products={products} /> : <p className="text-muted">এই মুহূর্তে কোনো পণ্য নেই।</p>}
      </div>
    </section>
  );
}
