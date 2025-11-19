# Quickstart: Milestone Calendar View Development

**Feature**: `002-milestone-calendar-view`
**Date**: 2025-11-19
**Branch**: `002-milestone-calendar-view`

## Overview

This guide provides step-by-step instructions for developing the Milestone Calendar View feature. This is a **frontend-only feature** that adds a new calendar visualization to the existing Anniversary Calendar application.

## Prerequisites

Before starting, ensure you have completed feature 001-anniversary-calendar setup:

- ✅ Node.js 20 LTS installed
- ✅ pnpm package manager installed
- ✅ PostgreSQL 15+ running
- ✅ Docker (optional, for containerized development)
- ✅ Existing Anniversary Calendar app running (`pnpm dev`)

**Verify Prerequisites**:
```bash
node --version  # Should be v20.x.x
pnpm --version  # Should be 8.x.x or higher
psql --version  # Should be 15.x or higher
```

## Quick Start (5 Minutes)

### 1. Ensure You're on the Correct Branch

```bash
# Should already be on this branch from /speckit.specify command
git branch  # Should show * 002-milestone-calendar-view

# If not, checkout the branch
git checkout 002-milestone-calendar-view
```

### 2. No New Dependencies Required

The calendar feature uses existing dependencies from feature 001. No `pnpm install` needed.

**Verify Existing Dependencies**:
```bash
# Check date-fns is installed (for calendar calculations)
pnpm list date-fns  # Should show 3.x.x

# Check SWR is installed (for data fetching)
pnpm list swr  # Should show latest version
```

### 3. Development Server

```bash
# Start Next.js development server (if not already running)
pnpm dev

# Open browser
# Timeline: http://localhost:3000
# Calendar: http://localhost:3000/calendar (to be created)
```

### 4. Verify Existing Milestone Data

```bash
# Check if milestones exist in the database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Milestone\";"

# If no milestones, seed some test data
pnpm prisma db seed
```

## Project Structure

### Files to Create (New)

```
my_lover/
├── src/
│   ├── app/
│   │   └── calendar/                    # NEW: Calendar page route
│   │       ├── page.tsx                # Main calendar page
│   │       └── loading.tsx             # Loading skeleton
│   ├── components/
│   │   ├── ui/
│   │   │   └── Calendar.tsx            # NEW: Base calendar component (optional)
│   │   └── features/
│   │       └── CalendarView/           # NEW: Calendar feature components
│   │           ├── CalendarView.tsx          # Main container
│   │           ├── CalendarGrid.tsx          # Grid renderer
│   │           ├── CalendarHeader.tsx        # Navigation header
│   │           ├── CalendarDateCell.tsx      # Individual date cell
│   │           ├── MilestoneIndicator.tsx    # Milestone dots/badges
│   │           ├── MilestoneDetailModal.tsx  # Detail modal
│   │           └── CalendarEmpty.tsx         # Empty state
│   ├── hooks/
│   │   ├── useCalendar.ts              # NEW: Calendar state management
│   │   └── useMilestonesByMonth.ts     # NEW: Filter milestones by month
│   ├── lib/
│   │   └── calendarUtils.ts            # NEW: Calendar calculation utilities
│   └── types/
│       └── calendar.ts                 # NEW: Calendar TypeScript types
└── tests/
    ├── unit/
    │   ├── components/
    │   │   └── CalendarView/           # NEW: Component tests
    │   │       ├── CalendarGrid.test.tsx
    │   │       ├── CalendarDateCell.test.tsx
    │   │       └── MilestoneIndicator.test.tsx
    │   └── hooks/
    │       └── useCalendar.test.ts     # NEW: Hook tests
    └── e2e/
        └── calendar.spec.ts             # NEW: E2E tests
```

### Files to Reuse (Existing)

- `src/hooks/useMilestones.ts` - Fetch milestones via SWR
- `src/components/ui/Modal.tsx` - Modal for milestone details
- `src/components/ui/Button.tsx` - Navigation buttons
- `src/types/milestone.ts` - Milestone type definitions
- `src/app/api/milestones/route.ts` - API endpoint (no changes)

## Development Workflow

### Phase 1: Set Up Types and Utilities (Day 1)

**Goal**: Create foundational types and utility functions

