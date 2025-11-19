'use client'

import { CalendarHeaderProps } from '@/types/calendar'
import { Button } from '@/components/ui/Button'
import { formatMonthYear } from '@/lib/calendarUtils'

/**
 * Calendar header with navigation controls
 *
 * Provides prev/next month buttons, today button, and month/year display
 */
export function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  // Monthly seasonal icons
  const MONTH_ICONS = [
    '🏮', // January - New Year
    '💝', // February - Valentine's
    '🌱', // March - Spring
    '🌸', // April - Cherry Blossoms
    '🌹', // May - Roses
    '🍭', // June - Sweet/Children
    '🍦', // July - Summer/Ice Cream
    '🌻', // August - Sunflowers
    '🍁', // September - Autumn
    '🎃', // October - Halloween/Harvest
    '🧣', // November - Cozy/Scarf
    '🎄', // December - Christmas/Festive
  ]

  const monthIndex = currentMonth.getMonth()
  const currentIcon = MONTH_ICONS[monthIndex]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-100">
      {/* Month/Year Display */}
      <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-100/50 shadow-inner text-2xl" aria-hidden="true">
          {currentIcon}
        </div>
        {formatMonthYear(currentMonth)}
      </h2>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Today Button */}
        <Button
          variant="outline"
          size="default"
          onClick={onToday}
          aria-label="回到本月"
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
        >
          今天
        </Button>

        {/* Previous Month */}
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          aria-label="上个月"
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        {/* Next Month */}
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="下个月"
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}
