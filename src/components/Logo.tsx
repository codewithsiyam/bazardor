import Link from "next/link";
import BanglaDate from "@/components/BanglaDate";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="বাজার দর — হোম পেজ"
      className="flex items-center gap-2 rounded-lg"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg text-primary-content"
      >
        🛒
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-base-content">বাজার দর</span>
        <BanglaDate className="min-h-4 text-xs text-base-content/70" />
      </span>
    </Link>
  );
}
