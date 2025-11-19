# Tasks: Anniversary Calendar

**Input**: Design documents from `/specs/001-anniversary-calendar/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-spec.yaml, quickstart.md
**User Request**: 开始开发我的情人纪念网站 (Start developing my anniversary calendar website)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js monorepo web application:
- **App Router**: `src/app/` (pages, API routes, layouts)
- **Components**: `src/components/` (ui/ and features/)
- **Utilities**: `src/lib/`, `src/hooks/`, `src/types/`
- **Database**: `prisma/` (schema, migrations, seed)
- **Tests**: `tests/` (unit/, integration/, e2e/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Next.js configuration

- [X] T001 Initialize Next.js 15 project with TypeScript, pnpm, and App Router in project root
- [X] T002 [P] Configure Tailwind CSS with romantic color palette in tailwind.config.ts
- [X] T003 [P] Setup ESLint and Prettier with strict TypeScript rules in .eslintrc.json and .prettierrc
- [X] T004 [P] Configure next.config.mjs for standalone output (Docker) and image optimization
- [X] T005 [P] Create TypeScript configuration with strict mode in tsconfig.json
- [X] T006 [P] Setup Vitest configuration in vitest.config.ts for unit/integration tests
- [X] T007 [P] Setup Playwright configuration in playwright.config.ts for e2e tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Initialize Prisma with PostgreSQL provider in prisma/schema.prisma
- [X] T009 Create Milestone schema in prisma/schema.prisma (id, date, title, description, imageUrl, imageWidth, imageHeight, createdAt, updatedAt)
- [ ] T010 Run initial Prisma migration to create milestones table
- [X] T011 Create Prisma client singleton in src/lib/prisma.ts
- [X] T012 [P] Create Zod validation schemas in src/lib/validation.ts (milestoneSchema, milestoneUpdateSchema)
- [X] T013 [P] Create TypeScript types in src/types/milestone.ts (Milestone, MilestoneInput, MilestoneUpdate)
- [X] T014 [P] Create API response types in src/types/api.ts (ApiResponse, ApiError, PaginatedResponse)
- [X] T015 [P] Setup date-fns utilities with Chinese locale in src/lib/dateUtils.ts (formatDistance, differenceInDays, format)
- [X] T016 [P] Create image optimization utilities with sharp in src/lib/imageOptimization.ts (optimizeImage, getImageDimensions)
- [X] T017 [P] Setup global error handling in src/app/error.tsx (error boundary component)
- [X] T018 [P] Create API health check endpoint in src/app/api/health/route.ts
- [X] T019 [P] Create base UI components directory structure: src/components/ui/ (Button, Input, Modal, Card, Loading)
- [X] T020 [P] Create development seed data in prisma/seed.ts (3-5 sample milestones with Chinese text)
- [X] T021 Setup SWR configuration provider in src/app/layout.tsx (SWRConfig with default fetcher)
- [X] T022 [P] Create global CSS with Tailwind imports in src/app/globals.css
- [X] T023 [P] Setup environment variables validation in src/lib/env.ts (DATABASE_URL, NODE_ENV)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Milestone Timeline (Priority: P1) 🎯 MVP

**Goal**: Users can see a beautiful visual timeline of all milestones, sorted chronologically with dates, titles, descriptions, and photos

**Independent Test**: Add 3-5 sample milestones via seed data, open http://localhost:3000, verify timeline displays all milestones sorted by date descending (most recent first), verify responsive layout on mobile (320px width), verify photos display correctly with aspect ratios preserved

### Implementation for User Story 1

- [X] T024 [P] [US1] Implement GET /api/milestones endpoint in src/app/api/milestones/route.ts (fetch all, pagination support, date DESC sorting)
- [X] T025 [P] [US1] Create useMilestones custom hook in src/hooks/useMilestones.ts (SWR hook for fetching milestones)
- [X] T026 [P] [US1] Create useTimeCalculation custom hook in src/hooks/useTimeCalculation.ts (calculate "X年Y个月前" format)
- [X] T027 [P] [US1] Create Card base component in src/components/ui/Card.tsx (reusable card with Tailwind styling)
- [X] T028 [P] [US1] Create Loading skeleton component in src/components/ui/Loading.tsx (for loading states)
- [X] T029 [US1] Create MilestoneCard component in src/components/features/Timeline/MilestoneCard.tsx (displays single milestone with photo, title, description, time calculation)
- [X] T030 [US1] Create TimelineEmpty component in src/components/features/Timeline/TimelineEmpty.tsx (engaging empty state guiding users to add first milestone)
- [X] T031 [US1] Create Timeline container component in src/components/features/Timeline/Timeline.tsx (fetches data with useMilestones, renders MilestoneCard list, handles loading/error states)
- [X] T032 [US1] Implement home page in src/app/page.tsx (renders Timeline component, mobile-first responsive layout)
- [X] T033 [US1] Add responsive breakpoints for mobile/tablet/desktop in Timeline component (320px, 768px, 1024px)
- [X] T034 [US1] Implement image optimization with next/image in MilestoneCard (automatic WebP/AVIF, responsive sizes, lazy loading)
- [X] T035 [US1] Style Timeline with Tailwind CSS (romantic color palette, smooth animations, 60fps scroll performance)
- [X] T036 [US1] Add ARIA labels and semantic HTML for WCAG 2.1 AA compliance (article tags, time elements, alt text)
- [ ] T037 [US1] Test timeline on mobile devices (iOS Safari, Android Chrome) and verify 44x44px tap targets

**Checkpoint**: At this point, User Story 1 should be fully functional - timeline displays milestones beautifully, is fully responsive, and accessible

---

## Phase 4: User Story 2 - Add and Edit Milestones (Priority: P2)

**Goal**: Users can create new milestones and edit existing ones with dates, titles, descriptions, and photo uploads

**Independent Test**: Click "Add Milestone" button, fill in date/title/description, upload photo, save and verify it appears in timeline at correct chronological position. Click "Edit" on existing milestone, modify fields, save and verify changes persist and timeline updates correctly

### Implementation for User Story 2

- [X] T038 [P] [US2] Implement POST /api/milestones endpoint in src/app/api/milestones/route.ts (create milestone with validation)
- [X] T039 [P] [US2] Implement GET /api/milestones/[id]/route.ts endpoint (fetch single milestone for editing)
- [X] T040 [P] [US2] Implement PUT /api/milestones/[id]/route.ts endpoint (update milestone, partial updates supported)
- [X] T041 [P] [US2] Implement DELETE /api/milestones/[id]/route.ts endpoint (delete milestone with confirmation, cascade delete image)
- [X] T042 [P] [US2] Implement POST /api/upload endpoint in src/app/api/upload/route.ts (handle multipart/form-data, optimize with sharp, save to public/uploads/, return URL and dimensions)
- [X] T043 [P] [US2] Create Button base component in src/components/ui/Button.tsx (primary, secondary, danger variants, loading states, accessible)
- [X] T044 [P] [US2] Create Input base component in src/components/ui/Input.tsx (text input with validation errors, Chinese labels)
- [X] T045 [P] [US2] Create Modal base component in src/components/ui/Modal.tsx (overlay, close button, trap focus, ESC key support)
- [X] T046 [P] [US2] Create useImageUpload custom hook in src/hooks/useImageUpload.ts (handle file validation, upload progress, error handling)
- [X] T047 [US2] Create DatePicker component in src/components/ui/DatePicker.tsx (HTML5 date input, mobile-friendly, Chinese locale)
- [X] T048 [US2] Create ImageUpload component in src/components/ui/ImageUpload.tsx (drag-and-drop, preview, file size validation <10MB, formats: JPEG/PNG/WebP)
- [X] T049 [US2] Create MilestoneForm component in src/components/features/MilestoneForm.tsx (React Hook Form + Zod validation, create/edit modes, optimistic UI updates)
- [X] T050 [US2] Add "Add Milestone" floating action button in src/app/page.tsx (opens Modal with MilestoneForm in create mode)
- [X] T051 [US2] Add "Edit" button to MilestoneCard component (opens Modal with MilestoneForm in edit mode, pre-filled with existing data)
- [X] T052 [US2] Add "Delete" button to MilestoneCard component (shows confirmation Modal, calls DELETE endpoint, optimistic UI update)
- [X] T053 [US2] Implement optimistic updates in useMilestones hook (SWR mutate for instant UI feedback)
- [X] T054 [US2] Add form validation with Chinese error messages (date required, title 1-200 chars, description max 2000 chars)
- [X] T055 [US2] Style MilestoneForm with Tailwind CSS (mobile-first, touch-friendly inputs, clear visual feedback)
- [X] T056 [US2] Add loading states during form submission (disable button, show spinner, prevent double-submit)
- [ ] T057 [US2] Test photo upload on mobile devices (camera capture, gallery selection, file size validation)
- [ ] T058 [US2] Verify milestone CRUD operations work correctly (create, read, update, delete all functional)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can view timeline AND manage milestones

---

## Phase 5: User Story 3 - Upcoming Anniversary Reminders (Priority: P3)

**Goal**: Users see upcoming anniversaries and milestones approaching within next 30 days, with countdown information

**Independent Test**: Set milestone dates to be within next 30 days (e.g., today + 5 days, today + 15 days), verify "Upcoming" section displays these milestones with "X天后" countdown, verify milestones sorted by date ascending (soonest first)

### Implementation for User Story 3

- [X] T059 [P] [US3] Implement GET /api/milestones/upcoming endpoint in src/app/api/milestones/upcoming/route.ts (filter milestones with anniversaries in next 30 days, calculate daysUntil)
- [X] T060 [P] [US3] Create useUpcomingMilestones custom hook in src/hooks/useUpcomingMilestones.ts (SWR hook for upcoming data)
- [X] T061 [US3] Create UpcomingList component in src/components/features/UpcomingAnniversaries/UpcomingList.tsx (displays upcoming milestones with countdown badges, special "Today" indicator)
- [X] T062 [US3] Add "Upcoming Anniversaries" section to home page in src/app/page.tsx (above or beside Timeline, collapsible on mobile)
- [X] T063 [US3] Style UpcomingList with Tailwind CSS (badge components for countdown, highlight today's anniversaries with special color)
- [X] T064 [US3] Add empty state for UpcomingList (shows when no anniversaries in next 30 days)
- [X] T065 [US3] Add visual emphasis for today's anniversaries (celebration icon, animated badge, prominent styling)
- [ ] T066 [US3] Test upcoming anniversaries calculation accuracy (verify dates, countdown days, sorting order)

**Checkpoint**: All P1-P3 user stories should now be independently functional - view timeline, manage milestones, see upcoming anniversaries

---

## Phase 6: User Story 4 - Calculate Time Since Milestones (Priority: P4)

**Goal**: Each milestone displays human-readable time duration (e.g., "2年3个月前"), with special highlight for first milestone showing total time together

**Independent Test**: Verify each milestone in timeline shows accurate "X年Y个月前" text based on current date. Verify first milestone (earliest date) has special highlight showing "在一起X年Y个月" total duration

### Implementation for User Story 4

- [X] T067 [US4] Enhance useTimeCalculation hook in src/hooks/useTimeCalculation.ts (add calculateTotalTimeTogether function for first milestone)
- [X] T068 [US4] Update MilestoneCard component to display time duration using useTimeCalculation hook (integrate date-fns formatDistance with Chinese locale)
- [X] T069 [US4] Add special styling for first milestone in Timeline component (highlight border, "Together Since" badge, prominent total time display)
- [ ] T070 [US4] Ensure time calculations update automatically when date changes (useEffect with current date dependency)
- [ ] T071 [US4] Test time calculation accuracy (verify durations match actual time elapsed, test edge cases like leap years)
- [ ] T072 [US4] Verify Chinese localization for time strings (e.g., "3年2个月15天前", "1年前", "5天前")

**Checkpoint**: All user stories (P1-P4) should now be fully functional and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [X] T073 [P] Add loading.tsx files for streaming support in src/app/ (skeleton screens for better perceived performance)
- [ ] T074 [P] Implement error boundaries for each major feature (Timeline, MilestoneForm, UpcomingList)
- [ ] T075 [P] Add toast notifications for user actions (success/error messages using react-hot-toast or similar)
- [ ] T076 [P] Optimize bundle size (analyze with @next/bundle-analyzer, ensure <200KB gzipped)
- [ ] T077 [P] Run Lighthouse audit and ensure scores ≥90 (performance, accessibility, best practices)
- [ ] T078 [P] Verify Core Web Vitals targets met (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] T079 [P] Test full application on mobile devices (iOS Safari, Android Chrome at 320px width)
- [ ] T080 [P] Run axe DevTools accessibility audit and fix any issues (WCAG 2.1 AA compliance)
- [X] T081 [P] Add meta tags for SEO in src/app/layout.tsx (title, description, OpenGraph tags)
- [ ] T082 [P] Setup Docker Compose and test full deployment (docker-compose up -d --build, run migrations)
- [X] T083 [P] Create production .env.example file with secure password generation instructions
- [ ] T084 [P] Test database migrations and seed data (pnpm prisma migrate deploy, pnpm prisma db seed)
- [X] T085 [P] Add comprehensive README.md with setup instructions (refer to quickstart.md)
- [ ] T086 [P] Run all tests (unit, integration, e2e if implemented) and ensure passing
- [ ] T087 Perform end-to-end user journey test (empty state → add milestone → view timeline → edit → delete → upcoming anniversaries)
- [ ] T088 Setup CI/CD pipeline (optional but recommended) for automated testing and deployment
- [ ] T089 Create backup and restore scripts as documented in quickstart.md
- [ ] T090 Final code review and refactoring pass (remove console.logs, fix TODOs, improve error messages)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - Integrates with US1 but independently testable
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion - Independent from US1/US2
- **User Story 4 (Phase 6)**: Depends on US1 completion (extends Timeline display) - Lightweight enhancement
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ **MVP SCOPE**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Works with US1 components but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Completely independent, can be implemented in parallel with US1/US2
- **User Story 4 (P4)**: Depends on US1 completion - Enhances existing Timeline, minimal additional work

### Within Each User Story

**User Story 1 (View Timeline)**:
1. API endpoint (T024) + Custom hooks (T025, T026) → Can run in parallel
2. UI base components (T027, T028) → Can run in parallel
3. Feature components (T029, T030) → Depend on base components
4. Timeline container (T031) → Depends on MilestoneCard and useMilestones
5. Page integration (T032) → Depends on Timeline
6. Polish (T033-T037) → Sequential refinements

**User Story 2 (Add/Edit Milestones)**:
1. All API endpoints (T038-T042) → Can run in parallel
2. All UI base components (T043-T045) → Can run in parallel
3. All custom hooks (T046) → Can run in parallel with base components
4. Form components (T047-T049) → Depend on base components and hooks
5. Integration with Timeline (T050-T052) → Depends on MilestoneForm
6. Optimistic updates and polish (T053-T058) → Sequential refinements

**User Story 3 (Upcoming Anniversaries)**:
1. API endpoint (T059) + Custom hook (T060) → Can run in parallel
2. UpcomingList component (T061) → Depends on hook
3. Page integration (T062-T066) → Sequential implementation and testing

**User Story 4 (Time Calculations)**:
1. Hook enhancement (T067) → Independent
2. Component updates (T068-T069) → Depends on hook
3. Testing and polish (T070-T072) → Sequential verification

### Parallel Opportunities

**Phase 1 (Setup)**: ALL tasks T001-T007 can run in parallel (different config files)

**Phase 2 (Foundational)**:
- T009 must complete before T010 (migration)
- T008, T012-T023 can run in parallel (independent files)

**Phase 3 (User Story 1)**:
- Parallel batch 1: T024, T025, T026, T027, T028 (API + hooks + base components)
- Sequential: T029, T030 → T031 → T032 → T033-T037

**Phase 4 (User Story 2)**:
- Parallel batch 1: T038-T045 (all API endpoints + base components)
- Parallel batch 2: T046, T047, T048 (can overlap with batch 1)
- Sequential: T049 → T050-T052 → T053-T058

**Phase 5 (User Story 3)**:
- Parallel: T059, T060
- Sequential: T061 → T062-T066

**Phase 6 (User Story 4)**:
- Sequential: T067 → T068-T069 → T070-T072

**Phase 7 (Polish)**: Most tasks T073-T086 can run in parallel (different concerns)

**Cross-Story Parallelism**:
Once Foundational completes, User Stories 1, 2, and 3 can be developed in parallel by different developers:
- Developer A: User Story 1 (T024-T037)
- Developer B: User Story 2 (T038-T058)
- Developer C: User Story 3 (T059-T066)

---

## Parallel Example: User Story 1

```bash
# Launch API and hooks together:
Task: "Implement GET /api/milestones endpoint in src/app/api/milestones/route.ts"
Task: "Create useMilestones custom hook in src/hooks/useMilestones.ts"
Task: "Create useTimeCalculation custom hook in src/hooks/useTimeCalculation.ts"
Task: "Create Card base component in src/components/ui/Card.tsx"
Task: "Create Loading skeleton component in src/components/ui/Loading.tsx"

