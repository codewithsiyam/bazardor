import { formatNumber } from "@/lib/bn";
import type { Product } from "@/types";
import PriceBadge from "./PriceBadge";

function Item({ p }: { p: Product }) {
  const unit = p.unit.replace("প্রতি ", "");
  return (
    <li className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 text-sm">
      <span aria-hidden>{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span className="text-muted">
        {p.price === null ? "দাম নেই" : `${formatNumber(p.price)} টাকা${unit ? `/${unit}` : ""}`}
      </span>
      <PriceBadge changePercent={p.changePercent} />
    </li>
  );
}

export default function Ticker({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  // Repeat short lists so one half of the track is always wider than the screen (no empty gap in the loop).
  const base = products.slice(0, 30);
  const half = Array.from({ length: Math.max(1, Math.ceil(14 / base.length)) }, () => base).flat();
  return (
    <div className="marquee overflow-hidden border-t border-line bg-paper py-1.5" aria-label="আজকের দামের তালিকা">
      <div className="marquee-track flex">
        <ul className="flex">{half.map((p, i) => <Item key={`${p.id}-${i}`} p={p} />)}</ul>
        {/* Second copy makes the -50% translate loop seamless; hidden from screen readers. */}
        <ul className="flex" aria-hidden>{half.map((p, i) => <Item key={`d-${p.id}-${i}`} p={p} />)}</ul>
      </div>
    </div>
  );
}
