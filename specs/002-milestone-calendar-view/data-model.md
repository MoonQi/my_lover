# Data Model: Milestone Calendar View

**Feature**: `002-milestone-calendar-view`
**Date**: 2025-11-19
**Status**: Phase 1 - Design

## Overview

This feature is a **view-only feature** that displays existing Milestone data in a calendar format. No new database entities or schema migrations are required. This document defines the TypeScript types for calendar view state, utility functions, and component props.

## Database Schema

### Existing Schema (No Changes)

The calendar view reuses the existing `Milestone` entity from feature 001-anniversary-calendar:

```prisma
// From prisma/schema.prisma (existing)
model Milestone {
  id          String   @id @default(uuid())
  date        DateTime @db.Date
  title       String   @db.VarChar(200)
  description String?  @db.Text
  imageUrl    String?  @db.VarChar(500)
  imageWidth  Int?
  imageHeight Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([date])
}
```

**No migrations required** - calendar view is a read-only visualization layer.

## TypeScript Types

### Calendar View State Types

**File**: `src/types/calendar.ts` (NEW)

```typescript
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
```

### Component Props Types

```typescript
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
```

## View State Management

### Calendar State Hook

**File**: `src/hooks/useCalendar.ts` (NEW)

```typescript
import { useState, useCallback, useMemo } from 'react'
import { startOfMonth, addMonths, subMonths, startOfToday } from 'date-fns'
import { CalendarNavState } from '@/types/calendar'

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
```

### Milestone Filtering Hook

**File**: `src/hooks/useMilestonesByMonth.ts` (NEW)

```typescript
import { useMemo } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { Milestone } from '@/types/milestone'

/**
 * Filter milestones that fall within a specific month
 *
 * @param milestones - All milestones (from SWR)
 * @param currentMonth - Month to filter by
 * @returns Filtered milestones for the month
 */
export function useMilestonesByMonth(
  milestones: Milestone[] | undefined,
  currentMonth: Date
): Milestone[] {
  return useMemo(() => {
    if (!milestones) return []

    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    return milestones.filter(milestone =>
      isWithinInterval(new Date(milestone.date), { start, end })
    )
  }, [milestones, currentMonth])
}
```

## Utility Functions

### Calendar Grid Generation

**File**: `src/lib/calendarUtils.ts` (NEW)

```typescript
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
import { CalendarMonth, CalendarWeek, CalendarDate } from '@/types/calendar'
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
  const calendarStart = startOfWeek(monthStart)
  // Get last day of calendar grid (may be in next month)
  const calendarEnd = endOfWeek(monthEnd)

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
    label: format(monthStart, 'MMMM yyyy'),
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
 * @returns Formatted string (e.g., "March 2025")
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy')
}

/**
 * Format date for accessibility labels
 *
 * @param date - Date to format
 * @returns Formatted string (e.g., "Monday, March 15, 2025")
 */
export function formatDateForAria(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy')
}
```

## Validation (Zod Schemas)

Since this feature only reads existing Milestone data and manages view state (not persisted), **no new Zod validation schemas are required**. Existing Milestone validation from feature 001 is reused.

## API Integration

### Existing Endpoints (Reuse)

**No new API routes required.** Calendar view uses existing milestone endpoints:

- `GET /api/milestones` - Fetch all milestones
  - Used by: `useMilestones` hook (SWR)
  - Filtering by month happens client-side via `useMilestonesByMonth` hook

**Rationale for client-side filtering**:
- Milestone dataset is small (expected 50-200 total milestones)
- SWR provides efficient caching (no re-fetch on month navigation)
- Simpler architecture (no query param handling on backend)
- Faster perceived performance (instant month switching after initial load)

## State Flow Diagram

```
┌─────────────────┐
│  CalendarView   │  (Page Component)
│  (/app/calendar)│
└────────┬────────┘
         │
         ├─ useCalendar() ────────────> Calendar navigation state
         │                              (currentMonth, next/prev/today)
         │
         ├─ useMilestones() ──────────> Fetch all milestones (SWR)
         │
         ├─ useMilestonesByMonth() ───> Filter by current month
         │
         ├─ useState() ───────────────> Modal open state
         │
         ├─ generateCalendarMonth() ──> Generate calendar grid
         │
         └─> Render:
             ├─ CalendarHeader (navigation)
             ├─ CalendarGrid (date cells)
             │   └─ CalendarDateCell (individual dates)
             │       └─ MilestoneIndicator (dots/badges)
             └─ MilestoneDetailModal (details view)
```

## Testing Considerations

### Unit Tests

1. **calendarUtils.ts**
   - `generateCalendarMonth()` - Verify correct grid with padding days
   - `getMilestonesForDate()` - Filter milestones by date
   - Edge cases: leap years, month boundaries, timezone handling

2. **useCalendar hook**
   - Navigation: next/previous month increments correctly
   - Go to today: resets to current month
   - Initial state: defaults to today's month

3. **useMilestonesByMonth hook**
   - Filters milestones within month range
   - Handles empty milestone array
   - Memoization: doesn't re-filter on unrelated renders

### Component Tests

1. **CalendarGrid**
   - Renders correct number of weeks
   - Displays current month dates in correct color
   - Shows milestone indicators on appropriate dates

2. **CalendarDateCell**
   - Click handler fires with correct date and milestones
   - Accessibility: proper aria-label
   - Visual states: today, current month, other month

3. **MilestoneIndicator**
   - Shows dots for up to 3 milestones
   - Displays "+N" badge for overflow
   - Hover/focus states

### Integration Tests

1. **Calendar + Milestones**
   - Milestones appear on correct dates
   - Month navigation updates visible milestones
   - Modal opens with correct milestone data

### E2E Tests

1. **Complete user journey** (Playwright)
   - Navigate to `/calendar`
   - Click next/previous month
   - Click milestone indicator
   - View milestone details in modal
   - Close modal and navigate to different month

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   ```typescript
   // Memoize date cells to prevent re-renders during navigation
   const MemoizedDateCell = React.memo(CalendarDateCell)
   ```

2. **Lazy Loading**
   ```typescript
   // Dynamic import for modal (only load when opened)
   const MilestoneDetailModal = dynamic(() =>
     import('./MilestoneDetailModal')
   )
   ```

3. **SWR Caching**
   - Milestones fetched once on initial calendar load
   - Cached in SWR for instant month navigation
   - Revalidate on window focus (fresh data)

4. **Virtual Scrolling**
   - Not needed for monthly view (max 42 cells)
   - Consider for year view (future enhancement)

## Accessibility

### ARIA Patterns

1. **Calendar Grid**
   ```html
   <div role="grid" aria-label="Calendar">
     <div role="row">
       <div role="gridcell" aria-label="Monday, March 15, 2025">
         15
       </div>
     </div>
   </div>
   ```

2. **Keyboard Navigation**
   - Arrow keys: Navigate between dates
   - Enter/Space: Select date (open modal)
   - Escape: Close modal
   - Tab: Navigate to next/previous month buttons

3. **Screen Reader Support**
   - Each date cell has descriptive aria-label
   - Milestone indicators have aria-label with count
   - Modal announces when opened

## Migration Strategy

**Not applicable** - No database schema changes. This is a view-only feature using existing data.

---

**Data Model Status**: ✅ Complete - No new entities required. View state and TypeScript types defined. Proceed to contracts generation.
