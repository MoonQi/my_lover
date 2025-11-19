import { formatTimeAgo, daysUntil, formatDate } from '@/lib/dateUtils';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns';

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

  // Calculate precise years, months, and days
  const years = differenceInYears(now, dateObj);

  // Calculate remaining months after subtracting full years
  const dateAfterYears = addYears(dateObj, years);
  const months = differenceInMonths(now, dateAfterYears);

  // Calculate remaining days after subtracting full years and months
  const dateAfterYearsAndMonths = addMonths(dateAfterYears, months);
  const days = differenceInDays(now, dateAfterYearsAndMonths);

  let totalTimeTogether: string | undefined;
  if (isFirstMilestone) {
    if (years > 0) {
      totalTimeTogether = `${years}年${months > 0 ? months + '个月' : ''}`;
    } else if (months > 0) {
      totalTimeTogether = `${months}个月`;
    } else {
      totalTimeTogether = `${days}天`;
    }
  }

  return {
    timeAgo: formatTimeAgo(dateObj),
    formattedDate: formatDate(dateObj),
    totalTimeTogether,
  };
}
