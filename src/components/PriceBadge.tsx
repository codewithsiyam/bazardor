import { formatPercent, trendOf } from "@/lib/bn";

const STYLES = {
  up: "bg-rise/10 text-rise",
  down: "bg-fall/10 text-fall",
  flat: "bg-ink/5 text-muted",
} as const;

export default function PriceBadge({ changePercent, className = "" }: { changePercent: number; className?: string }) {
  const trend = trendOf(changePercent);
  const symbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  const label =
    trend === "up" ? "দাম বেড়েছে" : trend === "down" ? "দাম কমেছে" : "দাম অপরিবর্তিত";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${STYLES[trend]} ${className}`}
      aria-label={`${label} ${formatPercent(changePercent)}`}
    >
      <span aria-hidden>{symbol}</span>
      {formatPercent(changePercent)}
    </span>
  );
}
