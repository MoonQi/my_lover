# Implementation Plan: Anniversary Calendar

**Branch**: `001-anniversary-calendar` | **Date**: 2025-11-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-anniversary-calendar/spec.md`

## Summary

A mobile-first web application for couples to record, visualize, and celebrate relationship milestones on an interactive timeline. The application supports creating, editing, and viewing milestones with photos, automatic time calculations, and anniversary reminders. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, PostgreSQL with Prisma ORM, and deployed via Docker for self-hosted infrastructure with full data ownership.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode), Node.js 20 LTS
**Primary Dependencies**: Next.js 15 (App Router), React 18, Tailwind CSS 3.4+, Prisma 5.x, date-fns 3.x, SWR, React Hook Form 7.x, Zod 3.x, sharp (image optimization)
**Storage**: PostgreSQL 15+ (via Prisma ORM), Local filesystem (image storage with Docker volumes)
**Testing**: Vitest (unit/integration), React Testing Library (component), Playwright (e2e), MSW (API mocking)
**Target Platform**: Web (mobile-first responsive, 320px+ width), Docker self-hosted deployment
**Project Type**: Web application (frontend + backend in monorepo via Next.js)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1, 60fps animations, bundle < 200KB gzipped, < 2s timeline load on mobile
**Constraints**: WCAG 2.1 AA accessibility, 44x44px minimum tap targets, offline-capable image caching, support iOS Safari + Android Chrome
**Scale/Scope**: Single couple (50-200 milestones expected), simple data model, personal privacy-focused application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Planning Gate (Initial Assessment)

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Component-First Architecture** | ✅ PASS | Timeline, milestone cards, forms, and UI elements designed as reusable React components |
| **II. Mobile-First & Responsive** | ✅ PASS | Explicit requirement in spec (FR-009), Tailwind CSS mobile-first utilities, 320px minimum width, 44x44px tap targets |
| **III. UI Excellence & Aesthetics** | ✅ PASS | Design system planned (Tailwind config), WCAG 2.1 AA compliance required (SC-008), romantic color palette, smooth 60fps animations |
| **IV. Code Quality & Maintainability** | ✅ PASS | TypeScript strict mode, ESLint/Prettier configured, clear naming conventions, DRY principle via custom hooks |
| **V. Test Coverage** | ✅ PASS | Comprehensive testing strategy (Vitest + RTL + Playwright), performance budgets defined (SC-006), visual regression for key components |

**Gate Status**: ✅ **PASSED** - All constitutional principles satisfied. Proceed to Phase 0 research.

### Post-Design Gate (After Phase 1)

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Component-First Architecture** | ✅ PASS | Data model supports component isolation, API contracts enable independent development |
| **II. Mobile-First & Responsive** | ✅ PASS | Image optimization with sharp, responsive design tokens in Tailwind config, Docker deployment supports mobile access |
| **III. UI Excellence & Aesthetics** | ✅ PASS | Image storage with aspect ratio preservation, optimized formats (WebP/AVIF), Lighthouse CI integration planned |
| **IV. Code Quality & Maintainability** | ✅ PASS | Prisma type-safe queries, Zod validation schemas, OpenAPI contracts document all endpoints |
| **V. Test Coverage** | ✅ PASS | MSW for API mocking defined, database seeding for test data, Playwright e2e for P1/P2 scenarios |

**Gate Status**: ✅ **PASSED** - Design artifacts maintain constitutional compliance. Proceed to Phase 2 tasks generation.

## Project Structure

### Documentation (this feature)

```text
specs/001-anniversary-calendar/
├── spec.md              # Feature specification (user stories, requirements)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - technology decisions and rationale
├── data-model.md        # Phase 1 output - database schema and validation
├── quickstart.md        # Phase 1 output - development setup guide
├── contracts/           # Phase 1 output - API specifications
│   └── api-spec.yaml   # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (NOT created yet - use /speckit.tasks)
```

### Source Code (repository root)

```text
my_lover/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page (timeline view)
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── globals.css     # Global styles and Tailwind imports
│   │   ├── loading.tsx     # Loading skeleton (streaming)
│   │   ├── error.tsx       # Error boundary
│   │   └── api/            # API routes (serverless functions)
│   │       ├── health/route.ts          # Health check endpoint
│   │       └── milestones/              # Milestone CRUD endpoints
│   │           ├── route.ts             # GET (list), POST (create)
│   │           └── [id]/route.ts        # GET (one), PUT (update), DELETE
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   └── features/       # Feature-specific components
│   │       ├── Timeline/
│   │       │   ├── Timeline.tsx           # Main timeline container
│   │       │   ├── MilestoneCard.tsx      # Individual milestone display
│   │       │   └── TimelineEmpty.tsx      # Empty state
│   │       ├── MilestoneForm/
│   │       │   ├── MilestoneForm.tsx      # Add/edit form
│   │       │   ├── DatePicker.tsx         # Date input
│   │       │   └── ImageUpload.tsx        # Photo upload
│   │       └── UpcomingAnniversaries/
│   │           └── UpcomingList.tsx       # Anniversary reminder section
│   ├── hooks/              # Custom React hooks
│   │   ├── useMilestones.ts      # SWR hook for milestone data
│   │   ├── useTimeCalculation.ts # Time duration calculations
│   │   └── useImageUpload.ts     # Image upload logic
│   ├── lib/                # Utilities and helper functions
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── validation.ts         # Zod schemas
│   │   ├── imageOptimization.ts  # sharp image processing
│   │   ├── dateUtils.ts          # date-fns wrappers
│   │   └── api.ts                # API client utilities
│   ├── styles/             # Design tokens and global styles
│   │   └── theme.ts              # Tailwind theme configuration
│   └── types/              # TypeScript type definitions
│       ├── milestone.ts          # Milestone types
│       └── api.ts                # API response types
├── prisma/
│   ├── schema.prisma       # Database schema definition
│   ├── migrations/         # Migration history (auto-generated)
│   └── seed.ts             # Seed data for development
├── tests/                  # Test files
│   ├── unit/              # Component and hook unit tests
│   │   ├── components/
│   │   └── hooks/
│   ├── integration/       # API integration tests
│   │   └── api/
│   └── e2e/              # End-to-end tests (Playwright)
│       ├── timeline.spec.ts
│       ├── milestone-crud.spec.ts
│       └── anniversaries.spec.ts
├── public/                # Static assets
│   ├── uploads/           # User-uploaded images (Docker volume)
│   └── icons/             # App icons and static images
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
├── .dockerignore          # Docker ignore file
├── docker-compose.yml     # Docker orchestration
├── Dockerfile             # Multi-stage production build
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest test configuration
├── playwright.config.ts   # Playwright e2e configuration
├── package.json           # Dependencies and scripts
└── pnpm-lock.yaml         # Lockfile (pnpm)
```

**Structure Decision**: Web application structure chosen based on Next.js App Router architecture. The monorepo approach combines frontend and backend in a single Next.js project with API routes, simplifying deployment and development. This aligns with the project type "web" and supports self-hosted Docker deployment with minimal infrastructure complexity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitutional principles are satisfied by the planned architecture. The design follows mobile-first principles, implements component-first architecture, ensures code quality with TypeScript strict mode, maintains comprehensive test coverage, and prioritizes UI excellence with accessibility standards.

---

## Planning Phases Summary

### Phase 0: Outline & Research ✅ COMPLETED
- **Output**: `research.md`
- **Status**: All technology decisions finalized
- **Key Decisions**:
  - Next.js 15 with App Router (RSC for performance)
  - Tailwind CSS (mobile-first utilities)
  - PostgreSQL + Prisma (type-safe queries)
  - Local filesystem + sharp (image optimization)
  - date-fns (i18n date formatting)
  - React Context + SWR (state management)
  - React Hook Form + Zod (validation)
  - Vitest + RTL + Playwright (testing)
  - Docker self-hosted (deployment)

### Phase 1: Design & Contracts ✅ COMPLETED
- **Outputs**: `data-model.md`, `contracts/api-spec.yaml`, `quickstart.md`
- **Status**: All design artifacts generated
- **Artifacts Created**:
  - Database schema with Prisma (Milestone entity)
  - OpenAPI 3.0 specification (5 endpoints)
  - Development setup guide (Docker + local)
  - Zod validation schemas
  - Migration strategy defined
  - Agent context updated (CLAUDE.md)
  - Docker configuration (Dockerfile, docker-compose.yml, .dockerignore, .env.example)

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

**Branch**: `001-anniversary-calendar` (or create if not exists)
**Plan Path**: `D:\Code\my_lover\specs\001-anniversary-calendar\plan.md`
**Generated Artifacts**:
- ✅ `research.md` - Technology stack and rationale
- ✅ `data-model.md` - Database schema and validation
- ✅ `contracts/api-spec.yaml` - API specification
- ✅ `quickstart.md` - Development setup guide
- ✅ `Dockerfile` - Multi-stage production build
- ✅ `docker-compose.yml` - Container orchestration
- ✅ `.dockerignore` - Docker build optimization
- ✅ `.env.example` - Environment variable template
- ⏳ `tasks.md` - Awaiting `/speckit.tasks` command
