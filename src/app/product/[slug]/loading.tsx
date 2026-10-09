export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 px-4 py-8" role="status" aria-label="লোড হচ্ছে…">
      <div className="h-32 rounded-2xl bg-line" />
      <div className="grid gap-3 sm:grid-cols-3"><div className="h-24 rounded-2xl bg-line" /><div className="h-24 rounded-2xl bg-line" /><div className="h-24 rounded-2xl bg-line" /></div>
      <div className="h-56 rounded-2xl bg-line" />
    </div>
  );
}
