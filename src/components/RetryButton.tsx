"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RetryButton({ label = "আবার চেষ্টা করুন" }: { label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-outline"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending && <span className="loading loading-spinner loading-sm" aria-hidden="true" />}
      {label}
    </button>
  );
}
