/**
 * Bangla-first formatting helpers.
 * Prices are stored and compared as plain numbers; Bengali digits are display-only.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const BN_WEEKDAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/** "123" → "১২৩" (non-digit characters are kept as they are). */
export function toBengaliNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** "১২৩" → "123" */
export function toEnglishDigits(value: string): string {
  return value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/**
 * Safely turns API values (numbers, "১,৮৫০", "148 টাকা", …) into a finite number.
 * Returns null when no valid number can be read — never NaN, never a fake 0.
 */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const cleaned = toEnglishDigits(value).replace(/টাকা|৳|BDT|Tk\.?/gi, "").replace(/[,\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Indian-style digit grouping: 1850 → "1,850", 1234567 → "12,34,567" */
function groupIndian(intPart: string): string {
  if (intPart.length <= 3) return intPart;
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
}

/** 1850 → "১,৮৫০" · 63.5 → "৬৩.৫০" · null → "—" */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const [int, frac] = Math.abs(value).toFixed(2).split(".");
  const fraction = frac === "00" ? "" : `.${frac}`;
  const sign = value < 0 ? "-" : "";
  return toBengaliNumber(`${sign}${groupIndian(int)}${fraction}`);
}

/** 148 → "১৪৮ টাকা" · null → "—" */
export function formatTaka(value: number | null | undefined): string {
  const price = formatPrice(value);
  return price === "—" ? price : `${price} টাকা`;
}

/** 2.1 → "২.১%" */
export function formatPercent(pct: number): string {
  return `${toBengaliNumber(pct.toFixed(1))}%`;
}

/** Count in Bengali digits: 33 → "৩৩" */
export function formatCount(n: number): string {
  return toBengaliNumber(n);
}

const UNIT_NAMES: Record<string, string> = {
  kg: "কেজি",
  kilogram: "কেজি",
  kilo: "কেজি",
  "কেজি": "কেজি",
  l: "লিটার",
  lt: "লিটার",
  litre: "লিটার",
  liter: "লিটার",
  "লিটার": "লিটার",
  dozen: "ডজন",
  doz: "ডজন",
  "ডজন": "ডজন",
  piece: "পিস",
  pieces: "পিস",
  pcs: "পিস",
  pc: "পিস",
  each: "পিস",
  "পিস": "পিস",
  g: "গ্রাম",
  gm: "গ্রাম",
  gram: "গ্রাম",
  "গ্রাম": "গ্রাম",
  hali: "হালি",
  "হালি": "হালি",
};

/** "kg" → "কেজি" (unknown units are returned unchanged). */
export function getUnitName(unit: string | null | undefined): string {
  const raw = (unit ?? "").trim();
  if (!raw) return "";
  const key = raw.toLowerCase().replace(/^(per|প্রতি)\s*/i, "").trim();
  return UNIT_NAMES[key] ?? (key || raw);
}

/** "kg" → "প্রতি কেজি" */
export function getUnitBn(unit: string | null | undefined): string {
  const name = getUnitName(unit);
  return name ? `প্রতি ${name}` : "";
}

/**
 * Bangla date in the Bangladesh time zone, e.g. "মঙ্গলবার, ৬ অক্টোবর, ২০২৬".
 * Uses the numeric date parts from Intl (no locale data needed) and maps names itself.
 */
export function getBanglaDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const year = pick("year");
  const month = pick("month");
  const day = pick("day");
  if (!year || !month || !day) return "";
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${BN_WEEKDAYS[weekday]}, ${toBengaliNumber(day)} ${BN_MONTHS[month - 1]}, ${toBengaliNumber(year)}`;
}
