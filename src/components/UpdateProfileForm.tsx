"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    if (!name) return void toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await authClient.updateUser({ name }); // BetterAuth "update user" API
    setLoading(false);
    if (error) return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">নাম</label>
        <input id="name" name="name" defaultValue={currentName} autoComplete="name" className="w-full rounded-xl border border-line bg-white px-4 py-2.5 focus:border-brand" />
      </div>
      <button disabled={loading} className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {loading ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}
