'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { useTimeCalculation } from '@/hooks/useTimeCalculation';
import type { Milestone } from '@/types/milestone';
import { Heart, Calendar, Edit2, Trash2 } from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  isFirst?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MilestoneCard({
  milestone,
  isFirst = false,
  onEdit,
  onDelete
}: MilestoneCardProps) {
  const { timeAgo, formattedDate } = useTimeCalculation(
    milestone.date,
    isFirst
  );

  return (
    <Card className={`animate-slide-up group relative border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
      isFirst 
        ? 'border-romantic-200 bg-gradient-to-br from-white to-romantic-50 shadow-romantic-100' 
        : 'border-transparent hover:border-romantic-100 bg-white/80 backdrop-blur-sm'
    }`}>
      {/* 装饰性小爱心 */}
      <div className="absolute -right-2 -top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Heart className="h-6 w-6 fill-romantic-400 text-romantic-400 animate-pulse" />
      </div>

      <article className="space-y-4">
        {/* Action buttons - 默认隐藏，hover显示 */}
        {(onEdit || onDelete) && (
          <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="rounded-full bg-white/90 p-2 text-gray-400 shadow-sm hover:bg-romantic-50 hover:text-romantic-600 focus:outline-none focus:ring-2 focus:ring-romantic-500 transition-colors"
                  aria-label="编辑里程碑"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="rounded-full bg-white/90 p-2 text-gray-400 shadow-sm hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  aria-label="删除里程碑"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
          </div>
        )}

        {/* Date Badge */}
        <div className="flex items-center gap-2 text-sm font-medium text-romantic-600">
          <div className="flex items-center gap-1.5 rounded-full bg-romantic-100 px-3 py-1">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={milestone.date.toString()}>
              {formattedDate}
            </time>
          </div>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-gray-500 text-xs font-normal">{timeAgo}</span>
        </div>

        {/* Title */}
        <h2 className={`font-bold text-gray-800 ${isFirst ? 'text-3xl tracking-tight' : 'text-2xl'}`}>
          {milestone.title}
        </h2>

        {/* Description */}
        {milestone.description && (
          <p className="text-gray-600 leading-relaxed text-base font-light">
            {milestone.description}
          </p>
        )}

        {/* Image */}
        {milestone.imageUrl && milestone.imageWidth && milestone.imageHeight && (
          <div className="group/image relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <Image
              src={milestone.imageUrl}
              alt={milestone.title}
              width={milestone.imageWidth}
              height={milestone.imageHeight}
              className="object-cover transition-transform duration-700 group-hover/image:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isFirst}
            />
            {/* 图片光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </article>
    </Card>
  );
}