# Then launch feature components:
Task: "Create MilestoneCard component in src/components/features/Timeline/MilestoneCard.tsx"
Task: "Create TimelineEmpty component in src/components/features/Timeline/TimelineEmpty.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all API endpoints together:
Task: "Implement POST /api/milestones endpoint"
Task: "Implement GET /api/milestones/[id]/route.ts endpoint"
Task: "Implement PUT /api/milestones/[id]/route.ts endpoint"
Task: "Implement DELETE /api/milestones/[id]/route.ts endpoint"
Task: "Implement POST /api/upload endpoint"

# Launch all UI base components together:
Task: "Create Button base component in src/components/ui/Button.tsx"
Task: "Create Input base component in src/components/ui/Input.tsx"
Task: "Create Modal base component in src/components/ui/Modal.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T023) ⚠️ **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (T024-T037) 🎯 **MVP SCOPE**
4. **STOP and VALIDATE**:
   - Run `pnpm dev`
   - Test timeline display with seed data
   - Verify mobile responsiveness (320px)
   - Check Core Web Vitals
   - Test accessibility with screen reader
5. Deploy/demo if ready (optional: deploy MVP first)

**Estimated MVP Tasks**: 37 tasks (Phases 1-3)

### Incremental Delivery

1. **Foundation** (T001-T023): Setup + Database + Core utilities → ~1-2 days
2. **MVP - US1** (T024-T037): View timeline → ~2-3 days → **Deploy/Demo V1**
3. **US2** (T038-T058): Add/Edit milestones → ~3-4 days → **Deploy/Demo V2**
4. **US3** (T059-T066): Upcoming anniversaries → ~1 day → **Deploy/Demo V3**
5. **US4** (T067-T072): Time calculations → ~0.5 days → **Deploy/Demo V4**
6. **Polish** (T073-T090): Production readiness → ~1-2 days → **Final Release**

