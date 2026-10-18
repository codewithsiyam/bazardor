import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Product } from "@/types";
import { getProductBySlug } from "@/lib/api";
import { formatPrice, formatTaka, getUnitBn, getUnitName } from "@/lib/format";
import { changeSummary, computeMarketStats, marketAverage } from "@/lib/products";
import { requireUser } from "@/lib/session";
import { safeDecode } from "@/lib/utils";
import ChangeBadge from "@/components/ChangeBadge";
import RetryButton from "@/components/RetryButton";
import StatusCard from "@/components/StatusCard";

// Protected + user-specific: always rendered on the server per request.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "পণ্যের বিবরণ" };

type PageProps = { params: Promise<{ slug: string }> };
type LoadResult = { status: "ok"; product: Product } | { status: "missing" } | { status: "error" };

async function load(slug: string): Promise<LoadResult> {
  try {
    const product = await getProductBySlug(slug);
    return product ? { status: "ok", product } : { status: "missing" };
  } catch {
    return { status: "error" };
  }
}

function Unavailable({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <StatusCard emoji="⚠️" title={title} description={description}>
        <RetryButton />
        <Link href="/" className="btn btn-ghost">
          হোম পেজে ফিরে যান
        </Link>
      </StatusCard>
    </div>
  );
}

function StatCard({ label, value, caption, tone }: { label: string; value: string; caption: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <p className="text-xs text-base-content/60">{label}</p>
      <p className={`text-2xl font-bold leading-8 ${tone}`}>{value}</p>
      <p className="text-xs text-base-content/60">{caption}</p>
    </div>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const slug = safeDecode((await params).slug);

  // Real, server-side session check. Logged-out visitors are redirected to /signin.
  const auth = await requireUser(`/product/${encodeURIComponent(slug)}`);
  if (auth.state === "unavailable") {
    return (
      <Unavailable
        title="এই মুহূর্তে যাচাই করা যাচ্ছে না"
        description="অ্যাকাউন্ট সার্ভিসের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      />
    );
  }

  const result = await load(slug);
  if (result.status === "missing") notFound();
  if (result.status === "error") {
    return (
      <Unavailable
        title="পণ্যের তথ্য লোড করা যায়নি"
        description="বাজার দরের সার্ভারে এই মুহূর্তে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      />
    );
  }

  const { product } = result;
  const unitBn = getUnitBn(product.unit);
  const unitName = getUnitName(product.unit);
  const stats = computeMarketStats(product.markets);
  const summary = product.description ?? changeSummary(product);
  const history = [
    { label: "আজ", value: product.today },
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ].filter((h): h is { label: string; value: number } => h.value !== null);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6">
      <nav className="breadcrumbs text-sm" aria-label="breadcrumb">
        <ul>
          <li>
            <Link href="/">হোম</Link>
          </li>
          {product.category && product.categoryNameBn && (
            <li>
              <Link href={`/category/${encodeURIComponent(product.category)}`}>{product.categoryNameBn}</Link>
            </li>
          )}
          <li aria-current="page">{product.nameBn}</li>
        </ul>
      </nav>

      <header className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl" aria-hidden="true">
            {product.image}
          </span>
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-3xl font-bold leading-9">{product.nameBn}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
              {unitBn && <span className="rounded-full bg-base-200 px-2.5 py-0.5">{unitBn}</span>}
              {product.categoryNameBn &&
                (product.category ? (
                  <Link
                    href={`/category/${encodeURIComponent(product.category)}`}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary hover:bg-primary/15"
                  >
                    {product.categoryIcon} {product.categoryNameBn}
                  </Link>
                ) : (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                    {product.categoryNameBn}
                  </span>
                ))}
            </div>
            {summary && <p className="text-sm text-base-content/70">{summary}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1 rounded-2xl bg-base-200 px-5 py-4 sm:min-w-[150px]">
          <p className="text-sm text-base-content/70">আজকের দাম</p>
          <p className="text-3xl font-bold leading-9">{formatPrice(product.today)}</p>
          {product.today !== null && (
            <p className="text-sm text-base-content/70">টাকা{unitName ? ` / ${unitName}` : ""}</p>
          )}
          <div className="mt-1">
            <ChangeBadge change={product.change} size="md" />
          </div>
        </div>
      </header>

      <div className="space-y-8 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <section aria-labelledby="price-summary" className="space-y-3">
          <h2 id="price-summary" className="text-lg font-semibold">
            দামের সারসংক্ষেপ
          </h2>
          {stats ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="সর্বনিম্ন দাম"
                value={formatTaka(stats.min)}
                caption={`সবচেয়ে কম দামের বাজার: ${stats.minMarket}`}
                tone="text-success"
              />
              <StatCard
                label="সর্বাধিক দাম"
                value={formatTaka(stats.max)}
                caption={`সবচেয়ে বেশি দামের বাজার: ${stats.maxMarket}`}
                tone="text-error"
              />
              <StatCard
                label="গড় দাম"
                value={formatTaka(stats.avg)}
                caption={unitBn ? `${unitBn}-এর হিসাবে` : "সব বাজারের গড়"}
                tone="text-primary"
              />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-base-300 px-4 py-6 text-center text-sm text-base-content/60">
              এই পণ্যের জন্য বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি, তাই সর্বনিম্ন, সর্বাধিক ও গড় দাম দেখানো যাচ্ছে না।
            </p>
          )}
        </section>

        <section aria-labelledby="market-prices" className="space-y-3">
          <h2 id="market-prices" className="text-lg font-semibold">
            বাজারভিত্তিক আজকের দাম
          </h2>
          {product.markets.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-base-300">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-sm">
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
                  {product.markets.map((m, index) => (
                    <tr key={`${m.market}-${m.division}-${index}`}>
                      <th scope="row" className="font-medium">
                        {m.market}
                      </th>
                      <td>{m.division || "—"}</td>
                      <td className="text-right">{formatTaka(m.min)}</td>
                      <td className="text-right">{formatTaka(m.max)}</td>
                      <td className="text-right font-semibold">{formatTaka(marketAverage(m))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-base-300 px-4 py-6 text-center text-sm text-base-content/60">
              বাজারভিত্তিক দামের তালিকা এখনো পাওয়া যায়নি।
            </p>
          )}
        </section>

        {history.length > 1 && (
          <section aria-labelledby="price-history" className="space-y-3">
            <h2 id="price-history" className="text-lg font-semibold">
              আগের দামের সাথে তুলনা
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {history.map((h) => (
                <div key={h.label} className="rounded-xl bg-base-200 px-4 py-3">
                  <dt className="text-xs text-base-content/60">{h.label}</dt>
                  <dd className="text-lg font-bold">{formatTaka(h.value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
