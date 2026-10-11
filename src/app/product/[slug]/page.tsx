import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getProduct } from "@/lib/api";
import { formatNumber, formatTaka, trendOf } from "@/lib/bn";
import { requireSession } from "@/lib/session";
import PriceBadge from "@/components/PriceBadge";
import ErrorState from "@/components/ErrorState";

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const slug = decodeURIComponent((await params).slug);
  await requireSession(`/product/${encodeURIComponent(slug)}`); // server-side guard

  let product;
  try {
    product = await getProduct(slug);
  } catch (e) {
    if (e instanceof ApiError) return <ErrorState />;
    throw e;
  }
  if (!product) notFound();

  // All three numbers are calculated ONLY from the real per-bazar ranges the API returned:
  //   min = lowest bazar minimum, max = highest bazar maximum, avg = mean of each bazar's (min+max)/2.
  const { markets } = product;
  const min = markets.length ? Math.min(...markets.map((m) => m.min)) : null;
  const max = markets.length ? Math.max(...markets.map((m) => m.max)) : null;
  const avg = markets.length ? markets.reduce((sum, m) => sum + m.avg, 0) / markets.length : null;
  const stats = [
    { label: "সর্বনিম্ন দাম", value: min },
    { label: "সর্বাধিক দাম", value: max },
    { label: "গড় দাম", value: avg },
  ];

  const trend = trendOf(product.changePercent);
  const history = [
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ].filter((h): h is { label: string; value: number } => h.value !== null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm font-medium text-brand-dark hover:underline">← হোম</Link>

      <section className="mt-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas text-4xl" aria-hidden>{product.emoji}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            {/* Market summary line built from real API fields (previous prices); nothing is invented. */}
            {product.description ? (
              <p className="mt-1 text-muted">{product.description}</p>
            ) : history.length > 0 ? (
              <p className="mt-1 text-sm text-muted">
                {history.map((h) => `${h.label} ${formatTaka(h.value)}`).join(" · ")}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {product.tags.map((t) => (
                <span key={t} className="rounded-full bg-canvas px-3 py-0.5 font-medium text-brand-dark">{t}</span>
              ))}
              {product.unit && <span className="rounded-full border border-line px-3 py-0.5 text-muted">{product.unit}</span>}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-muted">আজকের দাম</p>
            <p className="text-2xl font-bold">{product.price === null ? "—" : formatTaka(product.price)}</p>
            <PriceBadge changePercent={product.changePercent} />
            {trend !== "unknown" && (
              <p className="mt-1 text-xs text-muted">
                {trend === "flat" ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত" : `গতকালের তুলনায় আজ দাম ${trend === "up" ? "বেড়েছে" : "কমেছে"}`}
                {product.changeAmount !== null && trend !== "flat" && ` · ${formatNumber(Math.abs(product.changeAmount))} টাকা`}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="summary">
        <h2 id="summary" className="mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value === null ? "তথ্য নেই" : formatTaka(s.value)}</p>
              {product.unit && <p className="text-xs text-muted">{product.unit}-এর হিসাবে</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="markets">
        <h2 id="markets" className="mb-3 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        {markets.length === 0 ? (
          <p className="rounded-2xl border border-line bg-paper p-4 text-muted">এই পণ্যের বাজারভিত্তিক দামের তথ্য এখনো পাওয়া যায়নি।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-canvas text-sm text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">বিভাগ</th>
                  <th className="px-4 py-2.5 font-medium">বাজার</th>
                  <th className="px-4 py-2.5 text-right font-medium">সর্বনিম্ন</th>
                  <th className="px-4 py-2.5 text-right font-medium">সর্বাধিক</th>
                  <th className="px-4 py-2.5 text-right font-medium">গড়</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, i) => (
                  <tr key={`${m.market}-${i}`} className="border-t border-line">
                    <td className="px-4 py-3 text-muted">{m.division || "—"}</td>
                    <td className="px-4 py-3">{m.market}</td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(m.min)} টাকা
                      {m.min === min && <span className="ml-2 text-xs text-rise">সর্বনিম্ন</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(m.max)} টাকা
                      {m.max === max && min !== max && <span className="ml-2 text-xs text-fall">সর্বাধিক</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatNumber(m.avg)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
