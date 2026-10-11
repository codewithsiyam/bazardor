import type { ReactNode } from "react";
import type { Product } from "@/types";
import ProductGrid from "./ProductGrid";

export default function ProductSection({
  id, title, subtitle, products, emptyMessage = "এই মুহূর্তে কোনো পণ্য নেই।",
}: { id?: string; title: ReactNode; subtitle?: string; products: Product[]; emptyMessage?: string }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-5">
        {products.length ? <ProductGrid products={products} /> : <p className="rounded-2xl border border-line bg-paper p-4 text-muted">{emptyMessage}</p>}
      </div>
    </section>
  );
}
