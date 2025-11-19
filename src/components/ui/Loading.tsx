export function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 rounded-lg bg-gray-200"></div>
      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Loading />
      <Loading />
      <Loading />
    </div>
  );
}
