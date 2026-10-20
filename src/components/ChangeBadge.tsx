import { formatPercent } from "@/lib/format";
import type { PriceChange } from "@/types";

const TONES = {
  up: { arrow: "▲", className: "text-error", label: "দাম বেড়েছে" },
  down: { arrow: "▼", className: "text-success", label: "দাম কমেছে" },
  flat: { arrow: "—", className: "text-base-content/60", label: "দাম অপরিবর্তিত" },
} as const;

interface ChangeBadgeProps {
  change: PriceChange;
  /** "sm": pill used on cards. "md": plain row used in the product header (as in the design). */
  size?: "sm" | "md";
}

/** ▲ red = price rose, ▼ green = price fell, — gray = unchanged (as in the Figma). */
export default function ChangeBadge({ change, size = "sm" }: ChangeBadgeProps) {
  const tone = TONES[change.dir];
  const layout =
    size === "md"
      ? "gap-1 text-sm font-semibold"
      : "gap-1 rounded-full bg-base-200 px-2 py-1 text-xs font-semibold";

  return (
    <span className={`inline-flex items-center ${layout} ${tone.className}`}>
      <span className="sr-only">{tone.label} </span>
      <span aria-hidden="true">{tone.arrow}</span>
      {formatPercent(change.dir === "flat" ? 0 : change.pct)}
    </span>
  );
}
