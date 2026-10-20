import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ChangeBadge from "@/components/ChangeBadge";
import RetryButton from "@/components/RetryButton";
import StateMessage from "@/components/StateMessage";
import { getProductByParam } from "@/lib/api";
import { formatPrice, formatTaka, getPerUnitBn, getUnitBn } from "@/lib/format";
import { getDayDifference, getMarketRows, getPriceSummary, getProductEmoji } from "@/lib/products";
import { requireSession } from "@/lib/session";
import { safeDecode } from "@/lib/utils";
import type { Product } from "@/types";

// Protected + user-specific: always rendered on the server for each request.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "পণ্যের বিবরণ" };

type PageProps = { params: Promise<{ slug: string }> };
type LoadResult = { status: "ok"; product: Product } | { status: "missing" } | { status: "error" };

async function load(slug: string): Promise<LoadResult> {
  try {
    const product = await getProductByParam(slug);
    return product ? { status: "ok", product } : { status: "missing" };
  } catch (error) {
    console.error(`[product/${slug}] could not be loaded:`, error);
    return { status: "error" };
  }
}

/** "গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা" — only built from real yesterday/today values. */
function describeDayChange(product: Product): string | null {
  const difference = getDayDifference(product);
  if (difference === null) return null;
  if (product.change.dir === "flat" || difference === 0) return "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  const verb = product.change.dir === "up" ? "বেড়েছে" : "কমেছে";
  return `গতকালের তুলনায় আজ দাম ${verb} · ${formatTaka(difference)}`;
}

function StatCard({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: string;
  caption: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-4">
      <p className="text-xs text-base-content/70">{label}</p>
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs text-base-content/70">{caption}</p>
    </div>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const slug = safeDecode((await params).slug);

  // Real server-side session check (reads the session from the database). Logged-out
  // visitors are redirected to /signin and see a toast explaining why.
  await requireSession(`/product/${encodeURIComponent(slug)}`);

  const result = await load(slug);
  if (result.status === "missing") notFound();
  if (result.status === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <StateMessage
          role="alert"
          emoji="⚠️"
          title="পণ্যের তথ্য লোড করা যায়নি"
          description="বাজার দরের সার্ভারে এই মুহূর্তে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
          <Link href="/" className="btn btn-ghost">
            হোম পেজে ফিরে যান
          </Link>
        </StateMessage>
      </div>
    );
  }

  const { product } = result;
  const perUnit = getPerUnitBn(product.unit);
  const unitLabel = getUnitBn(product.unit);
  const summary = getPriceSummary(product);
  const rows = getMarketRows(product);
  const dayChange = describeDayChange(product);
  const categoryHref = `/category/${encodeURIComponent(product.category)}`;
  const categoryName = product.categoryNameBn ?? null;

  const history = [
    { label: "আজ", value: product.today },
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ].filter((item): item is { label: string; value: number } => typeof item.value === "number");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
      <nav className="breadcrumbs py-2 text-sm" aria-label="breadcrumb">
        <ul>
          <li>
            <Link href="/">হোম</Link>
          </li>
          {categoryName && (
            <li>
              <Link href={categoryHref}>{categoryName}</Link>
            </li>
          )}
          <li aria-current="page">{product.nameBn}</li>
        </ul>
      </nav>

      <header className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-20 shrink-0 place-items-center rounded-2xl bg-base-200 text-4xl"
          >
            {getProductEmoji(product)}
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight">{product.nameBn}</h1>
            <p className="text-sm">
              {perUnit}
              {categoryName && (
                <>
                  {" · "}
                  <Link href={categoryHref} className="hover:text-primary hover:underline">
                    {categoryName}
                  </Link>
                </>
              )}
            </p>
            {dayChange && <p className="mt-2 text-sm">{dayChange}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start rounded-2xl bg-base-200 px-5 py-4 sm:min-w-[150px]">
          <p className="text-sm">আজকের দাম</p>
          <p className="text-3xl font-bold leading-tight">{formatPrice(product.today)}</p>
          <p className="text-sm">{unitLabel ? `টাকা / ${unitLabel}` : "টাকা"}</p>
          <div className="mt-1">
            <ChangeBadge change={product.change} size="md" />
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-8 rounded-2xl border border-base-300 bg-base-100 p-5">
        <section aria-labelledby="price-summary" className="flex flex-col gap-3">
          <h2 id="price-summary" className="text-lg font-semibold">
            দামের সারসংক্ষেপ
          </h2>
          {summary ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="সর্বনিম্ন দাম"
                value={formatTaka(summary.min)}
                caption={`সবচেয়ে কম দামের বাজার: ${summary.minMarket.market}`}
                tone="text-success"
              />
              <StatCard
                label="সর্বাধিক দাম"
                value={formatTaka(summary.max)}
                caption={`সবচেয়ে বেশি দামের বাজার: ${summary.maxMarket.market}`}
                tone="text-error"
              />
              <StatCard
                label="গড় দাম"
                value={formatTaka(summary.avg)}
                caption={unitLabel ? `প্রতি ${unitLabel}-এর হিসাবে` : "সব বাজারের গড়"}
                tone="text-primary"
              />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-base-300 px-4 py-6 text-center text-sm text-base-content/70">
              এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি, তাই সর্বনিম্ন, সর্বাধিক ও গড় দাম দেখানো যাচ্ছে না।
            </p>
          )}
        </section>

        <section aria-labelledby="market-prices" className="flex flex-col gap-3">
          <h2 id="market-prices" className="text-lg font-semibold">
            বাজারভিত্তিক আজকের দাম
          </h2>
          {rows.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-base-300">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-sm text-base-content">
                    <th scope="col">বাজার</th>
                    <th scope="col">বিভাগ</th>
                    <th scope="col" className="text-right">
                      সর্বনিম্ন
                    </th>
                    <th scope="col" className="text-right">
                      সর্বাধিক
                    </th>
                    <th scope="col" className="text-right">
                      গড়
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.market}-${row.division}`}>
                      <th scope="row" className="font-medium">
                        {row.market}
                      </th>
                      <td>{row.division || "—"}</td>
                      <td className="text-right">{formatTaka(row.min)}</td>
                      <td className="text-right">{formatTaka(row.max)}</td>
                      <td className="text-right font-semibold">{formatTaka(row.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-base-300 px-4 py-6 text-center text-sm text-base-content/70">
              বাজারভিত্তিক দামের তালিকা এখনো পাওয়া যায়নি।
            </p>
          )}
        </section>

        {history.length > 1 && (
          <section aria-labelledby="price-history" className="flex flex-col gap-3">
            <h2 id="price-history" className="text-lg font-semibold">
              আগের দামের সাথে তুলনা
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {history.map((item) => (
                <div key={item.label} className="rounded-xl bg-base-200 px-4 py-3">
                  <dt className="text-xs text-base-content/70">{item.label}</dt>
                  <dd className="text-lg font-bold">{formatTaka(item.value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
