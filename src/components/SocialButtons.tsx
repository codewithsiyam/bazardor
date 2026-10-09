"use client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SocialButtons({ callbackURL = "/" }: { callbackURL?: string }) {
  async function go(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({ provider, callbackURL });
    if (error) toast.error("সোশ্যাল লগইন করা যায়নি, আবার চেষ্টা করুন");
  }
  const btn = "flex w-full items-center justify-center gap-2 rounded-full border border-line bg-paper py-2.5 font-medium hover:border-brand";
  return (
    <div className="space-y-2.5">
      <button type="button" className={btn} onClick={() => go("google")}>Google দিয়ে চালিয়ে যান</button>
      <button type="button" className={btn} onClick={() => go("github")}>GitHub দিয়ে চালিয়ে যান</button>
    </div>
  );
}
