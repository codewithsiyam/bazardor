import AllProducts from "@/components/AllProducts";
import Hero from "@/components/Hero";
import PriceMovers from "@/components/PriceMovers";
import RetryButton from "@/components/RetryButton";
import StateMessage from "@/components/StateMessage";
import { getProducts } from "@/lib/api";
import { getFallers, getRisers } from "@/lib/products";

// Always render on request (fresh HTML, no build-time dependency on the API).
// The API responses themselves are cached for 5 minutes in lib/api.ts.
export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts().catch((error: unknown) => {
    console.error("[home] products could not be loaded:", error);
    return null;
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6">
      <Hero />

      {products ? (
        <>
          <PriceMovers direction="up" products={getRisers(products)} />
          <PriceMovers direction="down" products={getFallers(products)} />
          <AllProducts products={products} />
        </>
      ) : (
        <StateMessage
          role="alert"
          emoji="⚠️"
          title="দামের তথ্য লোড করা যায়নি"
          description="ইন্টারনেট সংযোগ বা সার্ভারে সাময়িক সমস্যা হতে পারে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
        </StateMessage>
      )}
    </div>
  );
}
