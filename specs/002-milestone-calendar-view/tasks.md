# Tasks: Milestone Calendar View

**Input**: Design documents from `/specs/002-milestone-calendar-view/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included based on the test strategy defined in data-model.md. Unit tests for utilities and hooks, component tests for React components, and E2E tests for complete user journeys.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Following Next.js App Router structure from plan.md:
- **App routes**: `src/app/calendar/`
- **Components**: `src/components/ui/` and `src/components/features/CalendarView/`
- **Hooks**: `src/hooks/`
- **Utilities**: `src/lib/`
- **Types**: `src/types/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure initialization for calendar feature

- [x] T001 Create calendar feature directory structure (app/calendar, components/features/CalendarView)
- [x] T002 [P] Create TypeScript type definitions file at src/types/calendar.ts per data-model.md
- [x] T003 [P] Create calendar utilities file at src/lib/calendarUtils.ts (empty, will implement in US1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Verify existing useMilestones hook at src/hooks/useMilestones.ts is accessible (from feature 001)
- [x] T005 [P] Verify existing Modal component at src/components/ui/Modal.tsx is accessible (from feature 001)
- [x] T006 [P] Verify existing Button component at src/components/ui/Button.tsx is accessible (from feature 001)
- [x] T007 Verify existing Milestone type at src/types/milestone.ts is accessible (from feature 001)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View All Milestones in Calendar Format (Priority: P1) 🎯 MVP

**Goal**: Display milestones in a monthly calendar grid with indicators on appropriate dates

**Independent Test**: Navigate to `/calendar`, verify calendar renders with current month, verify existing milestones appear on their correct dates with visual indicators

### Implementation for User Story 1

#### Utilities and Hooks (Can run in parallel)

- [x] T008 [P] [US1] Implement generateCalendarMonth() in src/lib/calendarUtils.ts per data-model.md
- [x] T009 [P] [US1] Implement getMilestonesForDate() in src/lib/calendarUtils.ts per data-model.md
- [x] T010 [P] [US1] Implement formatDateForAria() in src/lib/calendarUtils.ts per data-model.md
- [x] T011 [P] [US1] Implement useMilestonesByMonth hook at src/hooks/useMilestonesByMonth.ts per data-model.md
- [x] T012 [P] [US1] Implement useCalendar hook (state management only) at src/hooks/useCalendar.ts per data-model.md

#### Unit Tests for Utilities and Hooks

- [ ] T013 [P] [US1] Write unit tests for generateCalendarMonth() at tests/unit/lib/calendarUtils.test.ts
- [ ] T014 [P] [US1] Write unit tests for getMilestonesForDate() at tests/unit/lib/calendarUtils.test.ts
- [ ] T015 [P] [US1] Write unit tests for useCalendar hook at tests/unit/hooks/useCalendar.test.ts
- [ ] T016 [P] [US1] Write unit tests for useMilestonesByMonth hook at tests/unit/hooks/useMilestonesByMonth.test.ts

#### Base Components (Can run in parallel after utilities)

- [x] T017 [P] [US1] Create MilestoneIndicator component at src/components/features/CalendarView/MilestoneIndicator.tsx per data-model.md
- [x] T018 [P] [US1] Create CalendarEmpty component at src/components/features/CalendarView/CalendarEmpty.tsx per data-model.md

#### Calendar Grid Components (Sequential dependencies)

- [x] T019 [US1] Create CalendarDateCell component at src/components/features/CalendarView/CalendarDateCell.tsx (depends on T017 MilestoneIndicator)
- [x] T020 [US1] Create CalendarGrid component at src/components/features/CalendarView/CalendarGrid.tsx (depends on T019 DateCell, T018 Empty)

#### Component Tests for User Story 1

- [ ] T021 [P] [US1] Write component tests for MilestoneIndicator at tests/unit/components/CalendarView/MilestoneIndicator.test.tsx
- [ ] T022 [P] [US1] Write component tests for CalendarDateCell at tests/unit/components/CalendarView/CalendarDateCell.test.tsx
- [ ] T023 [P] [US1] Write component tests for CalendarGrid at tests/unit/components/CalendarView/CalendarGrid.test.tsx

#### Container Component

- [x] T024 [US1] Create CalendarView container component at src/components/features/CalendarView/CalendarView.tsx (depends on T020 Grid, integrates hooks)

#### Calendar Page Route

- [x] T025 [US1] Create calendar page at src/app/calendar/page.tsx using CalendarView component
- [x] T026 [P] [US1] Create loading skeleton at src/app/calendar/loading.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - calendar displays milestones, but no navigation or detail views yet

---

## Phase 4: User Story 2 - Navigate Between Calendar Time Periods (Priority: P2)

**Goal**: Enable month/year navigation with prev/next buttons, year selector, and "today" button

**Independent Test**: Click previous month button, verify calendar updates to show previous month's milestones. Click next month, verify forward navigation. Click today button, verify returns to current month.

### Implementation for User Story 2

#### Navigation Component

- [x] T027 [US2] Create CalendarHeader component at src/components/features/CalendarView/CalendarHeader.tsx with navigation controls per data-model.md

#### Component Tests for User Story 2

- [ ] T028 [P] [US2] Write component tests for CalendarHeader at tests/unit/components/CalendarView/CalendarHeader.test.tsx

#### Integration with Container

- [x] T029 [US2] Update CalendarView component at src/components/features/CalendarView/CalendarView.tsx to integrate CalendarHeader
- [x] T030 [US2] Add CSS transitions for smooth month changes (if using Tailwind animations)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - calendar displays and navigates

---

## Phase 5: User Story 3 - View Milestone Details from Calendar (Priority: P1)

**Goal**: Click milestone indicators to open modal with full details (title, date, description, image)

**Independent Test**: Click on a milestone indicator in calendar, verify modal opens with correct milestone details. Click close button or backdrop, verify modal closes and calendar remains visible.

### Implementation for User Story 3

#### Detail Modal Component

- [x] T031 [US3] Create MilestoneDetailModal component at src/components/features/CalendarView/MilestoneDetailModal.tsx reusing existing Modal component per data-model.md

#### Component Tests for User Story 3

- [ ] T032 [P] [US3] Write component tests for MilestoneDetailModal at tests/unit/components/CalendarView/MilestoneDetailModal.test.tsx

#### Integration with Calendar

- [x] T033 [US3] Update CalendarView component at src/components/features/CalendarView/CalendarView.tsx to add modal state management
- [x] T034 [US3] Update CalendarDateCell component at src/components/features/CalendarView/CalendarDateCell.tsx to trigger modal on click
- [x] T035 [US3] Handle multiple milestones on same date (show list in modal, then drill down)

**Checkpoint**: All user stories should now be independently functional - complete calendar experience

---

## Phase 6: End-to-End Testing

**Purpose**: Validate complete user journeys across all three stories

- [ ] T036 [P] Write E2E test for User Story 1 (calendar display) at tests/e2e/calendar.spec.ts
- [ ] T037 [P] Write E2E test for User Story 2 (month navigation) at tests/e2e/calendar.spec.ts
- [ ] T038 [P] Write E2E test for User Story 3 (milestone detail modal) at tests/e2e/calendar.spec.ts
- [ ] T039 Run complete E2E test suite with pnpm test:e2e

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Add responsive breakpoint styles for mobile (320px), tablet (640px), desktop (1024px+) to calendar components
- [x] T041 [P] Implement keyboard navigation (arrow keys for dates, Enter to select) per data-model.md accessibility section
- [x] T042 [P] Add ARIA labels and roles for screen reader support per data-model.md
- [x] T043 [P] Optimize performance with React.memo for CalendarDateCell component per research.md
- [ ] T044 [P] Add loading skeleton states for milestone data fetching
- [ ] T045 Verify performance budgets: LCP < 2.5s, FID < 100ms, CLS < 0.1 per plan.md
- [ ] T046 Run accessibility audit with Lighthouse, ensure WCAG 2.1 AA compliance
- [x] T047 [P] Update navigation (add link to calendar in main layout if not already present)
- [ ] T048 Manual testing: Verify on iOS Safari and Android Chrome per plan.md constraints
- [ ] T049 [P] Code cleanup: Remove console.logs, add JSDoc comments to complex functions
- [ ] T050 Validate against quickstart.md test scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start immediately after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Independent but enhances US1
  - User Story 3 (P1): Can start after Foundational - Independent but completes US1 experience
- **E2E Testing (Phase 6)**: Depends on US1, US2, US3 completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core calendar display, no dependencies
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Navigation is independent of display
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Modal is independent, clicks calendar dates

**Note**: While US2 and US3 enhance US1, they are designed to be independently testable. US1 delivers a working calendar (static month), US2 adds navigation, US3 adds details.

### Within Each User Story

**User Story 1**:
1. Utilities and hooks first (T008-T012 in parallel)
2. Unit tests for utilities (T013-T016 in parallel)
3. Base components (T017-T018 in parallel)
4. CalendarDateCell (T019, depends on T017)
5. CalendarGrid (T020, depends on T019, T018)
6. Component tests (T021-T023 in parallel)
7. CalendarView container (T024, integrates all)
8. Page route (T025-T026)

**User Story 2**:
1. CalendarHeader component (T027)
2. Component tests (T028)
3. Integration with CalendarView (T029-T030)

**User Story 3**:
1. MilestoneDetailModal component (T031)
2. Component tests (T032)
3. Integration with CalendarView and DateCell (T033-T035)

### Parallel Opportunities

- **Setup Phase**: T002 and T003 can run in parallel
- **Foundational Phase**: T005, T006, T007 can run in parallel (independent verifications)
- **User Story 1 - Utilities**: T008-T012 can all run in parallel (different files)
- **User Story 1 - Unit Tests**: T013-T016 can all run in parallel
- **User Story 1 - Base Components**: T017-T018 can run in parallel
- **User Story 1 - Component Tests**: T021-T023 can all run in parallel
- **User Story 1 - Page Files**: T026 can be created in parallel with T025
- **E2E Tests**: T036-T038 can be written in parallel
- **Polish Phase**: Most tasks (T040-T044, T047, T049) can run in parallel
- **Between User Stories**: After Foundational, US1, US2, US3 can be worked on in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch all utility implementations together:
Task: "Implement generateCalendarMonth() in src/lib/calendarUtils.ts"
Task: "Implement getMilestonesForDate() in src/lib/calendarUtils.ts"
Task: "Implement formatDateForAria() in src/lib/calendarUtils.ts"
Task: "Implement useMilestonesByMonth hook at src/hooks/useMilestonesByMonth.ts"
Task: "Implement useCalendar hook at src/hooks/useCalendar.ts"

# Launch all unit tests together:
Task: "Write unit tests for generateCalendarMonth() at tests/unit/lib/calendarUtils.test.ts"
Task: "Write unit tests for getMilestonesForDate() at tests/unit/lib/calendarUtils.test.ts"
Task: "Write unit tests for useCalendar hook at tests/unit/hooks/useCalendar.test.ts"
Task: "Write unit tests for useMilestonesByMonth hook at tests/unit/hooks/useMilestonesByMonth.test.ts"

# Launch base components together (after utilities):
Task: "Create MilestoneIndicator component at src/components/features/CalendarView/MilestoneIndicator.tsx"
Task: "Create CalendarEmpty component at src/components/features/CalendarView/CalendarEmpty.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (4 verifications)
3. Complete Phase 3: User Story 1 (19 tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Navigate to /calendar
   - Verify calendar renders current month
   - Verify milestones appear on correct dates
   - Verify empty state if no milestones
5. Deploy/demo static calendar (no navigation, no details yet)

**MVP Delivers**: A working calendar that shows milestones visually - immediate value for users

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (7 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - static calendar with milestones)
3. Add User Story 2 → Test independently → Deploy/Demo (calendar + navigation)
4. Add User Story 3 → Test independently → Deploy/Demo (full calendar experience with details)
5. Add E2E Testing → Validate all journeys (Phase 6)
6. Add Polish → Accessibility, performance, responsive (Phase 7)

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (7 tasks)
2. Once Foundational is done:
   - Developer A: User Story 1 (T008-T026) - Core calendar
   - Developer B: User Story 2 (T027-T030) - Navigation (can start with header, integrate later)
   - Developer C: User Story 3 (T031-T035) - Details modal (can start independently, integrate later)
3. After individual completion, integrate and test together
4. Team completes E2E Testing (Phase 6) together
5. Team completes Polish (Phase 7) - can parallelize most tasks

---

## Task Counts

**Total Tasks**: 50

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (User Story 1 - P1): 19 tasks
- Phase 4 (User Story 2 - P2): 4 tasks
- Phase 5 (User Story 3 - P1): 5 tasks
- Phase 6 (E2E Testing): 4 tasks
- Phase 7 (Polish): 11 tasks

**By User Story**:
- User Story 1 (View milestones): 19 tasks
- User Story 2 (Navigate months): 4 tasks
- User Story 3 (View details): 5 tasks
- Infrastructure/Polish: 22 tasks

**Parallelizable Tasks**: 30 tasks marked with [P]

---

## Notes

- [P] tasks = different files, no dependencies - can be executed concurrently
- [US1], [US2], [US3] labels map tasks to specific user stories for traceability
- Each user story is independently completable and testable
- Tests are included per data-model.md test strategy
- Stop at any checkpoint to validate story independently
- File paths follow Next.js App Router structure from plan.md
- All components follow component-first architecture per constitution
- Mobile-first approach throughout per constitution
- WCAG 2.1 AA compliance required per constitution
