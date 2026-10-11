import Link from "next/link";
import { requireSession } from "@/lib/session";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const { user } = await requireSession("/profile");
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <h1 className="mb-5 text-2xl font-bold">আমার প্রোফাইল</h1>
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-3xl" aria-hidden>👤</span>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold">{user.name}</p>
            <p className="truncate text-muted">{user.email}</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        <dl className="mt-3 divide-y divide-line rounded-xl border border-line">
          <div className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted">নাম</dt><dd className="font-medium">{user.name}</dd></div>
          <div className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted">ইমেইল</dt><dd className="truncate font-medium">{user.email}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/profile/update" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">তথ্য আপডেট করুন</Link>
          <SignOutButton className="py-2.5" />
        </div>
      </div>
    </div>
  );
}