```bash
# 1. Create calendar types
touch src/types/calendar.ts

# 2. Create calendar utilities
touch src/lib/calendarUtils.ts

# 3. Create custom hooks
touch src/hooks/useCalendar.ts
touch src/hooks/useMilestonesByMonth.ts
```

**Test Utilities**:
```bash
# Write unit tests for calendar utilities
touch tests/unit/lib/calendarUtils.test.ts

# Run tests
pnpm test calendarUtils
```

**Reference**: See `specs/002-milestone-calendar-view/data-model.md` for complete type definitions

### Phase 2: Build Core Components (Day 2-3)

**Goal**: Create calendar UI components

```bash
# 1. Create component directory
mkdir -p src/components/features/CalendarView

# 2. Create components (in dependency order)
touch src/components/features/CalendarView/CalendarEmpty.tsx         # No dependencies
touch src/components/features/CalendarView/MilestoneIndicator.tsx   # Milestone type only
touch src/components/features/CalendarView/CalendarDateCell.tsx     # Uses MilestoneIndicator
touch src/components/features/CalendarView/CalendarGrid.tsx         # Uses CalendarDateCell
touch src/components/features/CalendarView/CalendarHeader.tsx       # Independent
touch src/components/features/CalendarView/MilestoneDetailModal.tsx # Uses Modal (existing)
touch src/components/features/CalendarView/CalendarView.tsx         # Main container
```

**Development Workflow**:
1. Build bottom-up (leaf components first)
2. Test each component in isolation before composing
3. Use Storybook or component playground (optional)

**Component Testing**:
```bash
# Create test files
mkdir -p tests/unit/components/CalendarView
touch tests/unit/components/CalendarView/CalendarDateCell.test.tsx
touch tests/unit/components/CalendarView/MilestoneIndicator.test.tsx

# Run component tests
pnpm test CalendarView
```

### Phase 3: Create Calendar Page (Day 4)

**Goal**: Wire up components into the calendar page route

```bash
# 1. Create calendar page route
mkdir -p src/app/calendar
touch src/app/calendar/page.tsx
touch src/app/calendar/loading.tsx

# 2. Test in browser
# Navigate to http://localhost:3000/calendar
```

**Page Structure**:
```tsx
// src/app/calendar/page.tsx
'use client'

import { CalendarView } from '@/components/features/CalendarView/CalendarView'

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Milestones Calendar</h1>
      <CalendarView />
    </div>
  )
}
```

### Phase 4: Testing & Polish (Day 5)

**Goal**: Comprehensive testing and accessibility improvements

```bash
# 1. Write E2E tests
touch tests/e2e/calendar.spec.ts

# 2. Run full test suite
pnpm test            # Unit + integration tests
pnpm test:e2e        # Playwright E2E tests

# 3. Accessibility audit
pnpm lighthouse http://localhost:3000/calendar
```

**Testing Checklist**:
- [ ] Calendar grid renders correctly for all months
- [ ] Month navigation works (prev/next/today)
- [ ] Milestones appear on correct dates
- [ ] Multiple milestones on same date handled
- [ ] Click milestone opens detail modal
- [ ] Modal shows correct milestone data
- [ ] Empty state shown when no milestones
- [ ] Mobile responsive (320px-2560px)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Common Development Tasks

### Add Test Milestones

```typescript
// Add to prisma/seed.ts
const testMilestones = [
  { date: new Date('2025-03-15'), title: 'Test Milestone 1', description: 'Test' },
  { date: new Date('2025-03-15'), title: 'Test Milestone 2', description: 'Multiple on same date' },
  { date: new Date('2025-03-20'), title: 'Test Milestone 3', description: null },
]

await prisma.milestone.createMany({ data: testMilestones })
```

```bash
pnpm prisma db seed
```

### Debug Calendar Grid

```typescript
// Add to CalendarGrid.tsx for debugging
console.log('Calendar month:', month.year, month.month)
console.log('Weeks:', month.weeks.length)
console.log('Total dates:', month.weeks.flatMap(w => w.dates).length)
```

### Test Date Edge Cases

```bash
# February 2024 (leap year)
# Navigate to: /calendar?month=2024-02

# February 2025 (non-leap year)
# Navigate to: /calendar?month=2025-02

# Month with 6 weeks (check grid height)
# Navigate to: /calendar?month=2025-05
```

### Performance Profiling

