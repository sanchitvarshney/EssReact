// Shared skeleton-loading primitives — used everywhere a page/drawer/modal
// is fetching data, instead of a plain "Loading…" line.

export function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="bg-gray-50 px-4 py-3">
        <SkeletonBar className="h-3 w-full max-w-xs" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-4 py-4">
            {Array.from({ length: columns }).map((_, c) => (
              <SkeletonBar key={c} className={`h-3.5 ${c === 0 ? "w-24" : "flex-1"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <SkeletonBar className="h-3 w-20 mb-2" />
          <SkeletonBar className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1">
        <SkeletonBar className="h-5 w-16 mb-2" />
        <SkeletonBar className="h-3 w-24" />
      </div>
    </div>
  );
}
