"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

/** Messages for the `?error=` code BetterAuth appends when an OAuth sign-in fails or is cancelled. */
function oauthMessage(code: string): string {
  const c = code.toLowerCase();
  if (c.includes("access_denied") || c.includes("cancel")) return "সোশ্যাল লগইন বাতিল করা হয়েছে";
  if (c.includes("account_not_linked")) return "এই ইমেইল দিয়ে আগেই অন্য পদ্ধতিতে অ্যাকাউন্ট আছে; সেই পদ্ধতিতে সাইন ইন করুন";
  if (c.includes("email_not_found")) return "প্রোভাইডার থেকে ইমেইল পাওয়া যায়নি";
  return "সোশ্যাল লগইন সম্পন্ন করা যায়নি, আবার চেষ্টা করুন";
}

/** One-time toast for redirects: protected route (?reason=protected) or failed/cancelled OAuth (?error=...). */
export default function RedirectToast({ reason, error }: { reason?: string; error?: string }) {
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    if (error) {
      shown.current = true;
      toast.error(oauthMessage(error), { id: "oauth-error" });
    } else if (reason === "protected") {
      shown.current = true;
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন", { id: "protected" });
    }
  }, [reason, error]);
  return null;
}
