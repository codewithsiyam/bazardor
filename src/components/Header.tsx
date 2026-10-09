import { connection } from "next/server";
import { getCategories, getProducts } from "@/lib/api";
import { toBn } from "@/lib/bn";
import type { Category, Product } from "@/types";
import Navbar from "./Navbar";
import Ticker from "./Ticker";

function banglaDate(): string {
  const d = new Date();
  const parts = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return toBn(parts);
}

/** Server Component: fetches on the server, hands plain data to the client Navbar. */
export default async function Header() {
  await connection(); // today's date is request-time data, so opt this part out of prerendering
  let categories: Category[] = [];
  let products: Product[] = [];
  try {
    [categories, products] = await Promise.all([getCategories(), getProducts()]);
  } catch {
    // Header must never take the whole site down; render without categories/ticker.
  }
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <Navbar categories={categories} dateLabel={banglaDate()} />
      <Ticker products={products} />
    </header>
  );
}

export function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 text-xl font-bold">🛒 বাজার দর</div>
      <div className="h-9 animate-pulse bg-brand-soft" aria-hidden />
    </header>
  );
}
