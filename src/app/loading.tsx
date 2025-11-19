import { LoadingSkeleton } from '@/components/ui/Loading';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upcoming section skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Timeline section skeleton */}
        <div className="space-y-8">
          <LoadingSkeleton />
        </div>
      </div>
    </div>
  );
}
