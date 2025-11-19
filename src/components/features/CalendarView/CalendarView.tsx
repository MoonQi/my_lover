'use client'

import { useState, useMemo } from 'react'
import { CalendarViewProps, MilestoneDetailState } from '@/types/calendar'
import { Milestone } from '@/types/milestone'
import { useCalendar } from '@/hooks/useCalendar'
import { useMilestones } from '@/hooks/useMilestones'
import { useMilestonesByMonth } from '@/hooks/useMilestonesByMonth'
import { generateCalendarMonth } from '@/lib/calendarUtils'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'
import { MilestoneDetailModal } from './MilestoneDetailModal'

/**
 * Main calendar view container
 *
 * Manages calendar state, fetches milestones, and renders the calendar grid
 * Future: Will integrate CalendarHeader (US2) and MilestoneDetailModal (US3)
 */
export function CalendarView({ initialMonth }: CalendarViewProps) {
  // Calendar navigation state
  const { currentMonth, previousMonth, nextMonth, goToToday } = useCalendar(initialMonth)

  // Fetch all milestones
  const { milestones, isLoading } = useMilestones()

  // Filter milestones by current month
  const monthMilestones = useMilestonesByMonth(milestones, currentMonth)

  // Generate calendar month data
  const calendarMonth = useMemo(() => {
    return generateCalendarMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      monthMilestones
    )
  }, [currentMonth, monthMilestones])

  // Modal state for milestone details (will be used in User Story 3)
  const [modalState, setModalState] = useState<MilestoneDetailState>({
    isOpen: false,
    milestones: [],
    date: null,
  })

  // Handle date cell click
  const handleDateClick = (date: Date, milestones: Milestone[]) => {
    setModalState({
      isOpen: true,
      milestones,
      date,
    })
  }

  // Handle modal close
  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      milestones: [],
      date: null,
    })
  }

  return (
    <div className="w-full">
      {/* Calendar header with navigation (User Story 2) */}
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
        onToday={goToToday}
      />

      {/* Calendar grid with smooth transitions */}
      <div className="transition-opacity duration-300 ease-in-out">
        <CalendarGrid
          month={calendarMonth}
          onDateClick={handleDateClick}
          isLoading={isLoading}
        />
      </div>

      {/* Milestone detail modal (User Story 3) */}
      <MilestoneDetailModal
        isOpen={modalState.isOpen}
        milestones={modalState.milestones}
        date={modalState.date}
        onClose={handleModalClose}
      />
    </div>
  )
}
