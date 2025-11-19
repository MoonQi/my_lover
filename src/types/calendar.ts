import { Milestone } from './milestone'

/**
 * Represents a calendar date cell in the grid
 */
export interface CalendarDate {
  /** Date object for this cell */
  date: Date
  /** Whether this date belongs to the currently displayed month */
  isCurrentMonth: boolean
  /** Whether this date is today */
  isToday: boolean
  /** Milestones that occur on this date */
  milestones: Milestone[]
}

/**
 * Represents a week row in the calendar grid
 */
export interface CalendarWeek {
  /** Array of 7 date cells (Sunday - Saturday) */
  dates: CalendarDate[]
}

/**
 * Complete calendar month data structure
 */
export interface CalendarMonth {
  /** Year (e.g., 2025) */
  year: number
  /** Month (0-11, January = 0) */
  month: number
  /** Array of weeks in this month (typically 4-6 weeks) */
  weeks: CalendarWeek[]
  /** Human-readable month/year label (e.g., "March 2025") */
  label: string
}

/**
 * Calendar navigation state
 */
export interface CalendarNavState {
  /** Currently displayed year */
  currentYear: number
  /** Currently displayed month (0-11) */
  currentMonth: number
}

/**
 * Milestone detail modal state
 */
export interface MilestoneDetailState {
  /** Whether modal is open */
  isOpen: boolean
  /** Selected milestone(s) to display */
  milestones: Milestone[]
  /** Date context for modal title */
  date: Date | null
}

/**
 * Calendar view mode (future enhancement placeholder)
 */
export type CalendarViewMode = 'month' // Future: 'week' | 'year'

/**
 * Props for CalendarView container
 */
export interface CalendarViewProps {
  /** Initial month to display (optional, defaults to current month) */
  initialMonth?: Date
}

/**
 * Props for CalendarGrid component
 */
export interface CalendarGridProps {
  /** Calendar month data to render */
  month: CalendarMonth
  /** Callback when a date cell is clicked */
  onDateClick: (date: Date, milestones: Milestone[]) => void
  /** Whether data is loading */
  isLoading?: boolean
}

/**
 * Props for CalendarHeader component
 */
export interface CalendarHeaderProps {
  /** Current month being displayed */
  currentMonth: Date
  /** Navigate to previous month */
  onPreviousMonth: () => void
  /** Navigate to next month */
  onNextMonth: () => void
  /** Navigate to today's month */
  onToday: () => void
  /** Callback when month/year is selected via picker */
  onMonthYearSelect?: (year: number, month: number) => void
}

/**
 * Props for CalendarDateCell component
 */
export interface CalendarDateCellProps {
  /** Date data for this cell */
  date: CalendarDate
  /** Callback when cell is clicked */
  onClick: (date: Date, milestones: Milestone[]) => void
}

/**
 * Props for MilestoneIndicator component
 */
export interface MilestoneIndicatorProps {
  /** Milestones to display indicators for */
  milestones: Milestone[]
  /** Maximum number of indicators to show before overflow */
  maxVisible?: number // default: 3
}

/**
 * Props for MilestoneDetailModal component
 */
export interface MilestoneDetailModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Milestones to display in modal */
  milestones: Milestone[]
  /** Date context for modal header */
  date: Date | null
  /** Callback to close modal */
  onClose: () => void
}
