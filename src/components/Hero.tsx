import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
      <div>
        <p className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-dark">
          আজকের বাজারের দাম এক নজরে
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          নিত্যপ্রয়োজনীয় পণ্যের <span className="text-brand">সঠিক দাম</span> জানুন, সহজেই
        </h1>
        <p className="mt-4 max-w-prose text-muted">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড় ও দাম বাড়া-কমার তথ্য এক জায়গায়।
        </p>
        {/* Plain anchor: jumps within the page, no route change. */}
        <a
          href="#সব-পণ্য"
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          সব পণ্য দেখুন ↓
        </a>
      </div>
      <div className="flex justify-center rounded-3xl bg-brand-soft p-6">
        <Image src="/bazar-hero.png" alt="ফল ও সবজির ঝুড়ি" width={315} height={263} priority className="h-auto w-full max-w-sm" />
      </div>
    </section>
  );
}
