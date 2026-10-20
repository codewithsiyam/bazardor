import type { Metadata } from "next";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "তথ্য আপডেট করুন" };
export const dynamic = "force-dynamic";

export default async function ProfileUpdatePage() {
  const { user } = await requireSession("/profile/update");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <p className="text-sm text-base-content/70">আপনার নাম পরিবর্তন করুন।</p>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <ProfileUpdateForm initialName={user.name} email={user.email} />
      </div>
    </div>
  );
}
