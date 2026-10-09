"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

const input = "w-full rounded-xl border border-line bg-white px-4 py-2.5 focus:border-brand";

export default function AuthForm({ mode, next = "/" }: { mode: "signin" | "signup"; next?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  // Only allow same-site relative redirects.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");

    if (isSignup && !name) return void toast.error("আপনার নাম লিখুন");
    if (!/^\S+@\S+\.\S+$/.test(email)) return void toast.error("সঠিক ইমেইল ঠিকানা দিন");
    if (password.length < 8) return void toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

    setLoading(true);
    if (isSignup) {
      const { error } = await authClient.signUp.email({ name, email, password });
      setLoading(false);
      if (error) return void toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
      router.push("/signin");
    } else {
      const { error } = await authClient.signIn.email({ email, password });
      setLoading(false);
      if (error) return void toast.error("ইমেইল বা পাসওয়ার্ড ঠিক নয়");
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.push(safeNext);
      router.refresh();
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</h1>
      <p className="mt-1 text-sm text-muted">
        {isSignup ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।" : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
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
        <button disabled={loading} className="w-full rounded-full bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {loading ? "অপেক্ষা করুন…" : isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />অথবা<span className="h-px flex-1 bg-line" />
      </div>
      <SocialButtons callbackURL={isSignup ? "/" : safeNext} />

      <p className="mt-5 text-center text-sm text-muted">
        {isSignup ? (
          <>অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-brand-dark hover:underline">সাইন ইন করুন</Link></>
        ) : (
          <>অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-brand-dark hover:underline">সাইন আপ করুন</Link></>
        )}
      </p>
    </div>
  );
}
