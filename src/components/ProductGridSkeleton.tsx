/** Placeholder cards shown while product data is loading. */
export default function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="skeleton size-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-6 w-24" />
            </div>
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}
