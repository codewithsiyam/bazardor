"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getInitial } from "@/lib/utils";
import { performSignOut } from "./SignOutButton";

interface AuthMenuProps {
  /** Full-width layout used inside the mobile menu */
  mobile?: boolean;
  onNavigate?: () => void;
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote avatar URLs (Google/GitHub) are not known at build time
      <img src={image} alt="" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-[10px] object-cover" />
    );
  }
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-primary-content"
      aria-hidden="true"
    >
      {getInitial(name)}
    </span>
  );
}

export default function AuthMenu({ mobile = false, onNavigate }: AuthMenuProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await performSignOut(router);
      setOpen(false);
      onNavigate?.();
    } catch {
      toast.error("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return <div className={`skeleton h-10 ${mobile ? "w-full" : "w-28"}`} aria-label="লোড হচ্ছে" />;
  }

  if (!session?.user) {
    return (
      <div className={mobile ? "grid grid-cols-2 gap-2" : "flex items-center gap-2"}>
        <Link href="/signin" onClick={onNavigate} className="btn btn-ghost btn-sm sm:btn-md">
          সাইন ইন
        </Link>
        <Link href="/signup" onClick={onNavigate} className="btn btn-primary btn-sm sm:btn-md shadow-sm">
          সাইন আপ
        </Link>
      </div>
    );
  }

  const { name, email, image } = session.user;

  if (mobile) {
    return (
      <div className="space-y-2 rounded-2xl border border-base-300 p-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} image={image} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-base-content/60">{email}</p>
          </div>
        </div>
        <Link href="/profile" onClick={onNavigate} className="btn btn-ghost btn-sm w-full justify-start">
          <span aria-hidden="true">👤</span> আমার প্রোফাইল
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="btn btn-ghost btn-sm w-full justify-start text-error"
        >
          <span aria-hidden="true">↩</span> সাইন আউট
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        className="btn btn-ghost h-10 gap-2 px-2"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar name={name} image={image} />
        <span className="max-w-32 truncate text-sm font-medium">{name}</span>
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-base-content/60">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
          >
            <span aria-hidden="true">👤</span> আমার প্রোফাইল
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-base-200 disabled:opacity-60"
          >
            <span aria-hidden="true">↩</span> সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}
