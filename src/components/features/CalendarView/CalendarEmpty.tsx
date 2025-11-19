'use client'

/**
 * Empty state displayed when no milestones exist
 *
 * Shows a friendly message encouraging users to add their first milestone
 */
export function CalendarEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
      <div className="w-16 h-16 mb-4 rounded-full bg-rose-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-rose-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-rose-900 mb-2">
        还没有甜蜜的回忆
      </h3>
      <p className="text-rose-600/80 max-w-sm">
        开始记录你们的珍贵时刻，让它们点缀这个日历吧。
      </p>
    </div>
  )
}
