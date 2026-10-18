import type { ReactNode } from "react";

/** Friendly full-width message card (404, empty states, API/database failures). */
export default function StatusCard({
  emoji,
  title,
  description,
  children,
}: {
  emoji: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center">
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-sm leading-6 text-base-content/70">{description}</p>}
      {children && <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{children}</div>}
    </div>
  );
}
