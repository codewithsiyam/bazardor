export default function CategoryLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 sm:px-6" aria-busy="true" aria-label="লোড হচ্ছে">
      <div className="skeleton h-[94px] w-full rounded-2xl" />
      <div className="skeleton h-14 w-full rounded-2xl" />
      <div className="skeleton h-5 w-44" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-[138px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
