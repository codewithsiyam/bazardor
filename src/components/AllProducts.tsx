import ProductGrid from "@/components/ProductGrid";
import StateMessage from "@/components/StateMessage";
import { toBengaliNumber } from "@/lib/format";
import type { Product } from "@/types";

export default function AllProducts({ products }: { products: Product[] }) {
  return (
    <section id="সব-পণ্য" aria-labelledby="all-products-title" className="scroll-mt-6 space-y-3">
      <h2 id="all-products-title" className="text-xl font-bold">
        সব পণ্য
      </h2>
      {products.length > 0 ? (
        <>
          <p className="text-sm text-base-content/70">
            মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
          <ProductGrid products={products} />
        </>
      ) : (
        <StateMessage
          emoji="🧺"
          title="কোনো পণ্য পাওয়া যায়নি"
          description="এই মুহূর্তে দেখানোর মতো কোনো পণ্যের তথ্য নেই।"
        />
      )}
    </section>
  );
}
