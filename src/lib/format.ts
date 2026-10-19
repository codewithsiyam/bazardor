/**
 * Bengali localisation helpers. Pure functions, no dependencies, so they can be
 * unit-tested in plain Node and render identically on server and client.
 *
 * Rule of the project: prices are stored and compared as numbers; they are
 * converted to Bengali digits ONLY for display.
 */

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const BENGALI_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const BENGALI_MONTHS = [
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

const UNIT_LABELS: Record<string, string> = {
  kg: "কেজি",
  gram: "গ্রাম",
  g: "গ্রাম",
  litre: "লিটার",
  liter: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
};

export const NO_DATA_LABEL = "তথ্য নেই";

/** "1850" -> "১৮৫০" (any non-digit characters are kept as they are). */
export function toBengaliNumber(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

/** "১৮৫০" -> "1850" (Bengali digits converted back to ASCII digits). */
export function toEnglishNumber(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => String(BENGALI_DIGITS.indexOf(digit)));
}

/**
 * Parses numbers written with Bengali or English digits, e.g. "১,৮৫০ টাকা" -> 1850.
 * Returns NaN when no number can be found. Used to guarantee that sorting is
 * always numeric and never alphabetical.
 */
export function parseBengaliNumber(value: string): number {
  const ascii = toEnglishNumber(value).replace(/,/g, "");
  const match = ascii.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Indian digit grouping: 1850 -> "1,850", 1234567 -> "12,34,567". */
function groupIndian(integerPart: string): string {
  if (integerPart.length <= 3) return integerPart;
  const lastThree = integerPart.slice(-3);
  const rest = integerPart.slice(0, -3);
  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
}

/**
 * 1850 -> "১,৮৫০", 63.5 -> "৬৩.৫০", 62 -> "৬২".
 * Returns an empty string for missing / non-finite values.
 */
export function formatPrice(value: number | null | undefined): string {
  if (!isValidNumber(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  const isWhole = Number.isInteger(rounded);
  const [integerPart, fraction] = Math.abs(rounded)
    .toFixed(isWhole ? 0 : 2)
    .split(".");
  const sign = rounded < 0 ? "-" : "";
  const text = `${sign}${groupIndian(integerPart)}${fraction ? `.${fraction}` : ""}`;
  return toBengaliNumber(text);
}

/** 148 -> "১৪৮ টাকা". Missing values never render as NaN / 0. */
export function formatTaka(value: number | null | undefined): string {
  const text = formatPrice(value);
  return text ? `${text} টাকা` : NO_DATA_LABEL;
}

/** 2.1 -> "২.১%", -6.2 -> "৬.২%" (the sign is shown by the ▲/▼ arrow). */
export function formatPercent(pct: number | null | undefined): string {
  const safe = isValidNumber(pct) ? Math.abs(pct) : 0;
  return `${toBengaliNumber(safe.toFixed(1))}%`;
}

/** "kg" -> "কেজি". Unknown units fall back to the raw unit text. */
export function getUnitBn(unit: string | null | undefined): string {
  if (!unit) return "";
  return UNIT_LABELS[unit.trim().toLowerCase()] ?? unit;
}

/** "kg" -> "প্রতি কেজি" */
export function getPerUnitBn(unit: string | null | undefined): string {
  const label = getUnitBn(unit);
  return label ? `প্রতি ${label}` : "";
}

/** "kg" -> "টাকা/কেজি" (compact form used by the ticker). */
export function getTakaPerUnit(unit: string | null | undefined): string {
  const label = getUnitBn(unit);
  return label ? `টাকা/${label}` : "টাকা";
}

/**
 * Bangla date such as "মঙ্গলবার, ৬ অক্টোবর, ২০২৬".
 * The calendar day is resolved in the Asia/Dhaka time zone so it does not
 * depend on the viewer's (or the server's) local zone.
 */
export function getBanglaDate(date: Date = new Date(), timeZone = "Asia/Dhaka"): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);

  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(pick("weekday"));
  const monthIndex = Number(pick("month")) - 1;

  const weekday = BENGALI_WEEKDAYS[weekdayIndex] ?? "";
  const month = BENGALI_MONTHS[monthIndex] ?? "";
  const day = toBengaliNumber(pick("day"));
  const year = toBengaliNumber(pick("year"));

  return `${weekday}, ${day} ${month}, ${year}`;
}
