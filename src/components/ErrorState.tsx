"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ErrorState({
  title = "দুঃখিত, তথ্য আনা যায়নি",
  message = "সার্ভারের সাথে যোগাযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
}: {
  title?: string;
  message?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center" role="alert">
      <p className="text-5xl" aria-hidden>📡</p>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-1 text-muted">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
          className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "চেষ্টা চলছে…" : "আবার চেষ্টা করুন"}
        </button>
        <Link href="/" className="rounded-full border border-line px-5 py-2.5 font-semibold hover:border-brand">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
