import ProductGridSkeleton from "@/components/ProductGridSkeleton";

/** Home page skeleton (also the default fallback for routes without their own). */
export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6"
    >
      <span className="sr-only">লোড হচ্ছে…</span>
      <div className="skeleton h-80 rounded-3xl md:h-64" />
      {[0, 1].map((section) => (
        <div key={section} className="space-y-3">
          <div className="skeleton h-7 w-48" />
          <ProductGridSkeleton count={6} />
        </div>
      ))}
    </div>
  );
}
