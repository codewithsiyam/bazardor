"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { toBanglaAuthError } from "@/lib/auth-errors";

export default function ProfileUpdateForm({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fail(message: string) {
    setError(message);
    toast.error(message);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (trimmed.length < 2) return fail("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
    if (trimmed.length > 60) return fail("নাম ৬০ অক্ষরের বেশি হতে পারবে না।");
    if (trimmed === initialName) return fail("নতুন কোনো পরিবর্তন করা হয়নি।");

    setPending(true);
    try {
      // Better Auth: https://better-auth.com/docs/concepts/users-accounts#update-user
      const { error: authError } = await authClient.updateUser({ name: trimmed });
      if (authError) {
        fail(toBanglaAuthError(authError, "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।"));
        return;
      }
      toast.success("প্রোফাইল আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch {
      fail("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          নাম
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full bg-base-100 shadow-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          ইমেইল
        </label>
        <input id="email" type="email" value={email} readOnly disabled className="input w-full bg-base-200" />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="submit" disabled={pending} className="btn btn-primary flex-1 shadow-sm">
          {pending && <span className="loading loading-spinner loading-xs" />}
          তথ্য আপডেট করুন
        </button>
        <Link href="/profile" className="btn btn-ghost">
          বাতিল
        </Link>
      </div>
    </form>
  );
}
