const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** 148 -> "১৪৮". Display only — never feed the result back into math. */
export function toBn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** "১,২৯০.৫০" or "1290" -> 1290.5. Used when an API hands us Bengali text. */
export function parseNumber(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string") return null;
  const ascii = input
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[,\s৳]|টাকা/g, "")
    .replace(/[^\d.\-+]/g, "");
  if (!ascii) return null;
  const n = Number(ascii);
  return Number.isFinite(n) ? n : null;
}

/** 1850 -> "১,৮৫০", 64.5 -> "৬৪.৫০" (en-IN style grouping, as in the design). */
export function formatNumber(value: number): string {
  const hasFraction = !Number.isInteger(value);
  const s = value.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return toBn(s);
}

export function formatTaka(value: number): string {
  return `${formatNumber(value)} টাকা`;
}

export function formatPercent(value: number): string {
  return `${toBn(Math.abs(value).toFixed(1))}%`;
}

export type Trend = "up" | "down" | "flat";

export function trendOf(changePercent: number): Trend {
  if (changePercent > 0) return "up";
  if (changePercent < 0) return "down";
  return "flat";
}
