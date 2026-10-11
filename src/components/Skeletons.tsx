export function CardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl border border-line bg-paper p-4" aria-hidden>
      <div className="h-14 w-14 rounded-xl bg-line" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-line" />
        <div className="h-4 w-1/3 rounded bg-line" />
      </div>
      <div className="flex items-end justify-between border-t border-line pt-3">
        <div className="space-y-2">
          <div className="h-3 w-14 rounded bg-line" />
          <div className="h-5 w-20 rounded bg-line" />
        </div>
        <div className="h-5 w-14 rounded-full bg-line" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="লোড হচ্ছে…" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 h-8 w-56 animate-pulse rounded bg-line" aria-hidden />
      <GridSkeleton count={count} />
    </section>
  );
}

export function AuthSkeleton() {
  return (
    <div className="mx-auto max-w-md animate-pulse px-4 py-10" role="status" aria-label="লোড হচ্ছে…">
      <div className="space-y-4 rounded-2xl border border-line bg-paper p-8">
        <div className="h-8 w-48 rounded bg-line" />
        <div className="h-4 w-full rounded bg-line" />
        <div className="h-11 w-full rounded-lg bg-line" />
        <div className="h-11 w-full rounded-lg bg-line" />
        <div className="h-11 w-full rounded-lg bg-line" />
      </div>
    </div>
  );
}
