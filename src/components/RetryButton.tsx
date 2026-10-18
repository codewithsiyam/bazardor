"use client";

import { useRouter } from "next/navigation";

export default function RetryButton({ label = "আবার চেষ্টা করুন" }: { label?: string }) {
  const router = useRouter();
  return (
    <button type="button" className="btn btn-primary btn-sm sm:btn-md" onClick={() => router.refresh()}>
      {label}
    </button>
  );
}
