import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  sortProducts,
  getRisers,
  getFallers,
  findProductByParam,
  getPriceSummary,
  getMarketRows,
  getDayDifference,
  getProductEmoji,
} from "../src/lib/products.ts";
import { isProduct, isCategory, extractList } from "../src/lib/guards.ts";
import { formatPrice, parseBengaliNumber } from "../src/lib/format.ts";

const products = JSON.parse(
  readFileSync(new URL("./fixtures/products.sample.json", import.meta.url), "utf8"),
);
const bySlug = (slug) => products.find((p) => p.slug === slug);

test("fixtures (real API records) pass the runtime guard", () => {
  assert.ok(products.every(isProduct));
});

test("sorting is numeric: 1,850 sorts as a number, not as a string", () => {
  const asc = sortProducts(products, "price-asc").map((p) => p.slug);
  assert.deepEqual(asc, ["alu", "peyaj", "batam-size-chal", "ilish-mach"]);
  const desc = sortProducts(products, "price-desc").map((p) => p.slug);
  assert.deepEqual(desc, ["ilish-mach", "batam-size-chal", "peyaj", "alu"]);
});

test("sorting by DISPLAYED Bengali text would be wrong, numeric parse is right", () => {
  const displayed = products.map((p) => formatPrice(p.today));
  const stringSorted = [...displayed].sort();
  const numericSorted = [...displayed].sort(
    (a, b) => parseBengaliNumber(a) - parseBengaliNumber(b),
  );
  // "১,৮৫০" < "৩০" as strings, but 30 < 1850 numerically.
  assert.notDeepEqual(stringSorted, numericSorted);
  assert.deepEqual(numericSorted, ["৩০", "৫৪", "৬৬", "১,৮৫০"]);
});

test("default sort keeps API order and never mutates the input", () => {
  const before = products.map((p) => p.slug);
  const out = sortProducts(products, "default").map((p) => p.slug);
  sortProducts(products, "price-desc");
  assert.deepEqual(out, before);
  assert.deepEqual(products.map((p) => p.slug), before);
});

test("risers / fallers use real API direction and size", () => {
  assert.deepEqual(getRisers(products).map((p) => p.slug), ["peyaj", "ilish-mach", "batam-size-chal"]);
  assert.deepEqual(getFallers(products).map((p) => p.slug), ["alu"]);
  assert.equal(getRisers(products, 2).length, 2);
});

test("price summary equals the Figma values for বাটাম সাইজ চাল (৫৯ / ৭৩ / ৬৬)", () => {
  const summary = getPriceSummary(bySlug("batam-size-chal"));
  assert.equal(summary.min, 59);
  assert.equal(summary.max, 73);
  assert.equal(summary.avg, 66);
  assert.equal(summary.minMarket.market, "মাঠ বাজার");
  assert.equal(summary.marketCount, 12);
});

test("market rows are ordered by average and per-market averages match Figma", () => {
  const rows = getMarketRows(bySlug("batam-size-chal"));
  assert.equal(rows[0].market, "মাঠ বাজার");
  assert.equal(rows[0].avg, 62);
  assert.equal(rows[2].avg, 63.5); // বাজারহাট -> "৬৩.৫০ টাকা" in Figma
  assert.equal(rows.at(-1).market, "কারওয়ান বাজার");
  assert.equal(rows.at(-1).avg, 69);
});

test("no statistic is produced without valid market records", () => {
  const empty = { ...bySlug("alu"), markets: [] };
  assert.equal(getPriceSummary(empty), null);
  const broken = {
    ...bySlug("alu"),
    markets: [
      { market: "x", division: "y", min: Number.NaN, max: 10 },
      { market: "x", division: "y", min: 0, max: 10 },
      { market: "x", division: "y", min: 20, max: 10 },
    ],
  };
  assert.equal(getPriceSummary(broken), null);
});

test("day difference + routing helpers", () => {
  assert.equal(getDayDifference(bySlug("batam-size-chal")), 2);
  assert.equal(getDayDifference({ ...bySlug("alu"), yesterday: undefined }), null);
  assert.equal(findProductByParam(products, "alu").id, 12);
  assert.equal(findProductByParam(products, "13").slug, "peyaj"); // numeric id fallback
  assert.equal(findProductByParam(products, "nope"), null);
  assert.equal(findProductByParam(products, "999"), null);
  assert.equal(getProductEmoji(bySlug("alu")), "🥔");
  assert.equal(getProductEmoji({ categoryIcon: "🥬" }), "🥬");
  assert.equal(getProductEmoji({}), "🛒");
});

test("guards reject malformed records and unwrap list payloads", () => {
  assert.equal(isProduct({ ...products[0], today: 0 }), false);
  assert.equal(isProduct({ ...products[0], change: { dir: "sideways", pct: 1 } }), false);
  assert.equal(isProduct(null), false);
  assert.equal(isCategory({ id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" }), true);
  assert.equal(isCategory({ id: "chal" }), false);
  assert.equal(extractList([1, 2]).length, 2);
  assert.equal(extractList({ data: [1] }).length, 1);
  assert.equal(extractList({ products: [1, 2, 3] }).length, 3);
  assert.equal(extractList({ error: "x" }).length, 0);
  assert.equal(extractList("nope").length, 0);
});
