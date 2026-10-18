"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types";
import AuthMenu from "./AuthMenu";
import BanglaDate from "./BanglaDate";

export default function NavBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isActive = (slug: string) => pathname === `/category/${encodeURIComponent(slug)}` || pathname === `/category/${slug}`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="বাজার দর — হোম পেজ" onClick={close}>
          <span
            className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg text-primary-content"
            aria-hidden="true"
          >
            🛒
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight">বাজার দর</span>
            <BanglaDate className="text-xs text-base-content/60" />
          </span>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:block">
          <AuthMenu />
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-square md:hidden"
          aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {categories.length > 0 && (
        <nav aria-label="ক্যাটাগরি" className="hidden border-t border-base-200 bg-base-100 md:block">
          <ul className="mx-auto flex h-12 w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
            {categories.map((cat) => {
              const active = isActive(cat.slug);
              return (
                <li key={cat.slug} className="shrink-0">
                  <Link
                    href={`/category/${encodeURIComponent(cat.slug)}`}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors ${
                      active ? "bg-primary text-primary-content" : "hover:bg-base-200"
                    }`}
                  >
                    {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                    {cat.nameBn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {open && (
        <div id="mobile-menu" className="border-t border-base-200 bg-base-100 md:hidden">
          <div className="mx-auto max-h-[calc(100dvh-68px)] w-full max-w-6xl space-y-4 overflow-y-auto px-4 py-4">
            {categories.length > 0 && (
              <nav aria-label="ক্যাটাগরি (মোবাইল)">
                <ul className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const active = isActive(cat.slug);
                    return (
                      <li key={cat.slug}>
                        <Link
                          href={`/category/${encodeURIComponent(cat.slug)}`}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                            active
                              ? "border-primary bg-primary text-primary-content"
                              : "border-base-300 bg-base-100 hover:bg-base-200"
                          }`}
                        >
                          {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                          {cat.nameBn}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
            <AuthMenu mobile onNavigate={close} />
          </div>
        </div>
      )}
    </header>
  );
}
