"use client";

import { useSyncExternalStore } from "react";
import { getBanglaDate } from "@/lib/format";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

/** Renders today's Bangla date. Empty on the server, filled on the client → no hydration mismatch. */
export default function BanglaDate({ className }: { className?: string }) {
  const date = useSyncExternalStore(subscribe, () => getBanglaDate(), () => "");
  return (
    <span className={className} suppressHydrationWarning>
      {date || "\u00a0"}
    </span>
  );
}
