import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import RetryButton from "@/components/RetryButton";
import StateMessage from "@/components/StateMessage";
import { getCategoryWithProducts } from "@/lib/api";
import { toBengaliNumber } from "@/lib/format";

export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithProducts(slug).catch(() => null);
  return { title: data ? `${data.category.nameBn} — আজকের দাম` : "ক্যাটাগরি" };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let data: Awaited<ReturnType<typeof getCategoryWithProducts>>;
  try {
    data = await getCategoryWithProducts(slug);
  } catch (error) {
    console.error(`[category/${slug}] could not be loaded:`, error);
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <StateMessage
          role="alert"
          emoji="⚠️"
          title="দামের তথ্য লোড করা যায়নি"
          description="ইন্টারনেট সংযোগ বা সার্ভারে সাময়িক সমস্যা হতে পারে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
        </StateMessage>
      </div>
    );
  }

  // Unknown slug -> real 404 (renders app/not-found.tsx with the home CTA).
  if (!data) notFound();

  const { category, products } = data;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <span className="text-4xl" aria-hidden="true">
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{category.nameBn}</h1>
          <p className="text-sm text-base-content/70">
            {toBengaliNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </header>

      {products.length > 0 ? (
        <CategoryProducts products={products} />
      ) : (
        <StateMessage
          emoji="🧺"
          title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
          description="এখনো এই ক্যাটাগরির কোনো পণ্যের দাম যোগ করা হয়নি।"
          action={{ href: "/", label: "হোম পেজে ফিরে যান" }}
        />
      )}
    </div>
  );
}
