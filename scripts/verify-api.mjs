/**
 * Live API check:  npm run verify:api
 *
 * Calls every endpoint pattern of the assignment on each API host, validates the payloads with the
 * SAME runtime guards the app uses (src/lib/guards.ts) and prints a PASS / FAIL table.
 * Set BAZARDOR_API_URL to test one specific host (also used to point the script at a local mock).
 */
import { extractList, isCategory, isProduct } from "../src/lib/guards.ts";

const HOSTS = process.env.BAZARDOR_API_URL
  ? [process.env.BAZARDOR_API_URL.replace(/\/+$/, "")]
  : [
      "https://openapi.programming-hero.com/api/bazardor",
      "https://api.api-store.workers.dev/api/bazardor",
      "https://api.abcz.workers.dev/api/bazardor",
    ];

const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const CHECKS = [
  { path: "/products", describe: "all products", ok: (d) => extractList(d).length > 0 && extractList(d).every(isProduct) },
  { path: "/products?category=chal", describe: "products filtered by category", ok: (d) => {
      const list = extractList(d);
      return list.length > 0 && list.every((p) => isProduct(p) && p.category === "chal");
    } },
  { path: "/products/1", describe: "single product (numeric id)", ok: (d) => isProduct(d) && d.id === 1 },
  { path: "/categories", describe: "all categories", ok: (d) => extractList(d).length > 0 && extractList(d).every(isCategory) },
  { path: "/categories/chal", describe: "single category", ok: (d) => isRecord(d) && isCategory(d) && d.slug === "chal" },
];

let primaryFailed = false;

for (const [hostIndex, host] of HOSTS.entries()) {
  console.log(`\n${host}`);
  for (const check of CHECKS) {
    let verdict;
    try {
      const response = await fetch(`${host}${check.path}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        verdict = `FAIL  HTTP ${response.status}`;
      } else {
        const data = await response.json();
        verdict = check.ok(data) ? "PASS" : "FAIL  unexpected payload shape";
      }
    } catch (error) {
      verdict = `FAIL  ${error instanceof Error ? error.message : "request error"}`;
    }
    console.log(`  ${verdict.padEnd(32)} ${check.path.padEnd(26)} ${check.describe}`);
    // Only the endpoints the app itself relies on decide the exit code of the primary host.
    if (hostIndex === 0 && verdict.startsWith("FAIL") && ["/products", "/categories"].includes(check.path)) {
      primaryFailed = true;
    }
  }
}

if (primaryFailed) {
  console.error("\nThe primary API host failed a required endpoint (/products or /categories).");
  process.exit(1);
}
console.log("\nRequired endpoints (/products, /categories) respond with valid data on the primary host.");
