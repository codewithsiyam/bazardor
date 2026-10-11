import { formatPercent, formatSignedPercent, trendOf } from "@/lib/bn";

// Colours follow the assignment text: green = price rose, red = price fell, gray = unchanged / no data.
const STYLES = {
  up: "text-rise",
  down: "text-fall",
  flat: "text-muted",
  unknown: "text-muted",
} as const;

export default function PriceBadge({ changePercent, className = "" }: { changePercent: number | null; className?: string }) {
  const trend = trendOf(changePercent);
  const symbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  const text = changePercent === null ? "" : formatSignedPercent(changePercent);
  const label =
    trend === "up" ? "দাম বেড়েছে" : trend === "down" ? "দাম কমেছে" : trend === "flat" ? "দাম অপরিবর্তিত" : "পরিবর্তনের তথ্য নেই";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-xs font-semibold ${STYLES[trend]} ${className}`}
      aria-label={changePercent === null ? label : `${label}, ${formatPercent(changePercent)}`}
      title={label}
    >
      <span aria-hidden>{symbol}</span>
      {text}
    </span>
  );
}
