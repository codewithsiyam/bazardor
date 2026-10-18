import type { PriceChange } from "@/types";
import { formatPercent } from "@/lib/format";

const STYLES = {
  up: { icon: "▲", color: "text-error", label: "বেড়েছে" },
  down: { icon: "▼", color: "text-success", label: "কমেছে" },
  flat: { icon: "—", color: "text-base-content/60", label: "অপরিবর্তিত" },
} as const;

/** Red ▲ for a rise, green ▼ for a fall, grey — for no change (as in the Figma cards). */
export default function ChangeBadge({ change, size = "sm" }: { change: PriceChange | null; size?: "sm" | "md" }) {
  if (!change) return null;
  const style = STYLES[change.dir];
  const text = size === "md" ? "text-sm" : "text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-base-200 px-2 py-1 font-semibold leading-4 ${text} ${style.color}`}
      aria-label={`${style.label} ${formatPercent(change.pct)}`}
    >
      <span aria-hidden="true" className="font-normal">
        {style.icon}
      </span>
      {formatPercent(change.pct)}
    </span>
  );
}
