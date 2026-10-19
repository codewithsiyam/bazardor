import test from "node:test";
import assert from "node:assert/strict";
import {
  toBengaliNumber,
  toEnglishNumber,
  parseBengaliNumber,
  formatPrice,
  formatTaka,
  formatPercent,
  getUnitBn,
  getPerUnitBn,
  getTakaPerUnit,
  getBanglaDate,
} from "../src/lib/format.ts";

test("toBengaliNumber converts ASCII digits only", () => {
  assert.equal(toBengaliNumber(1850), "১৮৫০");
  assert.equal(toBengaliNumber("2.1"), "২.১");
  assert.equal(toBengaliNumber("abc 12"), "abc ১২");
});

test("toEnglishNumber / parseBengaliNumber round-trip", () => {
  assert.equal(toEnglishNumber("১৮৫০"), "1850");
  assert.equal(parseBengaliNumber("১,৮৫০ টাকা"), 1850);
  assert.equal(parseBengaliNumber("৬৩.৫০ টাকা"), 63.5);
  assert.ok(Number.isNaN(parseBengaliNumber("তথ্য নেই")));
});

test("formatPrice uses Indian grouping + Bengali digits (matches Figma)", () => {
  assert.equal(formatPrice(148), "১৪৮");
  assert.equal(formatPrice(1850), "১,৮৫০");
  assert.equal(formatPrice(1290), "১,২৯০");
  assert.equal(formatPrice(123456), "১,২৩,৪৫৬");
  assert.equal(formatPrice(62), "৬২");
  assert.equal(formatPrice(63.5), "৬৩.৫০");
});

test("formatTaka never renders NaN / undefined / fake zero", () => {
  assert.equal(formatTaka(148), "১৪৮ টাকা");
  assert.equal(formatTaka(undefined), "তথ্য নেই");
  assert.equal(formatTaka(null), "তথ্য নেই");
  assert.equal(formatTaka(Number.NaN), "তথ্য নেই");
  assert.equal(formatPrice(Number.POSITIVE_INFINITY), "");
});

test("formatPercent drops the sign (the arrow carries direction)", () => {
  assert.equal(formatPercent(2.1), "২.১%");
  assert.equal(formatPercent(-6.2), "৬.২%");
  assert.equal(formatPercent(-3), "৩.০%");
  assert.equal(formatPercent(0), "০.০%");
  assert.equal(formatPercent(undefined), "০.০%");
});

test("unit helpers", () => {
  assert.equal(getUnitBn("kg"), "কেজি");
  assert.equal(getUnitBn("litre"), "লিটার");
  assert.equal(getUnitBn("dozen"), "ডজন");
  assert.equal(getUnitBn("piece"), "পিস");
  assert.equal(getUnitBn("bunch"), "bunch");
  assert.equal(getPerUnitBn("kg"), "প্রতি কেজি");
  assert.equal(getTakaPerUnit("kg"), "টাকা/কেজি");
  assert.equal(getPerUnitBn(""), "");
});

test("getBanglaDate matches the Figma sample (6 Oct 2026 is a Tuesday)", () => {
  assert.equal(
    getBanglaDate(new Date("2026-10-06T06:00:00Z")),
    "মঙ্গলবার, ৬ অক্টোবর, ২০২৬",
  );
});

test("getBanglaDate resolves the day in Asia/Dhaka, not UTC", () => {
  // 20:00 UTC on 5 Oct is already 02:00 on 6 Oct in Dhaka (UTC+6).
  assert.equal(
    getBanglaDate(new Date("2026-10-05T20:00:00Z")),
    "মঙ্গলবার, ৬ অক্টোবর, ২০২৬",
  );
  assert.equal(
    getBanglaDate(new Date("2026-10-19T00:00:00Z")),
    "সোমবার, ১৯ অক্টোবর, ২০২৬",
  );
  assert.equal(
    getBanglaDate(new Date("2026-01-01T00:00:00Z")),
    "বৃহস্পতিবার, ১ জানুয়ারি, ২০২৬",
  );
});
