"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";
import { authClient } from "@/lib/auth-client";
import UserMenu from "./UserMenu";

const linkBase = "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition";
const linkIdle = "text-muted hover:bg-brand-soft hover:text-brand-dark";
const linkActive = "bg-brand text-white";

export default function Navbar({ categories, dateLabel }: { categories: Category[]; dateLabel: string }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isActive = (href: string) => pathname === href;

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
            <UserMenu name={session.user.name} email={session.user.email} />
          ) : (
            <>
              <Link href="/signin" className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:border-brand sm:px-4">
                সাইন ইন
              </Link>
              <Link href="/signup" className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark sm:px-4">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="-mx-4 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none]">
        <ul className="flex gap-1.5">
          {categories.map((c) => {
            const href = `/category/${encodeURIComponent(c.slug)}`;
            const active = isActive(href);
            return (
              <li key={c.slug}>
                <Link href={href} aria-current={active ? "page" : undefined} className={`${linkBase} ${active ? linkActive : linkIdle}`}>
                  <span aria-hidden>{c.icon}</span>
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
