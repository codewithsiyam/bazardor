import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

/** 1 column on phones, 2 on tablets, 3 on desktop (matches the Figma grid). */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
