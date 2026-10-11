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

/** 2.1 -> "২.১০%" (unsigned magnitude). */
export function formatPercent(value: number): string {
  return `${toBn(Math.abs(value).toFixed(2))}%`;
}

/** 2.1 -> "+২.১০%", -2.9 -> "-২.৯০%", 0 -> "০.০০%". */
export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${toBn(Math.abs(rounded).toFixed(2))}%`;
}

export type Trend = "up" | "down" | "flat" | "unknown";

/** Direction from a signed % change. `null` (no genuine data) is "unknown", never "flat". */
export function trendOf(changePercent: number | null): Trend {
  if (changePercent === null) return "unknown";
  // Compare the value as it will be displayed (2 decimals) so "▲ +০.০০%" can never appear.
  const rounded = Math.round(changePercent * 100) / 100;
  if (rounded > 0) return "up";
  if (rounded < 0) return "down";
  return "flat";
}
