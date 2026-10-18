import type { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { formatCount } from "@/lib/format";
import { getFallers, getRisers } from "@/lib/products";
import Hero from "@/components/Hero";
import PriceMovers from "@/components/PriceMovers";
import ProductGrid from "@/components/ProductGrid";
import RetryButton from "@/components/RetryButton";
import StatusCard from "@/components/StatusCard";

export const dynamic = "force-dynamic";

async function load(): Promise<Product[] | null> {
  try {
    return await getProducts();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const products = await load();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-6 sm:px-6">
      <Hero />

      {products === null ? (
        <StatusCard
          emoji="⚠️"
          title="দামের তথ্য লোড করা যায়নি"
          description="বাজার দরের সার্ভারে এই মুহূর্তে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
        </StatusCard>
      ) : (
        <>
          <PriceMovers direction="up" products={getRisers(products)} />
          <PriceMovers direction="down" products={getFallers(products)} />

          <section id="সব-পণ্য" aria-labelledby="all-products" className="scroll-mt-32 space-y-3">
            <div>
              <h2 id="all-products" className="text-xl font-bold">
                সব পণ্য
              </h2>
              <p className="text-sm text-base-content/70">মোট {formatCount(products.length)}টি পণ্য দেখানো হচ্ছে</p>
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <StatusCard emoji="🧺" title="এখনো কোনো পণ্য নেই" description="পরে আবার দেখুন।" />
            )}
          </section>
        </>
      )}
    </div>
  );
}
