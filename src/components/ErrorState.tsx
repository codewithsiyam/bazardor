import Link from "next/link";

export default function ErrorState({ title = "দুঃখিত, তথ্য আনা যায়নি", message = "কিছুক্ষণ পর আবার চেষ্টা করুন।" }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>📡</p>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-1 text-muted">{message}</p>
      <Link href="/" className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
