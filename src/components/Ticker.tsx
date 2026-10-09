import { formatTaka } from "@/lib/bn";
import type { Product } from "@/types";
import PriceBadge from "./PriceBadge";

function Item({ p }: { p: Product }) {
  return (
    <li className="flex shrink-0 items-center gap-2 whitespace-nowrap px-5 text-sm">
      <span aria-hidden>{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span className="text-muted">
        {formatTaka(p.price)}/{p.unit.replace("প্রতি ", "")}
      </span>
      <PriceBadge changePercent={p.changePercent} />
    </li>
  );
}

export default function Ticker({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const items = products.slice(0, 24);
  return (
    <div className="marquee overflow-hidden border-t border-line bg-brand-soft py-1.5" aria-label="আজকের দামের তালিকা">
      <div className="marquee-track flex">
        <ul className="flex">{items.map((p) => <Item key={p.id} p={p} />)}</ul>
        {/* Second copy makes the -50% translate loop seamless; hidden from screen readers. */}
        <ul className="flex" aria-hidden>{items.map((p) => <Item key={`d-${p.id}`} p={p} />)}</ul>
      </div>
    </div>
  );
}
