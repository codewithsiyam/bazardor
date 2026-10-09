"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

/** Shows a one-time toast when the proxy/server sent the user here (?reason=protected). */
export default function RedirectToast({ reason }: { reason?: string }) {
  const shown = useRef(false);
  useEffect(() => {
    if (reason === "protected" && !shown.current) {
      shown.current = true;
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন", { id: "protected" });
    }
  }, [reason]);
  return null;
}
