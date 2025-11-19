'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { useUpcomingMilestones } from '@/hooks/useUpcomingMilestones';
import { formatDate } from '@/lib/dateUtils';

export function UpcomingList() {
  const { upcomingAnniversaries, isLoading, isError } = useUpcomingMilestones();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-gray-200"
            aria-label="加载中"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50 p-4">
        <p className="text-center text-red-800 text-sm">加载失败，请刷新页面重试</p>
      </Card>
    );
  }

  if (!upcomingAnniversaries || upcomingAnniversaries.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-romantic-50 to-white p-6 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="mb-3 h-12 w-12 text-romantic-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="font-medium text-gray-700">未来 30 天内没有即将到来的纪念日</p>
          <p className="mt-1 text-gray-500 text-sm">继续创造美好回忆吧 💕</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="即将到来的纪念日">
      {upcomingAnniversaries.map((anniversary) => {
        const isToday = anniversary.daysUntil === 0;
        const isSoon = anniversary.daysUntil <= 7;

        return (
          <Card
            key={anniversary.id}
            className={`transition-all ${
              isToday
                ? 'border-romantic-500 bg-romantic-50 shadow-lg ring-2 ring-romantic-500'
                : isSoon
                ? 'border-romantic-300 bg-romantic-50/50'
                : ''
            }`}
            role="listitem"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Image thumbnail */}
              {anniversary.imageUrl && anniversary.imageWidth && anniversary.imageHeight && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={anniversary.imageUrl}
                    alt={anniversary.title}
                    width={anniversary.imageWidth}
                    height={anniversary.imageHeight}
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {anniversary.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 font-medium text-xs ${
                      isToday
                        ? 'animate-pulse bg-romantic-500 text-white'
                        : isSoon
                        ? 'bg-romantic-200 text-romantic-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    aria-label={`${anniversary.daysUntil}天后`}
                  >
                    {isToday ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        今天
                      </span>
                    ) : (
                      `${anniversary.daysUntil}天后`
                    )}
                  </span>
                </div>
                <p className="mt-1 text-gray-600 text-sm">
                  {formatDate(new Date(anniversary.nextAnniversary))} · 第 {anniversary.yearsSince}{' '}
                  周年
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
