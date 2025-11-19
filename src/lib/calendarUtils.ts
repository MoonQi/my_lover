/**
 * Calendar utility functions for the Milestone Calendar View
 */

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday as dateFnsIsToday,
  isSameDay,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarMonth, CalendarWeek } from '@/types/calendar'
import { Milestone } from '@/types/milestone'

/**
 * Generate a complete calendar month grid with padding days
 *
 * @param year - Year (e.g., 2025)
 * @param month - Month (0-11, January = 0)
 * @param milestones - Milestones to include in the grid
 * @returns CalendarMonth data structure
 */
export function generateCalendarMonth(
  year: number,
  month: number,
  milestones: Milestone[]
): CalendarMonth {
  const monthStart = new Date(year, month, 1)
  const monthEnd = endOfMonth(monthStart)

  // Get first day of calendar grid (may be in previous month)
  const calendarStart = startOfWeek(monthStart, { locale: zhCN })
  // Get last day of calendar grid (may be in next month)
  const calendarEnd = endOfWeek(monthEnd, { locale: zhCN })

  // Generate all dates in the grid
  const allDates = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Group dates into weeks (7 days each)
  const weeks: CalendarWeek[] = []
  for (let i = 0; i < allDates.length; i += 7) {
    const weekDates = allDates.slice(i, i + 7).map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, monthStart),
      isToday: dateFnsIsToday(date),
      milestones: getMilestonesForDate(date, milestones),
    }))

    weeks.push({ dates: weekDates })
  }

  return {
    year,
    month,
    weeks,
    label: format(monthStart, 'yyyy年 MMMM', { locale: zhCN }),
  }
}

/**
 * Filter milestones that occur on a specific date
 *
 * @param date - Date to filter by
 * @param milestones - All milestones
 * @returns Milestones on this date
 */
export function getMilestonesForDate(
  date: Date,
  milestones: Milestone[]
): Milestone[] {
  return milestones.filter(milestone =>
    isSameDay(new Date(milestone.date), date)
  )
}

/**
 * Format month/year for display
 *
 * @param date - Date to format
 * @returns Formatted string (e.g., "2025年三月")
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'yyyy年 MMMM', { locale: zhCN })
}

/**
 * Format date for accessibility labels
 *
 * @param date - Date to format
 * @returns Formatted string (e.g., "2025年3月15日 星期一")
 */
export function formatDateForAria(date: Date): string {
  return format(date, 'yyyy年M月d日 EEEE', { locale: zhCN })
}