**Total Estimated Time**: 8-12 days (solo developer, full-time)

### Parallel Team Strategy

With multiple developers:

1. **Day 1**: Team completes Setup (Phase 1) together
2. **Day 2-3**: Team completes Foundational (Phase 2) together ⚠️ **CRITICAL**
3. **Day 4-7**: Once Foundational is done, stories can proceed in parallel:
   - Developer A: User Story 1 (T024-T037) - 3-4 days
   - Developer B: User Story 2 (T038-T058) - 3-4 days
   - Developer C: User Story 3 (T059-T066) - 1-2 days, then helps with US4
4. **Day 8-9**: User Story 4 (T067-T072) - enhances US1
5. **Day 10-12**: Team completes Polish (Phase 7) together

**Total Estimated Time**: 10-12 days (3-person team, full-time)

---

## Task Summary

- **Total Tasks**: 90
- **Setup (Phase 1)**: 7 tasks
- **Foundational (Phase 2)**: 16 tasks ⚠️ **BLOCKS ALL STORIES**
- **User Story 1 (Phase 3)**: 14 tasks 🎯 **MVP SCOPE**
- **User Story 2 (Phase 4)**: 21 tasks
- **User Story 3 (Phase 5)**: 8 tasks
- **User Story 4 (Phase 6)**: 6 tasks
- **Polish (Phase 7)**: 18 tasks

