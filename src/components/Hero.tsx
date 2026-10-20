import Image from "next/image";
import BanglaDate from "@/components/BanglaDate";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-hidden rounded-3xl border border-base-300 bg-base-100"
    >
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row md:px-10 md:py-10">
        <div className="flex max-w-xl flex-col items-start gap-3">
          <BanglaDate className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary" />
          <h1 id="hero-title" className="text-3xl font-bold leading-tight md:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-base text-base-content/80">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
            সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="pt-2">
            {/* Plain anchor on purpose: scrolls to #সব-পণ্য on the same page. */}
            <a href="#সব-পণ্য" className="btn btn-primary">
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <Image
          src="/bazar-hero.png"
          alt="ফল ও সবজিতে ভরা বাজারের ঝুড়ি"
          width={315}
          height={263}
          priority
          className="h-auto w-56 shrink-0 md:w-78.75"
        />
      </div>
    </section>
  );
}
