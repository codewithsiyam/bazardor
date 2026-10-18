import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Category, Product } from "@/types";
import { getCategory, getProductsByCategory } from "@/lib/api";
import { formatCount } from "@/lib/format";
import { safeDecode } from "@/lib/utils";
import CategoryProducts from "@/components/CategoryProducts";
import RetryButton from "@/components/RetryButton";
import StatusCard from "@/components/StatusCard";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

type LoadResult = { status: "ok"; category: Category; products: Product[] } | { status: "missing" } | { status: "error" };

async function load(slug: string): Promise<LoadResult> {
  try {
    const [category, products] = await Promise.all([getCategory(slug), getProductsByCategory(slug)]);
    return category ? { status: "ok", category, products } : { status: "missing" };
  } catch {
    return { status: "error" };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = safeDecode((await params).slug);
  try {
    const category = await getCategory(slug);
    return { title: category ? `${category.nameBn} — আজকের দাম` : "ক্যাটাগরি পাওয়া যায়নি" };
  } catch {
    return { title: "ক্যাটাগরি" };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const slug = safeDecode((await params).slug);
  const result = await load(slug);

  if (result.status === "missing") notFound();

  if (result.status === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <StatusCard
          emoji="⚠️"
          title="ক্যাটাগরির তথ্য লোড করা যায়নি"
          description="বাজার দরের সার্ভারে এই মুহূর্তে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
          <Link href="/" className="btn btn-ghost">
            হোম পেজে ফিরে যান
          </Link>
        </StatusCard>
      </div>
    );
  }

  const { category, products } = result;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6">
      <header className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        {category.icon && (
          <span className="text-4xl" aria-hidden="true">
            {category.icon}
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold">{category.nameBn}</h1>
          <p className="text-sm text-base-content/70">{formatCount(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>

      {products.length > 0 ? (
        <CategoryProducts products={products} />
      ) : (
        <StatusCard
          emoji="🧺"
          title="এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই"
          description="পরে আবার দেখুন অথবা অন্য ক্যাটাগরি থেকে দাম দেখুন।"
        >
          <Link href="/" className="btn btn-primary">
            হোম পেজে ফিরে যান
          </Link>
        </StatusCard>
      )}
    </div>
  );
}
