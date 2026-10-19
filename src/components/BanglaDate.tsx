"use client";

import { useSyncExternalStore } from "react";
import { getBanglaDate } from "@/lib/format";

const subscribe = () => () => {};
const getServerSnapshot = () => "";

/**
 * Today's date in Bangla (Asia/Dhaka). Rendered on the client only, so the date
 * is never stale on cached pages and never causes a hydration mismatch.
 */
export default function BanglaDate({ className }: { className?: string }) {
  const text = useSyncExternalStore(subscribe, () => getBanglaDate(), getServerSnapshot);
  return (
    <span className={className} suppressHydrationWarning>
      {text || "\u00a0"}
    </span>
  );
}
