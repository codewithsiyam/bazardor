"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "./SignOutButton";

const linkBase = "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition";
const linkIdle = "text-muted hover:bg-brand-soft hover:text-brand-dark";
const linkActive = "bg-brand text-white";

export default function Navbar({ categories, dateLabel }: { categories: Category[]; dateLabel: string }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-between gap-3 py-2.5">
        <Link href="/" className="leading-tight">
          <span className="block text-xl font-bold text-brand-dark sm:text-2xl">🛒 বাজার দর</span>
          <span className="block text-xs text-muted">{dateLabel}</span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="h-9 w-24 animate-pulse rounded-full bg-line" aria-hidden />
          ) : session ? (
            <>
              <Link
                href="/profile"
                className="max-w-28 truncate rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:border-brand sm:max-w-40"
              >
                👤 {session.user.name}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/signin" className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:border-brand sm:px-4">
                সাইন ইন
              </Link>
              <Link href="/signup" className="rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark sm:px-4">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="-mx-4 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none]">
        <ul className="flex gap-1.5">
          <li>
            <Link href="/" aria-current={isActive("/") ? "page" : undefined} className={`${linkBase} ${isActive("/") ? linkActive : linkIdle}`}>
              হোম
            </Link>
          </li>
          {categories.map((c) => {
            const href = `/category/${encodeURIComponent(c.slug)}`;
            const active = isActive(href);
            return (
              <li key={c.slug}>
                <Link href={href} aria-current={active ? "page" : undefined} className={`${linkBase} ${active ? linkActive : linkIdle}`}>
                  <span aria-hidden>{c.icon} </span>
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
