import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getProduct } from "@/lib/api";
import { formatNumber, formatTaka } from "@/lib/bn";
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

  const prices = product.markets.map((m) => m.price);
  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;
  const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;

  const stats = [
    { label: "সর্বনিম্ন দাম", value: min },
    { label: "সর্বাধিক দাম", value: max },
    { label: "গড় দাম", value: avg },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm font-medium text-brand-dark hover:underline">← হোম</Link>

      <section className="mt-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-4xl" aria-hidden>{product.emoji}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            {product.description && <p className="mt-1 text-muted">{product.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {product.tags.map((t) => (
                <span key={t} className="rounded-full bg-brand-soft px-3 py-0.5 font-medium text-brand-dark">{t}</span>
              ))}
              <span className="rounded-full border border-line px-3 py-0.5 text-muted">{product.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">আজকের দাম</p>
            <p className="text-2xl font-bold">{formatTaka(product.price)}</p>
            <PriceBadge changePercent={product.changePercent} />
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="summary">
        <h2 id="summary" className="mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value === null ? "—" : formatTaka(s.value)}</p>
              <p className="text-xs text-muted">{product.unit}-এর হিসাবে</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="markets">
        <h2 id="markets" className="mb-3 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        {product.markets.length === 0 ? (
          <p className="rounded-2xl border border-line bg-paper p-4 text-muted">এই পণ্যের বাজারভিত্তিক দামের তথ্য এখনো পাওয়া যায়নি।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full text-left">
              <thead className="bg-brand-soft text-sm text-muted">
                <tr><th className="px-4 py-2.5 font-medium">বাজার</th><th className="px-4 py-2.5 text-right font-medium">আজকের দাম</th></tr>
              </thead>
              <tbody>
                {product.markets.map((m) => (
                  <tr key={m.market} className="border-t border-line">
                    <td className="px-4 py-3">{m.market}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatNumber(m.price)} টাকা
                      {m.price === min && <span className="ml-2 text-xs text-rise">সবচেয়ে কম</span>}
                      {m.price === max && min !== max && <span className="ml-2 text-xs text-fall">সবচেয়ে বেশি</span>}
                    </td>
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
