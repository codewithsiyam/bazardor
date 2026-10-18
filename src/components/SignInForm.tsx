"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { toBanglaAuthError } from "@/lib/auth-errors";
import type { SocialAvailability } from "@/lib/providers";
import { safeCallbackUrl } from "@/lib/utils";
import SocialButtons from "./SocialButtons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ providers }: { providers: SocialAvailability }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
  const reason = params.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reason === "login-required") {
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন।", { id: "login-required" });
    }
  }, [reason]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।");
      toast.error("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setPending(true);
    try {
      const { error: authError } = await authClient.signIn.email({ email: trimmedEmail, password });
      if (authError) {
        const message = toBanglaAuthError(authError, "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
        setError(message);
        toast.error(message);
        return;
      }
      toast.success("সাইন ইন সফল হয়েছে!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      const message = "নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input w-full bg-base-100 shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            className="input w-full bg-base-100 shadow-sm"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full shadow-sm">
          {pending && <span className="loading loading-spinner loading-xs" />}
          সাইন ইন
        </button>
      </form>

      <SocialButtons providers={providers} callbackUrl={callbackUrl} disabled={pending} />

      <p className="mt-5 text-center text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          সাইন আপ করুন
        </Link>
      </p>
    </>
  );
}
