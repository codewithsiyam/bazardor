"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export async function performSignOut(router: ReturnType<typeof useRouter>): Promise<void> {
  const { error } = await authClient.signOut();
  if (error) {
    toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    return;
  }
  toast.success("সাইন আউট সফল হয়েছে।");
  router.push("/");
  router.refresh();
}

export default function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await performSignOut(router);
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`btn btn-outline btn-error ${className}`}
    >
      {pending ? <span className="loading loading-spinner loading-xs" /> : <span aria-hidden="true">↩</span>}
      সাইন আউট
    </button>
  );
}
