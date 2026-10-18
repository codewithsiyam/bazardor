"use client";

import Link from "next/link";
import StatusCard from "@/components/StatusCard";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <StatusCard
        emoji="⚠️"
        title="কিছু একটা ভুল হয়েছে"
        description="পেজটি লোড করা যায়নি। আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।"
      >
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="btn btn-ghost">
          হোম পেজে ফিরে যান
        </Link>
      </StatusCard>
    </div>
  );
}
