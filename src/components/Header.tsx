import { getCategories, getProducts } from "@/lib/api";
import NavBar from "./NavBar";
import PriceTicker from "./PriceTicker";

/** Navbar + price ticker. API failures only hide the data-driven parts — the page still renders. */
export default async function Header() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  return (
    <>
      <NavBar categories={categories} />
      <PriceTicker products={products} />
    </>
  );
}
