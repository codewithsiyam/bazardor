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
    if (name.length < 2) return void toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    if (name.length > 60) return void toast.error("নাম ৬০ অক্ষরের বেশি হতে পারবে না");
    if (name === currentName.trim()) return void toast("নামে কোনো পরিবর্তন নেই");
    setLoading(true);
    try {
      const { error } = await authClient.updateUser({ name }); // BetterAuth "update user" API
      if (error) return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা: তথ্য আপডেট করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">নাম</label>
        <input id="name" name="name" defaultValue={currentName} autoComplete="name" className="w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:border-brand" />
      </div>
      <button disabled={loading} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {loading ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}
