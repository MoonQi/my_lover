'use client'

import { CalendarView } from '@/components/features/CalendarView/CalendarView'
import { Navigation } from '@/components/ui/Navigation'

/**
 * Calendar page route
 *
 * Displays relationship milestones in a monthly calendar view
 */
export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <Navigation />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我们的日历</h1>
      </div>

      <CalendarView />
    </div>
  )
}