### MVP Scope (Recommended First Delivery)
**Tasks T001-T037** (37 tasks): Setup + Foundational + User Story 1

This delivers a working, beautiful, accessible, responsive timeline that users can view and appreciate - the core value proposition of the application.

### Parallel Opportunities
- **Phase 1**: 6 of 7 tasks can run in parallel
- **Phase 2**: ~12 of 16 tasks can run in parallel (after schema creation)
- **User Stories 1, 2, 3**: Can be developed completely in parallel after Foundational
- **Phase 7**: ~15 of 18 tasks can run in parallel

### Independent Test Criteria

Each user story has clear independent test criteria:
- **US1**: View timeline with seed data, verify responsive display
- **US2**: Add/edit/delete milestones, verify CRUD operations
- **US3**: Set future dates, verify upcoming section displays correctly
- **US4**: Verify time calculations display accurately for all milestones

---

## Notes

- **[P] tasks**: Different files, no dependencies, can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Foundational phase is CRITICAL**: All user stories depend on it being complete
- **Each user story is independently completable and testable**
- **MVP is User Story 1**: Get timeline working first, then add features
- **Commit after each task or logical group**
- **Stop at any checkpoint to validate story independently**
- **Use `pnpm dev` to test during development**
- **Use `pnpm prisma studio` to inspect database**
- **Use `docker-compose up -d` to test production deployment**
- **Refer to quickstart.md for detailed development and deployment instructions**

---

## Getting Started

Ready to start development? Follow these steps:

1. **Complete Phase 1**: Initialize project and install dependencies (T001-T007)
2. **Complete Phase 2**: Setup database and core infrastructure (T008-T023)
   - Run `pnpm prisma migrate dev` to create database
   - Run `pnpm prisma db seed` to populate sample data
3. **Start with MVP**: Implement User Story 1 (T024-T037)
   - Run `pnpm dev` and open http://localhost:3000
   - Verify timeline displays sample milestones
4. **Iterate**: Add User Stories 2, 3, 4 incrementally
5. **Polish**: Complete Phase 7 for production readiness

**Your anniversary calendar website awaits! 开始开发吧！** 🎉
