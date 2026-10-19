import Link from "next/link";
import type { ReactNode } from "react";

interface StateMessageProps {
  emoji: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  /** Use "alert" for failures so assistive tech announces them. */
  role?: "alert" | "status";
  children?: ReactNode;
}

/** Shared empty / error / not-found panel. */
export default function StateMessage({
  emoji,
  title,
  description,
  action,
  role,
  children,
}: StateMessageProps) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center"
    >
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="max-w-md text-sm text-base-content/70">{description}</p>}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {action && (
          <Link href={action.href} className="btn btn-primary">
            {action.label}
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
