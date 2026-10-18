import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import RetryButton from "@/components/RetryButton";
import StatusCard from "@/components/StatusCard";

export const metadata: Metadata = { title: "তথ্য আপডেট করুন" };
export const dynamic = "force-dynamic";

export default async function ProfileUpdatePage() {
  const auth = await requireUser("/profile/update");
  if (auth.state === "unavailable") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <StatusCard
          emoji="⚠️"
          title="পেজ লোড করা যায়নি"
          description="অ্যাকাউন্ট সার্ভিসের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        >
          <RetryButton />
        </StatusCard>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <p className="text-sm text-base-content/70">আপনার নাম পরিবর্তন করুন।</p>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <ProfileUpdateForm initialName={auth.user.name} email={auth.user.email} />
      </div>
    </div>
  );
}
