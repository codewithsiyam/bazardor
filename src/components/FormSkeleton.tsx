export default function FormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-10 w-full" />
        </div>
      ))}
      <div className="skeleton h-10 w-full" />
    </div>
  );
}
