import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function CategoryLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
      <span className="sr-only">লোড হচ্ছে…</span>
      <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
        <div className="skeleton size-12 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-7 w-32" />
          <div className="skeleton h-4 w-56" />
        </div>
      </div>
      <div className="flex justify-end rounded-2xl border border-base-300 bg-base-100 p-4">
        <div className="skeleton h-8 w-40 rounded-lg" />
      </div>
      <div className="skeleton h-4 w-44" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
