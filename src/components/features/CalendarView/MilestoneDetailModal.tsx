'use client'

import { MilestoneDetailModalProps } from '@/types/calendar'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Image from 'next/image'

/**
 * Modal displaying milestone details
 *
 * Shows milestone title, date, description, and image when user clicks a calendar date
 * Handles both single and multiple milestones on the same date
 */
export function MilestoneDetailModal({
  isOpen,
  milestones,
  date,
  onClose,
}: MilestoneDetailModalProps) {
  if (!date || milestones.length === 0) return null

  const formattedDate = format(date, 'yyyy年M月d日', { locale: zhCN })
  const isSingleMilestone = milestones.length === 1

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSingleMilestone ? milestones[0].title : formattedDate}
    >
      <div className="space-y-6">
        {isSingleMilestone ? (
          // Single milestone: Show full details
          <div className="space-y-4">
            <div className="text-sm text-rose-400 font-medium">{formattedDate}</div>

            {milestones[0].description && (
              <p className="text-gray-700 leading-relaxed">
                {milestones[0].description}
              </p>
            )}

            {milestones[0].imageUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-rose-50 shadow-sm">
                <Image
                  src={milestones[0].imageUrl}
                  alt={milestones[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              </div>
            )}
          </div>
        ) : (
          // Multiple milestones: Show list
          <div className="space-y-4">
            <p className="text-sm text-rose-500 font-medium">
              这一天有 {milestones.length} 个甜蜜回忆
            </p>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-4 border border-rose-100 rounded-xl hover:bg-rose-50 transition-colors bg-white/50"
                >
                  <h3 className="font-semibold text-rose-800 mb-1">
                    {milestone.title}
                  </h3>

                  {milestone.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {milestone.description}
                    </p>
                  )}

                  {milestone.imageUrl && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-rose-50 mt-3 shadow-sm">
                      <Image
                        src={milestone.imageUrl}
                        alt={milestone.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 448px"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
