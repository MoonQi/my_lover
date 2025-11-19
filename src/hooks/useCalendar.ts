import { useState, useCallback } from 'react'
import { startOfMonth, addMonths, subMonths, startOfToday } from 'date-fns'

export interface UseCalendarReturn {
  /** Current month being displayed */
  currentMonth: Date
  /** Navigate to previous month */
  previousMonth: () => void
  /** Navigate to next month */
  nextMonth: () => void
  /** Navigate to specific month/year */
  goToMonth: (year: number, month: number) => void
  /** Navigate to current month */
  goToToday: () => void
}

/**
 * Custom hook for managing calendar navigation state
 *
 * @param initialDate - Optional initial date (defaults to today)
 * @returns Calendar navigation functions and current state
 */
export function useCalendar(initialDate?: Date): UseCalendarReturn {
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(initialDate || startOfToday())
  )

  const previousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }, [])

  const goToMonth = useCallback((year: number, month: number) => {
    setCurrentMonth(new Date(year, month, 1))
  }, [])

  const goToToday = useCallback(() => {
    setCurrentMonth(startOfMonth(startOfToday()))
  }, [])

  return {
    currentMonth,
    previousMonth,
    nextMonth,
    goToMonth,
    goToToday,
  }
}
