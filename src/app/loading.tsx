export default function Loading() {
  return (
    <div className="mx-auto max-w-xl animate-pulse px-4 py-10" role="status" aria-label="লোড হচ্ছে…">
      <div className="space-y-4 rounded-2xl border border-line bg-paper p-8">
        <div className="h-8 w-48 rounded bg-line" />
        <div className="h-4 w-full rounded bg-line" />
        <div className="h-11 w-full rounded-xl bg-line" />
        <div className="h-11 w-full rounded-xl bg-line" />
        <div className="h-11 w-full rounded-full bg-line" />
      </div>
    </div>
  );
}
