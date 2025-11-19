/**
 * Loading skeleton for calendar page
 *
 * Displayed while the page is loading
 */
export default function CalendarLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-9 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-96 bg-gray-200 rounded" />
      </div>

      {/* Calendar month label skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
      </div>

      {/* Calendar grid skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="py-2 px-4">
              <div className="h-4 bg-gray-200 rounded mx-auto w-12" />
            </div>
          ))}
        </div>

        {/* Calendar rows */}
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
            {[...Array(7)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="min-h-[80px] sm:min-h-[100px] p-2 border-r border-gray-200 last:border-r-0"
              >
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
