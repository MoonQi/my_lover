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
