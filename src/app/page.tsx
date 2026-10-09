import { Suspense } from "react";
import { getProducts } from "@/lib/api";
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
  const risers = products.filter((p) => p.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
  const fallers = products.filter((p) => p.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);
  return (
    <>
      <ProductSection title="আজ দাম বেড়েছে ▲" subtitle="গতকালের তুলনায় সবচেয়ে বেশি দাম বেড়েছে যেসব পণ্যের" products={risers} />
      <ProductSection title="আজ দাম কমেছে ▼" subtitle="গতকালের তুলনায় সবচেয়ে বেশি দাম কমেছে যেসব পণ্যের" products={fallers} />
      <ProductSection id="সব-পণ্য" title="সব পণ্য" subtitle={`মোট ${new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে`} products={products} />
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
