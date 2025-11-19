# Implementation Plan: Milestone Calendar View

**Branch**: `002-milestone-calendar-view` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-milestone-calendar-view/spec.md`

## Summary

A calendar interface for visualizing relationship milestones in a monthly grid view. Users can navigate between months/years and click on milestones to view their full details (title, description, images). The calendar displays milestone indicators on appropriate dates, handles multiple milestones per day, and provides smooth navigation with a responsive design. Built as an addition to the existing Next.js 15 Anniversary Calendar application, reusing the established Milestone data model and API infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode), Node.js 20 LTS
**Primary Dependencies**: Next.js 15 (App Router), React 18, Tailwind CSS 3.4+, date-fns 3.x, SWR
**Storage**: PostgreSQL 15+ (via Prisma ORM) - reusing existing Milestone table, no new tables needed
**Testing**: Vitest (unit/integration), React Testing Library (component), Playwright (e2e), MSW (API mocking)
**Target Platform**: Web (mobile-first responsive, 320px+ width), Docker self-hosted deployment
**Project Type**: Web application (frontend feature addition to existing Next.js monorepo)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1, 60fps animations, < 1s month navigation, < 500ms milestone detail display
**Constraints**: WCAG 2.1 AA accessibility, 44x44px minimum tap targets, support iOS Safari + Android Chrome, reuse existing Milestone API endpoints
**Scale/Scope**: Display 50+ milestones per month without degradation, 12-month navigation range minimum, responsive 320px-2560px

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Planning Gate (Initial Assessment)

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Component-First Architecture** | ✅ PASS | Calendar grid, milestone indicators, month navigation, and detail modal designed as reusable React components |
| **II. Mobile-First & Responsive** | ✅ PASS | Explicit requirement in spec (FR-016), mobile-first calendar layout, responsive grid sizing (320px-2560px), 44x44px tap targets for navigation |
| **III. UI Excellence & Aesthetics** | ✅ PASS | Smooth month transitions, polished milestone indicators, accessible keyboard navigation, WCAG 2.1 AA compliance maintained |
| **IV. Code Quality & Maintainability** | ✅ PASS | TypeScript strict mode, date-fns for date calculations, custom hooks for calendar state, reuse existing API patterns |
| **V. Test Coverage** | ✅ PASS | Component tests (calendar rendering, navigation), integration tests (milestone loading), e2e tests (user journeys), performance budgets verified |

**Gate Status**: ✅ **PASSED** - All constitutional principles satisfied. Proceed to Phase 0 research.

### Post-Design Gate (After Phase 1)

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Component-First Architecture** | ✅ PASS | Data model defines clear component hierarchy (CalendarView → CalendarGrid → DateCell → MilestoneIndicator), custom hooks extract reusable logic |
| **II. Mobile-First & Responsive** | ✅ PASS | CSS Grid with mobile-first breakpoints defined, responsive typography (clamp/Tailwind classes), touch target minimums (44x44px) documented |
| **III. UI Excellence & Aesthetics** | ✅ PASS | ARIA grid pattern implementation specified, keyboard navigation documented, smooth animations planned (60fps requirement) |
| **IV. Code Quality & Maintainability** | ✅ PASS | TypeScript types comprehensive (calendar.ts), utility functions pure and testable (calendarUtils.ts), reuse existing patterns (SWR, Modal) |
| **V. Test Coverage** | ✅ PASS | Test strategy defined for utils/hooks/components/e2e, MSW mocks specified, performance budgets reaffirmed |

**Gate Status**: ✅ **PASSED** - Design artifacts maintain constitutional compliance. Proceed to Phase 2 tasks generation.

## Project Structure

### Documentation (this feature)

```text
specs/002-milestone-calendar-view/
├── spec.md              # Feature specification (user stories, requirements)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - calendar library and date handling decisions
├── data-model.md        # Phase 1 output - view state management (no new DB entities)
├── quickstart.md        # Phase 1 output - calendar feature development guide
├── contracts/           # Phase 1 output - API specifications (if new endpoints needed)
├── checklists/
│   └── requirements.md # Specification quality checklist (completed)
└── tasks.md             # Phase 2 output (NOT created yet - use /speckit.tasks)
```

### Source Code (repository root)

```text
my_lover/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── calendar/            # NEW: Calendar view page
│   │   │   ├── page.tsx        # Calendar page component
│   │   │   └── loading.tsx     # Loading skeleton for calendar
│   │   ├── page.tsx            # Existing: Timeline view (home)
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── api/                # Existing API routes
│   │       └── milestones/     # Reuse existing endpoints
│   ├── components/              # React components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx      # Existing
│   │   │   ├── Modal.tsx       # Existing
│   │   │   └── Calendar.tsx    # NEW: Base calendar grid component
│   │   └── features/           # Feature-specific components
│   │       ├── Timeline/       # Existing: Timeline feature
│   │       ├── MilestoneForm/  # Existing: Add/edit form
│   │       └── CalendarView/   # NEW: Calendar feature components
│   │           ├── CalendarView.tsx          # Main calendar container
│   │           ├── CalendarGrid.tsx          # Calendar grid with dates
│   │           ├── CalendarHeader.tsx        # Month/year navigation
│   │           ├── CalendarDateCell.tsx      # Individual date cell
│   │           ├── MilestoneIndicator.tsx    # Milestone marker in cell
│   │           ├── MilestoneDetailModal.tsx  # Detail view modal
│   │           └── CalendarEmpty.tsx         # Empty state
│   ├── hooks/                  # Custom React hooks
│   │   ├── useMilestones.ts   # Existing: SWR hook for milestone data
│   │   ├── useCalendar.ts     # NEW: Calendar state management
│   │   └── useMilestonesByMonth.ts # NEW: Filter milestones by month
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Existing: Prisma client
│   │   ├── validation.ts      # Existing: Zod schemas
│   │   ├── dateUtils.ts       # Existing: date-fns wrappers
│   │   └── calendarUtils.ts   # NEW: Calendar calculations (days in month, etc.)
│   ├── styles/                # Design tokens
│   │   └── theme.ts           # Existing: Tailwind theme
│   └── types/                 # TypeScript types
│       ├── milestone.ts       # Existing: Milestone types
│       └── calendar.ts        # NEW: Calendar view types
├── prisma/
│   └── schema.prisma          # Existing: Milestone table (no changes)
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   └── CalendarView/  # NEW: Calendar component tests
│   │   └── hooks/
│   │       └── useCalendar.test.ts # NEW: Calendar hook tests
│   ├── integration/
│   │   └── api/
│   │       └── milestones.test.ts # Existing: API tests (reuse)
│   └── e2e/
│       ├── timeline.spec.ts   # Existing
│       └── calendar.spec.ts   # NEW: Calendar navigation and interaction
├── public/                    # Static assets (no changes)
├── package.json              # Existing (may add calendar deps)
├── next.config.mjs           # Existing
├── tailwind.config.ts        # Existing (may extend with calendar styles)
└── tsconfig.json             # Existing
```

**Structure Decision**: Calendar view is a new feature route at `/calendar` within the existing Next.js App Router structure. Components follow the established pattern with `/ui` for base components and `/features/CalendarView` for calendar-specific components. The feature reuses the existing Milestone data model and API infrastructure, requiring no backend changes. This aligns with the project type "web application" and maintains consistency with feature 001's architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitutional principles are satisfied by the planned architecture. The design follows mobile-first principles, implements component-first architecture, ensures code quality with TypeScript strict mode, maintains comprehensive test coverage, and prioritizes UI excellence with accessibility standards.

---

## Planning Phases Summary

### Phase 0: Outline & Research ✅ COMPLETED
- **Output**: `research.md`
- **Status**: All technology decisions finalized
- **Key Decisions**:
  - Custom calendar implementation with date-fns (no third-party library)
  - Client-rendered calendar with local state management
  - CSS Grid with mobile-first breakpoints
  - Dot indicators with count badge for milestone overflow
  - Modal overlay for detail view (reuse existing Modal component)
  - No new dependencies required

### Phase 1: Design & Contracts ✅ COMPLETED
- **Outputs**: `data-model.md`, `contracts/api-reuse.md`, `quickstart.md`
- **Status**: All design artifacts generated
- **Artifacts Created**:
  - TypeScript types for calendar view state (CalendarDate, CalendarWeek, CalendarMonth)
  - Custom hooks specifications (useCalendar, useMilestonesByMonth)
  - Calendar utility functions (generateCalendarMonth, getMilestonesForDate)
  - API reuse documentation (existing /api/milestones endpoint)
  - Component hierarchy defined (7 new components)
  - Test strategy documented (unit/component/integration/e2e)
  - Agent context updated (CLAUDE.md)

### Phase 2: Tasks Generation ⏳ PENDING
- **Output**: `tasks.md`
- **Status**: Ready to execute
- **Next Command**: `/speckit.tasks`

---

## Next Steps

The planning phase is complete. All design artifacts have been generated and validated against the constitution. To proceed with implementation:

1. **Run**: `/speckit.tasks` to generate the implementation task list
2. **Review**: `tasks.md` for detailed implementation steps
3. **Execute**: Follow tasks in dependency order
4. **Test**: Verify each task against acceptance criteria

**Branch**: `002-milestone-calendar-view`
**Plan Path**: `D:\Code\my_lover\specs\002-milestone-calendar-view\plan.md`
**Generated Artifacts**:
- ✅ `spec.md` - Feature specification (user stories, requirements)
- ✅ `research.md` - Technology stack and design decisions
- ✅ `data-model.md` - View state types and utility functions
- ✅ `contracts/api-reuse.md` - API endpoint reuse documentation
- ✅ `quickstart.md` - Development setup guide
- ✅ `checklists/requirements.md` - Specification quality checklist (passed)
- ⏳ `tasks.md` - Awaiting `/speckit.tasks` command
