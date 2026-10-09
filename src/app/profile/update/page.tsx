import Link from "next/link";
import { requireSession } from "@/lib/session";
import UpdateProfileForm from "@/components/UpdateProfileForm";

export const metadata = { title: "তথ্য আপডেট" };

export default async function UpdatePage() {
  const { user } = await requireSession("/profile/update");
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <Link href="/profile" className="text-sm font-medium text-brand-dark hover:underline">← প্রোফাইল</Link>
        <h1 className="mt-2 text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <UpdateProfileForm currentName={user.name} />
      </div>
    </div>
  );
}
