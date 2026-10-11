"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";
const LABEL: Record<Provider, string> = { google: "Google দিয়ে চালিয়ে যান", github: "GitHub দিয়ে চালিয়ে যান" };

export default function SocialButtons({
  callbackURL = "/",
  providers,
}: {
  callbackURL?: string;
  providers: Record<Provider, boolean>;
}) {
  const [busy, setBusy] = useState<Provider | null>(null);

  async function go(provider: Provider) {
    setBusy(provider);
    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL, errorCallbackURL: "/signin" });
      if (error) toast.error(error.message || "সোশ্যাল লগইন করা যায়নি, আবার চেষ্টা করুন");
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা: সোশ্যাল লগইন করা যায়নি");
    } finally {
      setBusy(null);
    }
  }

  const btn =
    "flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-paper py-2.5 font-medium hover:border-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line";
  return (
    <div className="space-y-2.5">
      {(Object.keys(LABEL) as Provider[]).map((p) => (
        <div key={p}>
          <button
            type="button"
            className={btn}
            disabled={!providers[p] || busy !== null}
            onClick={() => go(p)}
            title={providers[p] ? undefined : "এই লগইন পদ্ধতি এখনো কনফিগার করা হয়নি"}
          >
            {busy === p ? "অপেক্ষা করুন…" : LABEL[p]}
          </button>
          {!providers[p] && <p className="mt-1 text-center text-xs text-muted">এই লগইন পদ্ধতি এখনো চালু করা হয়নি</p>}
        </div>
      ))}
    </div>
  );
}
