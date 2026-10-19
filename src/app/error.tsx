"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unexpected error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center"
      >
        <span className="text-5xl" aria-hidden="true">
          ⚠️
        </span>
        <h2 className="text-xl font-bold">কিছু একটা সমস্যা হয়েছে</h2>
        <p className="max-w-md text-sm text-base-content/70">
          পেজটি লোড করা যায়নি। ইন্টারনেট সংযোগ বা সার্ভারে সাময়িক সমস্যা হতে পারে।
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            আবার চেষ্টা করুন
          </button>
          <Link href="/" className="btn btn-outline">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
