import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { getInitial } from "@/lib/utils";
import RetryButton from "@/components/RetryButton";
import SignOutButton from "@/components/SignOutButton";
import StatusCard from "@/components/StatusCard";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const auth = await requireUser("/profile");
  if (auth.state === "unavailable") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <StatusCard
          emoji="⚠️"
          title="প্রোফাইল লোড করা যায়নি"
          description="অ্যাকাউন্ট সার্ভিসের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
        </StatusCard>
      </div>
    );
  }

  const { user } = auth;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="text-sm text-base-content/70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote avatar URLs (Google/GitHub) are not known at build time
            <img src={user.image} alt="" referrerPolicy="no-referrer" className="size-20 shrink-0 rounded-2xl object-cover" />
          ) : (
            <span
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-semibold text-primary-content"
              aria-hidden="true"
            >
              {getInitial(user.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{user.name}</p>
            <p className="truncate text-base text-base-content/70">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </section>

      <section aria-labelledby="profile-info" className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <h2 id="profile-info" className="text-lg font-semibold">
          তথ্য
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-base-200 px-4 py-3">
            <dt className="text-xs text-base-content/60">নাম</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="rounded-xl bg-base-200 px-4 py-3">
            <dt className="text-xs text-base-content/60">ইমেইল</dt>
            <dd className="break-all font-medium">{user.email}</dd>
          </div>
        </dl>
        <Link href="/profile/update" className="btn btn-primary w-full shadow-sm">
          তথ্য আপডেট করুন
        </Link>
      </section>
    </div>
  );
}
