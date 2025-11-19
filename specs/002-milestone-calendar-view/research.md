# Research: Milestone Calendar View

**Feature**: `002-milestone-calendar-view`
**Date**: 2025-11-19
**Status**: Phase 0 Complete

## Overview

This document captures technology decisions and research findings for implementing the Milestone Calendar View feature. The primary research question is determining the optimal approach for calendar rendering in a React/Next.js environment with mobile-first responsive design requirements.

## Key Research Questions

### 1. Calendar Library Choice

**Question**: Should we use a third-party calendar library (react-calendar, react-big-calendar) or build a custom calendar implementation using date-fns?

**Decision**: **Custom calendar implementation using date-fns**

**Rationale**:
- **Bundle size**: Third-party calendar libraries add significant bundle weight (react-calendar ~50KB, react-big-calendar ~100KB+). Custom implementation using date-fns (already in dependencies from feature 001) adds minimal overhead
- **Design control**: Custom implementation provides complete control over mobile-first responsive design, ensuring exact alignment with the design system and constitutional UI excellence requirements
- **Simplicity**: The feature only needs monthly grid view with basic navigation - no complex scheduling, drag-and-drop, or multi-view requirements that would justify a full calendar library
- **Accessibility**: Custom implementation allows precise WCAG 2.1 AA compliance tailored to our specific use case (keyboard navigation, screen readers, semantic HTML)
- **Performance**: Lighter weight implementation better meets performance budgets (LCP < 2.5s, bundle < 200KB)
- **Maintenance**: Fewer dependencies reduces long-term maintenance burden and upgrade complexity

**Alternatives Considered**:

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **react-calendar** | Mature, well-documented, customizable | 50KB bundle, limited mobile optimization, excessive features for our needs | ❌ Rejected - bundle overhead |
| **react-big-calendar** | Feature-rich, multiple views | 100KB+ bundle, designed for complex scheduling apps, overkill for milestone display | ❌ Rejected - complexity mismatch |
| **react-day-picker** | Lightweight (~20KB), flexible | Primarily date picker UI, would need significant customization for calendar grid | ❌ Rejected - not designed for our use case |
| **Custom with date-fns** | Full control, minimal bundle, matches design system, uses existing dependency | Requires implementation effort | ✅ **Selected** |

### 2. Calendar Rendering Pattern

**Question**: Should calendar be server-rendered (RSC) or client-rendered with state management?

**Decision**: **Client-rendered with local state management**

**Rationale**:
- **Interactivity requirements**: Calendar requires frequent client-side interactions (month navigation, hover states, modal opening) that are better suited to client components
- **State complexity**: Current month, selected date, modal open state are inherently client-side concerns
- **Performance**: Milestone data can still be fetched server-side via API routes, with SWR handling client-side caching
- **User experience**: Instant month navigation without full page reloads improves perceived performance
- **Progressive enhancement**: Initial calendar state can be derived from URL params, allowing bookmarkable months

**Implementation Approach**:
- Calendar UI components are client components (`'use client'`)
- Milestone data fetched via existing API routes using SWR
- URL state management for current month (e.g., `/calendar?month=2025-03`)
- React state for ephemeral UI (modal open, hover states)

### 3. Date Calculation and Utilities

**Question**: What utilities are needed for calendar calculations?

**Decision**: **Extend existing date-fns utilities with calendar-specific helpers**

**Rationale**:
- Feature 001 already uses date-fns 3.x for date formatting and calculations
- date-fns provides essential calendar utilities: `getDaysInMonth`, `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `format`, `parse`
- Reusing existing dependency maintains consistency and avoids bundle bloat
- Type-safe with TypeScript, tree-shakeable for optimal bundle size

**Required Utilities** (to be added in `src/lib/calendarUtils.ts`):
- `getMonthGrid(year, month)`: Generate array of dates for calendar grid (including padding from prev/next month)
- `getWeeksInMonth(year, month)`: Calculate number of weeks to display
- `getMilestonesByDate(milestones[], date)`: Filter milestones for specific date
- `isToday(date)`: Check if date is current day
- `isSameMonth(date1, date2)`: Compare months for styling current month dates

### 4. Responsive Grid Layout

**Question**: How should calendar grid adapt across screen sizes?

**Decision**: **CSS Grid with mobile-first breakpoints**

**Rationale**:
- **CSS Grid native support**: Excellent for 7-column weekly grids (Sunday-Saturday)
- **Mobile-first**: Base styles target 320px width, expand with Tailwind breakpoints
- **Performance**: CSS-based layout is hardware-accelerated, meets 60fps animation requirement
- **Accessibility**: Grid maintains semantic structure with proper ARIA labels

**Breakpoint Strategy**:
```css
/* Mobile (320px-640px): Compact grid, smaller text */
grid-template-columns: repeat(7, minmax(0, 1fr));
font-size: 0.75rem; /* 12px */
min-height: 48px; /* Ensure tap target */

/* Tablet (640px-1024px): Comfortable spacing */
grid-template-columns: repeat(7, minmax(0, 1fr));
font-size: 0.875rem; /* 14px */
min-height: 64px;

