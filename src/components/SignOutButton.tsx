"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:border-fall hover:text-fall ${className}`}
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("সফলভাবে সাইন আউট হয়েছে");
              router.push("/");
              router.refresh();
            },
            onError: () => {
              toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন");
            },
          },
        })
      }
    >
      ↩ সাইন আউট
    </button>
  );
}
