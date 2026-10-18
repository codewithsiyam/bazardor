import Image from "next/image";
import BanglaDate from "./BanglaDate";

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
      <div className="flex flex-col items-center gap-8 px-5 py-8 sm:px-8 md:flex-row md:justify-between md:px-10 md:py-10">
        <div className="flex max-w-xl flex-col items-start gap-3 text-left">
          <BanglaDate className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary" />
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
          <p className="leading-7 text-base-content/75">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-2 shadow-sm">
            সব পণ্য দেখুন
          </a>
        </div>
        <Image
          src="/bazar-hero.png"
          alt="ফল ও সবজি ভরা বাজারের ঝুড়ি"
          width={315}
          height={263}
          priority
          className="h-auto w-56 shrink-0 sm:w-72 md:w-[315px]"
        />
      </div>
    </section>
  );
}
