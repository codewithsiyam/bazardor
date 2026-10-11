import { notFound } from "next/navigation";
import { getCategory, getProducts } from "@/lib/api";
import CategoryView from "@/components/CategoryView";
import ErrorState from "@/components/ErrorState";

export async function generateMetadata({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = await getCategory(decodeURIComponent(slug)).catch(() => null);
  return { title: category?.name ?? "বিভাগ" };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const slug = decodeURIComponent((await params).slug);
  let category, products;
  try {
    [category, products] = await Promise.all([getCategory(slug), getProducts(slug)]);
  } catch {
    return <ErrorState />;
  }
  if (!category && products.length === 0) notFound(); // invalid slug -> friendly 404

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper text-2xl ring-1 ring-line" aria-hidden>
          {category?.icon ?? "🛒"}
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{category?.name ?? slug}</h1>
          <p className="text-sm text-muted">{new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      <CategoryView products={products} />
    </div>
  );
}
