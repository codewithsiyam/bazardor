"use client";

import type { SortMode } from "@/types";

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

function isSortMode(value: string): value is SortMode {
  return OPTIONS.some((option) => option.value === value);
}

interface SortSelectProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-products" className="text-sm">
        সাজান
      </label>
      <select
        id="sort-products"
        className="select select-sm w-auto"
        value={value}
        onChange={(event) => {
          if (isSortMode(event.target.value)) onChange(event.target.value);
        }}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
