import Link from "next/link";
import type { Metadata } from "next";
import Avatar from "@/components/Avatar";
import SignOutButton from "@/components/SignOutButton";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Server-side session check; a database failure surfaces in app/error.tsx.
  const { user } = await requireSession("/profile");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="text-sm text-base-content/70">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={user.name} image={user.image} className="size-20" textClassName="text-3xl" />
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{user.name}</p>
            <p className="truncate text-base text-base-content/70">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </section>

      <section
        aria-labelledby="profile-info"
        className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-5"
      >
        <h2 id="profile-info" className="text-lg font-semibold">
          তথ্য
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-base-200 px-4 py-3">
            <dt className="text-xs text-base-content/70">নাম</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="rounded-xl bg-base-200 px-4 py-3">
            <dt className="text-xs text-base-content/70">ইমেইল</dt>
            <dd className="break-all font-medium">{user.email}</dd>
          </div>
        </dl>
        {/* Opens the update route (/profile/update) as the assignment requires. */}
        <Link href="/profile/update" className="btn btn-primary w-full shadow-sm">
          আপডেট
        </Link>
      </section>
    </div>
  );
}
