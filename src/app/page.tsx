import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import { trendOf } from "@/lib/bn";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import ErrorState from "@/components/ErrorState";
import { SectionSkeleton } from "@/components/Skeletons";

async function HomeSections() {
  let products;
  try {
    products = await getProducts();
  } catch {
    return <ErrorState />;
  }
  if (products.length === 0) {
    return <ErrorState title="কোনো পণ্য পাওয়া যায়নি" message="এই মুহূর্তে পণ্যের তালিকা খালি। একটু পরে আবার চেষ্টা করুন।" />;
  }

  // Only products with GENUINE change data (from the API, or computed from real current + previous prices).
  const withChange = products.filter((p): p is typeof p & { changePercent: number } => p.changePercent !== null);
  const risers = withChange.filter((p) => trendOf(p.changePercent) === "up").sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
  const fallers = withChange.filter((p) => trendOf(p.changePercent) === "down").sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);
  const noChangeData = withChange.length === 0 ? "এই মুহূর্তে দাম পরিবর্তনের তথ্য পাওয়া যায়নি।" : undefined;

  return (
    <>
      <ProductSection
        title={<><span className="text-rise" aria-hidden>▲</span> আজ দাম বেড়েছে</>}
        subtitle="গতকালের তুলনায় সবচেয়ে বেশি দাম বেড়েছে যেসব পণ্যের"
        products={risers}
        emptyMessage={noChangeData ?? "আজ কোনো পণ্যের দাম বাড়েনি।"}
      />
      <ProductSection
        title={<><span className="text-fall" aria-hidden>▼</span> আজ দাম কমেছে</>}
        subtitle="গতকালের তুলনায় সবচেয়ে বেশি দাম কমেছে যেসব পণ্যের"
        products={fallers}
        emptyMessage={noChangeData ?? "আজ কোনো পণ্যের দাম কমেনি।"}
      />
      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle={`মোট ${new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে`}
        products={products}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<><SectionSkeleton /><SectionSkeleton /><SectionSkeleton count={8} /></>}>
        <HomeSections />
      </Suspense>
    </>
  );
}
