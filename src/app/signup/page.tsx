import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";
import { getSocialAvailability } from "@/lib/providers";

export const metadata: Metadata = { title: "অ্যাকাউন্ট তৈরি করুন" };
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <AuthShell title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।">
      <SignUpForm providers={getSocialAvailability()} />
    </AuthShell>
  );
}
