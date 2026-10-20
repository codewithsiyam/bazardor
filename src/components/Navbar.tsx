"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { signOut, useSession } from "@/lib/auth-client";
import type { Category } from "@/types";

interface NavbarProps {
  categories: Category[];
}

function chipClass(active: boolean) {
  return [
    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors",
    active
      ? "bg-primary text-primary-content"
      : "text-base-content hover:bg-base-200",
  ].join(" ");
}

export default function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট সফল হয়েছে।");
          setMobileOpen(false);
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        },
      },
    });
  };

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const user = session?.user;

  return (
    <header className="border-b border-base-300 bg-base-100">
      {/* Row 1: logo + auth */}
      <div className="mx-auto flex min-h-17 max-w-6xl items-center gap-3 px-4 py-3">
        <Logo onClick={closeMobile} />
        <div className="flex-1" />

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="skeleton h-10 w-44 rounded-lg" aria-label="লোড হচ্ছে" />
          ) : user ? (
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              onSignOut={handleSignOut}
            />
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-primary">
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-square md:hidden"
          aria-label={mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Row 2 (tablet / desktop): category links */}
      <nav aria-label="ক্যাটাগরি" className="hidden border-t border-base-200 md:block">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <ul className="flex items-center gap-1 py-2">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const active = pathname === href;
              return (
                <li key={category.id}>
                  <Link
                    href={href}
                    className={chipClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span aria-hidden="true">{category.icon}</span>
                    {category.nameBn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-base-300 bg-base-100 md:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-4">
            <nav aria-label="ক্যাটাগরি (মোবাইল)">
              <p className="mb-2 text-xs font-semibold text-base-content/70">ক্যাটাগরি</p>
              <ul className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const href = `/category/${category.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={category.id}>
                      <Link
                        href={href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                        className={`${chipClass(active)} h-10 w-full justify-start text-sm ${
                          active ? "" : "border border-base-300"
                        }`}
                      >
                        <span aria-hidden="true">{category.icon}</span>
                        {category.nameBn}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-base-300 pt-4">
              {isPending ? (
                <div className="skeleton h-10 w-full rounded-lg" aria-label="লোড হচ্ছে" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} image={user.image} className="size-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-base-content/70">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeMobile}
                    className="btn btn-outline btn-sm w-full"
                  >
                    👤 আমার প্রোফাইল
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-outline btn-error btn-sm w-full"
                  >
                    ↩ সাইন আউট
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/signin" onClick={closeMobile} className="btn btn-outline">
                    সাইন ইন
                  </Link>
                  <Link href="/signup" onClick={closeMobile} className="btn btn-primary">
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
  onSignOut: () => void;
}

function UserMenu({ name, email, image, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="btn btn-ghost gap-2 px-3"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={name} image={image} />
        <span className="max-w-28 truncate text-sm font-medium">{firstName}</span>
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
            <p className="truncate text-xs text-base-content/70">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-base-200"
          >
            👤 আমার প্রোফাইল
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-error hover:bg-base-200"
          >
            ↩ সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}
