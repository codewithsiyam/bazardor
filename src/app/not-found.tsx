import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden>🛒</p>
      <h1 className="mt-4 text-3xl font-bold">৪০৪ — পাতাটি পাওয়া যায়নি</h1>
      <p className="mt-2 text-muted">আপনি যে পাতা বা পণ্য খুঁজছেন তা নেই, অথবা সরিয়ে নেওয়া হয়েছে।</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
