'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Calendar, List } from 'lucide-react'

/**
 * Main navigation component
 *
 * Provides links to switch between timeline and calendar views
 */
export function Navigation() {
  const pathname = usePathname()
  const isCalendar = pathname === '/calendar'

  return (
    <nav className="flex items-center justify-center gap-2 mb-8" aria-label="Main navigation">
      <Link
        href="/"
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
          !isCalendar
            ? 'bg-romantic-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        )}
        aria-current={!isCalendar ? 'page' : undefined}
      >
        <List className="w-4 h-4" />
        <span>Timeline</span>
      </Link>

      <Link
        href="/calendar"
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
          isCalendar
            ? 'bg-romantic-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        )}
        aria-current={isCalendar ? 'page' : undefined}
      >
        <Calendar className="w-4 h-4" />
        <span>Calendar</span>
      </Link>
    </nav>
  )
}