```bash
# Check bundle size impact
pnpm build
pnpm analyze  # If webpack-bundle-analyzer is configured

# Lighthouse performance audit
pnpm lighthouse http://localhost:3000/calendar
```

## Troubleshooting

### Calendar Doesn't Render

**Problem**: Blank page at `/calendar`

**Solutions**:
1. Check browser console for errors
2. Verify `useCalendar` hook returns valid date
3. Ensure `generateCalendarMonth` returns weeks array
4. Check if `useMilestones` is fetching data

```bash
# Debug hook output
const { currentMonth } = useCalendar()
console.log('Current month:', currentMonth) // Should be Date object
```

### Milestones Not Appearing

**Problem**: Calendar renders but milestones don't show

**Solutions**:
1. Verify milestones exist in database
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM \"Milestone\" LIMIT 5;"
   ```
2. Check `useMilestones` hook returns data
   ```typescript
   console.log('Milestones:', milestones) // Should be array
   ```
3. Verify `useMilestonesByMonth` filters correctly
   ```typescript
   console.log('Month milestones:', monthMilestones) // Should be filtered
   ```

### Date Timezone Issues

**Problem**: Milestones appear on wrong dates

**Solutions**:
1. Ensure dates are compared in UTC
   ```typescript
   // Use date-fns with UTC or strip time component
   import { startOfDay } from 'date-fns'
   const date = startOfDay(new Date(milestone.date))
   ```
2. Check database stores dates as `@db.Date` (not `@db.Timestamp`)
3. Verify API returns dates in ISO format without time

### Mobile Layout Breaks

**Problem**: Calendar looks bad on mobile

**Solutions**:
1. Test at 320px width (smallest common mobile)
   ```bash
   # Chrome DevTools: Toggle device toolbar, select iPhone SE
   ```
2. Ensure CSS Grid uses `minmax(0, 1fr)` to prevent overflow
   ```css
   grid-template-columns: repeat(7, minmax(0, 1fr));
   ```
3. Check tap targets are at least 44x44px
   ```css
   min-height: 44px;
   min-width: 44px;
   ```

## Code Quality Checks

### Before Committing

```bash
# 1. Type check
pnpm tsc --noEmit

# 2. Lint
pnpm lint

# 3. Format
pnpm format

# 4. Run all tests
pnpm test
pnpm test:e2e

# 5. Build check
pnpm build
```

### Pre-PR Checklist

- [ ] All tests passing (unit + integration + e2e)
- [ ] Type checking passes with zero errors
- [ ] ESLint passes with zero errors
- [ ] Code formatted with Prettier
- [ ] Component tests cover key interactions
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Mobile responsive verified (320px-2560px)
- [ ] Performance budgets met (LCP < 2.5s, CLS < 0.1)
- [ ] No console errors or warnings
- [ ] Git commit messages follow convention

## Next Steps

1. **Review Artifacts**:
   - Read `specs/002-milestone-calendar-view/data-model.md` for types
   - Read `specs/002-milestone-calendar-view/research.md` for design decisions
   - Read `specs/002-milestone-calendar-view/contracts/api-reuse.md` for API usage

2. **Generate Tasks**:
   ```bash
   # Run tasks generation command (Phase 2)
   /speckit.tasks
   ```

3. **Follow Tasks**:
   - Open `specs/002-milestone-calendar-view/tasks.md`
   - Complete tasks in dependency order
   - Check off items as you progress

4. **Implementation**:
   - Start with Phase 1 tasks (types and utilities)
   - Progress to Phase 2 (components)
   - Finish with Phase 3 (page and testing)

## Helpful Resources

- **Date-fns Docs**: https://date-fns.org/docs/Getting-Started
- **Next.js App Router**: https://nextjs.org/docs/app
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro
- **Playwright**: https://playwright.dev/docs/intro
- **ARIA Grid Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- **Tailwind CSS Grid**: https://tailwindcss.com/docs/grid-template-columns

## Getting Help

- **Spec Questions**: Review `specs/002-milestone-calendar-view/spec.md`
- **Technical Questions**: Review research and data-model docs
- **Implementation Blockers**: Check troubleshooting section above
- **Design Decisions**: Refer to `research.md` rationale sections

---

**Quickstart Status**: ✅ Complete - Ready for implementation. Run `/speckit.tasks` to generate task list.
