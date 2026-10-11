"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SignOutButton from "./SignOutButton";

export default function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium hover:border-brand"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs text-white" aria-hidden>
          {name.trim().charAt(0).toUpperCase() || "👤"}
        </span>
        <span className="max-w-20 truncate sm:max-w-32">{name}</span>
        <span aria-hidden className="text-xs">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-line bg-paper p-2 shadow-lg">
          <div className="border-b border-line px-3 pb-2 pt-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <Link role="menuitem" href="/profile" onClick={() => setOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-canvas">
            👤 আমার প্রোফাইল
          </Link>
          <SignOutButton className="mt-1 w-full border-0 px-3 py-2 text-left hover:bg-canvas" />
        </div>
      )}
    </div>
  );
}