/* Desktop (1024px+): Full grid with hover states */
grid-template-columns: repeat(7, minmax(0, 1fr));
font-size: 1rem; /* 16px */
min-height: 80px;
```

### 5. Milestone Indicator Design

**Question**: How to display multiple milestones on a single date without overwhelming the UI?

**Decision**: **Dot indicators with count badge for overflow**

**Rationale**:
- **Scalability**: Handles edge case of multiple milestones per date (spec requirement: 50+ milestones/month)
- **Visual clarity**: Small colored dots don't clutter limited mobile space
- **Progressive disclosure**: Count badge ("+3") indicates more milestones without showing all
- **Accessibility**: Each dot has aria-label with milestone title

**Implementation Details**:
- Display up to 3 milestone dots per date cell
- If more than 3 milestones, show first 2 dots + "+N more" badge
- Click date cell opens modal with all milestones for that date
- Dot colors derived from Tailwind design system (primary, secondary, accent)

### 6. Modal Detail View

**Question**: What pattern should be used for displaying milestone details?

**Decision**: **Modal overlay with backdrop (existing Modal component)**

**Rationale**:
- **Consistency**: Reuse existing Modal component from feature 001 UI library
- **Mobile-friendly**: Modal provides focused view without navigation confusion
- **Accessibility**: Existing Modal already implements WCAG 2.1 AA (focus trap, ESC to close, aria-modal)
- **Performance**: Modal rendered only when opened, minimizing initial bundle

**Modal Behavior**:
- Click milestone indicator → open modal with milestone details
- Display title, date, description, image (if available)
- Include close button (X) and backdrop click to dismiss
- If multiple milestones on date, show list first, then drill down to individual milestone

## Technology Stack Summary

### Core Technologies (from Feature 001)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3+ (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4+
- **Date Utilities**: date-fns 3.x
- **Data Fetching**: SWR (client-side caching)
- **Testing**: Vitest (unit), React Testing Library (component), Playwright (e2e)

### New Dependencies (Feature 002)
- **None required** - all functionality achievable with existing stack

### Development Tools (Existing)
- **Type Checking**: tsc (TypeScript compiler)
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: pnpm

## Best Practices

### 1. Component Architecture
- **Atomic design**: Break calendar into smallest possible components (CalendarGrid, DateCell, MilestoneIndicator)
- **Single responsibility**: Each component handles one concern
- **Props over state**: Pass data down, keep state management centralized in parent
- **Custom hooks**: Extract calendar state logic into `useCalendar` hook

### 2. Performance Optimization
- **Memoization**: Use `React.memo` for DateCell components (prevent re-renders during navigation)
- **Virtual scrolling**: Not needed for monthly view (max 42 date cells)
- **Image lazy loading**: Use Next.js Image component for milestone images in modal
- **Code splitting**: Dynamic import for MilestoneDetailModal (only load when needed)

### 3. Accessibility
- **Semantic HTML**: Use `<table>` or `<div role="grid">` for calendar structure
- **Keyboard navigation**: Arrow keys for date navigation, Enter to select
- **Screen readers**: Aria labels for dates, milestones, and navigation controls
- **Focus management**: Focus trap in modal, restore focus on close

### 4. Mobile-First Design
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Swipe gestures**: Consider swipe left/right for month navigation (optional enhancement)
- **Responsive text**: Use clamp() or Tailwind responsive classes for scalable typography
- **Loading states**: Skeleton UI for milestone data fetch

### 5. Testing Strategy
- **Unit tests**: Calendar calculation utilities (date grid generation, milestone filtering)
- **Component tests**: CalendarGrid rendering, DateCell interactions, navigation controls
- **Integration tests**: Milestone data loading, modal opening/closing
- **E2E tests**: Complete user journey (navigate months, click milestone, view details)

## Integration Points

### Existing API Endpoints (Reuse)
- `GET /api/milestones`: Fetch all milestones (already implemented in feature 001)
- Filter by date range on client-side using `useMilestonesByMonth` hook

### Existing Components (Reuse)
- `Modal` from `src/components/ui/Modal.tsx`: Detail view container
- `Button` from `src/components/ui/Button.tsx`: Navigation controls
- Milestone data types from `src/types/milestone.ts`

### New Components (Create)
- `CalendarView`: Main container
- `CalendarGrid`: Date grid renderer
- `CalendarHeader`: Month/year navigation
- `CalendarDateCell`: Individual date with milestone indicators
- `MilestoneIndicator`: Dot/badge UI
- `MilestoneDetailModal`: Detail view wrapper

### New Hooks (Create)
- `useCalendar`: State management (current month, navigation)
- `useMilestonesByMonth`: Filter milestones by currently displayed month

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Custom calendar has bugs in edge cases (leap years, timezone) | High | Medium | Comprehensive unit tests for date calculations, use battle-tested date-fns utilities |
| Performance degradation with 50+ milestones | Medium | Low | Memoization, limit visible indicators per cell, virtualization if needed |
| Mobile layout breaks on small screens | High | Low | Mobile-first CSS, test on 320px, 375px, 414px widths |
| Accessibility gaps in custom calendar | High | Low | Follow ARIA grid pattern, test with screen readers, keyboard-only navigation |

## Next Steps

1. **Phase 1: Design & Contracts** - Generate data-model.md (view state only, no DB changes), contracts (if API modifications needed), quickstart.md
2. **Phase 2: Tasks** - Break implementation into dependency-ordered tasks
3. **Implementation** - Follow tasks.md for step-by-step development

## References

- [date-fns documentation](https://date-fns.org/docs/Getting-Started)
- [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- Feature 001 plan: `specs/001-anniversary-calendar/plan.md`
- Feature 001 research: `specs/001-anniversary-calendar/research.md`

---

**Research Status**: ✅ Complete - All technical decisions finalized. Proceed to Phase 1 (Design & Contracts).
