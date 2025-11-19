'use client'

import { useState, useCallback, KeyboardEvent } from 'react'
import { CalendarGridProps } from '@/types/calendar'
import { CalendarDateCell } from './CalendarDateCell'
import { CalendarEmpty } from './CalendarEmpty'

/**
 * Calendar grid displaying weeks and date cells
 *
 * Renders a 7-column grid with day headers and date cells
 * Supports keyboard navigation with arrow keys
 */
export function CalendarGrid({ month, onDateClick, isLoading }: CalendarGridProps) {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null)

  // Check if there are any milestones in the entire month
  const hasMilestones = month.weeks.some(week =>
    week.dates.some(date => date.milestones.length > 0)
  )

  const handleKeyDown = useCallback((e: KeyboardEvent, weekIndex: number, dayIndex: number) => {
    const totalWeeks = month.weeks.length
    let newWeekIndex = weekIndex
    let newDayIndex = dayIndex

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        newDayIndex = dayIndex > 0 ? dayIndex - 1 : 6
        if (dayIndex === 0) newWeekIndex = weekIndex > 0 ? weekIndex - 1 : weekIndex
        break
      case 'ArrowRight':
        e.preventDefault()
        newDayIndex = dayIndex < 6 ? dayIndex + 1 : 0
        if (dayIndex === 6) newWeekIndex = weekIndex < totalWeeks - 1 ? weekIndex + 1 : weekIndex
        break
      case 'ArrowUp':
        e.preventDefault()
        newWeekIndex = weekIndex > 0 ? weekIndex - 1 : weekIndex
        break
      case 'ArrowDown':
        e.preventDefault()
        newWeekIndex = weekIndex < totalWeeks - 1 ? weekIndex + 1 : weekIndex
        break
      default:
        return
    }

    setFocusedCell([newWeekIndex, newDayIndex])
    // Focus the target cell
    const targetCell = document.querySelector(
      `[data-week="${newWeekIndex}"][data-day="${newDayIndex}"]`
    ) as HTMLElement
    targetCell?.focus()
  }, [month.weeks.length])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">正在加载日历...</div>
      </div>
    )
  }

  if (!hasMilestones) {
    return <CalendarEmpty />
  }

  return (
    <div role="grid" aria-label="Calendar" className="rounded-2xl border border-rose-100 overflow-hidden shadow-sm bg-white/80 backdrop-blur-sm">
      {/* Day headers */}
      <div
        role="row"
        className="grid grid-cols-7 bg-rose-50/50 border-b border-rose-100"
      >
        {weekDays.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="py-3 text-center text-sm font-semibold text-rose-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar weeks and dates */}
      {month.weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          role="row"
          className="grid grid-cols-7"
        >
          {week.dates.map((date, dateIndex) => (
            <div
              key={`${weekIndex}-${dateIndex}`}
              data-week={weekIndex}
              data-day={dateIndex}
              onKeyDown={(e) => handleKeyDown(e, weekIndex, dateIndex)}
              className="border-b border-r border-rose-50 last:border-r-0"
            >
              <CalendarDateCell
                date={date}
                onClick={onDateClick}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
