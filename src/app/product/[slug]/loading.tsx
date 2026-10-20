export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="skeleton h-5 w-56" />
      <div className="skeleton h-43.5 w-full rounded-2xl" />
      <div className="space-y-6 rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="skeleton h-6 w-40" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-25.5 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}
