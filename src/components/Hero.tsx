import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { banglaDate } from "@/lib/date";

async function HeroDate() {
  await connection(); // today's date is request-time data
  return <>{banglaDate()}</>;
}

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
      <div>
        <p className="mb-3 min-h-6 text-sm font-medium text-brand-dark">
          <Suspense fallback={<span className="inline-block h-4 w-40 animate-pulse rounded bg-line align-middle" aria-hidden />}>
            <HeroDate />
          </Suspense>
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
        <p className="mt-4 max-w-prose text-muted">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        {/* Plain anchor: jumps within the page, no route change. */}
        <a
          href="#সব-পণ্য"
          className="mt-6 inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-soft hover:bg-brand-dark"
        >
          সব পণ্য দেখুন ↓
        </a>
      </div>
      <div className="flex justify-center rounded-3xl bg-paper p-6 ring-1 ring-line">
        <Image src="/bazar-hero.png" alt="ফল ও সবজির ঝুড়ি" width={315} height={263} priority className="h-auto w-full max-w-sm" />
      </div>
    </section>
  );
}
