import { formatTimeAgo, formatDate } from '@/lib/dateUtils';
import { differenceInDays } from 'date-fns';

export interface TimeCalculation {
  timeAgo: string;
  formattedDate: string;
  totalTimeTogether?: string;
}

/**
 * Calculate time-related information for a milestone
 */
export function useTimeCalculation(date: Date | string, isFirstMilestone: boolean = false): TimeCalculation {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // 以「天」为单位计算在一起的总时长
  const daysTogether = differenceInDays(now, dateObj);

  let totalTimeTogether: string | undefined;
  if (isFirstMilestone) {
    totalTimeTogether = `${daysTogether}天`;
  }

  return {
    timeAgo: formatTimeAgo(dateObj),
    formattedDate: formatDate(dateObj),
    totalTimeTogether,
  };
}
