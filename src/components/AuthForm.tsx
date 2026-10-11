"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

const input = "w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:border-brand";
const submitBtn = "w-full rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60";

/** Only same-site relative redirects are allowed (blocks "//evil.com" and "/\\evil.com"). */
export function safeRedirect(next: string | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
}

type AuthError = { status?: number; code?: string; message?: string };

function signInMessage(error: AuthError): string {
  if (error.code === "INVALID_EMAIL_OR_PASSWORD" || error.status === 401) return "ইমেইল বা পাসওয়ার্ড ঠিক নয়";
  if (error.status === 503) return "লগইন সিস্টেম এখনো কনফিগার করা হয়নি";
  if (!error.status || error.status >= 500) return "সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন";
  return error.message || "সাইন ইন করা যায়নি";
}

function signUpMessage(error: AuthError): string {
  if (error.code?.includes("USER_ALREADY_EXISTS")) return "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা আছে";
  if (error.code === "PASSWORD_TOO_SHORT") return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (error.status === 503) return "লগইন সিস্টেম এখনো কনফিগার করা হয়নি";
  if (!error.status || error.status >= 500) return "সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন";
  return error.message || "অ্যাকাউন্ট তৈরি করা যায়নি";
}

export default function AuthForm({
  mode,
  next = "/",
  providers,
}: {
  mode: "signin" | "signup";
  next?: string;
  providers: { google: boolean; github: boolean };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const isSignup = mode === "signup";
  const safeNext = safeRedirect(next);
  const nextQuery = safeNext === "/" ? "" : `?next=${encodeURIComponent(safeNext)}`;

  function fail(message: string) {
    setFormError(message);
    toast.error(message);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const confirm = String(f.get("confirm") ?? "");

    if (isSignup && !name) return fail("আপনার নাম লিখুন");
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (isSignup && password !== confirm) return fail("দুই পাসওয়ার্ড মেলেনি");

    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await authClient.signUp.email({ name, email, password });
        if (error) return fail(signUpMessage(error));
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
        router.push(`/signin${nextQuery}`);
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) return fail(signInMessage(error));
        toast.success("সফলভাবে সাইন ইন হয়েছে");
        router.push(safeNext);
        router.refresh();
      }
    } catch {
      fail("নেটওয়ার্ক সমস্যা: সার্ভারের সাথে যোগাযোগ করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</h1>
      <p className="mt-1 text-sm text-muted">
        {isSignup ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।" : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
        {formError && (
          <p role="alert" className="rounded-lg border border-fall/30 bg-fall/5 px-3 py-2 text-sm text-fall">{formError}</p>
        )}
        {isSignup && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">নাম</label>
            <input id="name" name="name" autoComplete="name" placeholder="যেমন: রহিম উদ্দিন" className={input} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={input} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input id="password" name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} placeholder="কমপক্ষে ৮ অক্ষর" className={input} />
        </div>
        {isSignup && (
          <div>
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" placeholder="আবার লিখুন" className={input} />
          </div>
        )}
        <button disabled={loading} className={submitBtn}>
          {loading ? "অপেক্ষা করুন…" : isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />অথবা<span className="h-px flex-1 bg-line" />
      </div>
      <SocialButtons callbackURL={isSignup ? "/" : safeNext} providers={providers} />

      <p className="mt-5 text-center text-sm text-muted">
        {isSignup ? (
          <>অ্যাকাউন্ট আছে? <Link href={`/signin${nextQuery}`} className="font-semibold text-brand-dark hover:underline">সাইন ইন করুন</Link></>
        ) : (
          <>অ্যাকাউন্ট নেই? <Link href={`/signup${nextQuery}`} className="font-semibold text-brand-dark hover:underline">সাইন আপ করুন</Link></>
        )}
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/" className="text-muted hover:text-brand-dark hover:underline">← হোম পেজে ফিরে যান</Link>
      </p>
    </div>
  );
}
