'use client'

import { memo } from 'react'
import { CalendarDateCellProps } from '@/types/calendar'
import { MilestoneIndicator } from './MilestoneIndicator'
import { formatDateForAria } from '@/lib/calendarUtils'
import clsx from 'clsx'

/**
 * Individual calendar date cell with milestone indicators
 *
 * Displays the day number and milestone indicators, handles click interactions
 * Memoized to prevent unnecessary re-renders during month navigation
 */
export const CalendarDateCell = memo(function CalendarDateCell({ date, onClick }: CalendarDateCellProps) {
  const { date: cellDate, isCurrentMonth, isToday, milestones } = date

  const handleClick = () => {
    if (milestones.length > 0) {
      onClick(cellDate, milestones)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role="gridcell"
      aria-label={formatDateForAria(cellDate)}
      className={clsx(
        'min-h-[80px] sm:min-h-[100px] p-2 transition-all duration-200',
        'flex flex-col',
        !isCurrentMonth && 'bg-rose-50/20 text-rose-300',
        milestones.length > 0 && 'cursor-pointer hover:bg-rose-50 hover:shadow-inner'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={milestones.length > 0 ? 0 : -1}
    >
      {/* Day number */}
      <div
        className={clsx(
          'text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center transition-colors',
          isCurrentMonth ? 'text-gray-700' : 'text-rose-200',
          isToday && 'bg-rose-500 text-white shadow-md shadow-rose-200'
        )}
      >
        {cellDate.getDate()}
      </div>

      {/* Milestone indicators */}
      {milestones.length > 0 && (
        <MilestoneIndicator milestones={milestones} maxVisible={3} />
      )}
    </div>
  )
})
