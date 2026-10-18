function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton size-12 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-6 w-24" />
        </div>
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-6 sm:px-6" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="skeleton h-72 w-full rounded-3xl md:h-[283px]" />
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-3">
          <div className="skeleton h-7 w-40" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: section === 2 ? 8 : 4 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
