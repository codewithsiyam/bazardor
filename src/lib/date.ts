import { toBn } from "./bn";

/** "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" in Bangladesh time. Call only from request-time (dynamic) code. */
export function banglaDate(date = new Date()): string {
  const text = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return toBn(text);
}
