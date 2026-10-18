import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import FormSkeleton from "@/components/FormSkeleton";
import SignInForm from "@/components/SignInForm";
import { getSocialAvailability } from "@/lib/providers";

export const metadata: Metadata = { title: "সাইন ইন" };
export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <Suspense fallback={<FormSkeleton fields={2} />}>
        <SignInForm providers={getSocialAvailability()} />
      </Suspense>
    </AuthShell>
  );
}
