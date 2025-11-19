'use client'

import { Milestone } from '@/types/milestone'
import { MilestoneIndicatorProps } from '@/types/calendar'

/**
 * Displays milestone indicators as colored dots with overflow badge
 *
 * Shows up to maxVisible dots, then displays "+N" for additional milestones
 */
export function MilestoneIndicator({
  milestones,
  maxVisible = 3,
}: MilestoneIndicatorProps) {
  if (milestones.length === 0) return null

  const visibleCount = Math.min(milestones.length, maxVisible)
  const overflowCount = milestones.length - maxVisible

  return (
    <div className="flex items-center gap-1 mt-1" aria-label={`这一天有 ${milestones.length} 个纪念日`}>
      {/* Milestone dots */}
      <div className="flex gap-0.5">
        {milestones.slice(0, visibleCount).map((milestone, index) => (
          <div
            key={milestone.id}
            className="w-1.5 h-1.5 rounded-full bg-rose-400 ring-1 ring-white"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Overflow badge */}
      {overflowCount > 0 && (
        <span className="text-[10px] font-medium text-gray-600" aria-hidden="true">
          +{overflowCount}
        </span>
      )}
    </div>
  )
}
