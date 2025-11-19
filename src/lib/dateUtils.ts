import { formatDistance, differenceInDays, format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * Format a date as a human-readable distance from now in Chinese
 * @example "3年2个月前"
 */
export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: zhCN,
  });
}

/**
 * Calculate days until a future date
 * @returns number of days, or 0 if date is in the past
 */
export function daysUntil(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const days = differenceInDays(dateObj, new Date());
  return Math.max(0, days);
}

/**
 * Format a date in Chinese locale
 * @example "2024年2月14日"
 */
export function formatDate(date: Date | string, formatStr: string = 'yyyy年MM月dd日'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: zhCN });
}

/**
 * Check if a date is valid
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
