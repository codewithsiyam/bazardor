import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10 sm:py-14">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-base-content/70">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">{children}</div>
      <Link href="/" className="text-center text-sm text-base-content/70 hover:text-primary">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
