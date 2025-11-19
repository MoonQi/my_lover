# my_lover Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-18

## Active Technologies
- TypeScript 5.3+ (strict mode), Node.js 20 LTS + Next.js 15 (App Router), React 18, Tailwind CSS 3.4+, date-fns 3.x, SWR (002-milestone-calendar-view)
- PostgreSQL 15+ (via Prisma ORM) - reusing existing Milestone table, no new tables needed (002-milestone-calendar-view)

- TypeScript 5.3+ (strict mode), Node.js 20 LTS + Next.js 15 (App Router), React 18, Tailwind CSS 3.4+, Prisma 5.x, date-fns 3.x, SWR, React Hook Form 7.x, Zod 3.x, sharp (image optimization) (001-anniversary-calendar)
- PostgreSQL 15+ (via Prisma ORM), Local filesystem (image storage with Docker volumes) (001-anniversary-calendar)

## Project Structure

```text
my_lover/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # React components (ui/ + features/)
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities and helpers
│   ├── styles/       # Design tokens
│   └── types/        # TypeScript types
├── prisma/           # Database schema and migrations
├── tests/            # Unit, integration, and e2e tests
├── public/           # Static assets
└── docker-compose.yml # Docker orchestration
```

## Commands

pnpm dev; pnpm test; pnpm lint; pnpm build

## Code Style

TypeScript 5.3+ with strict mode: Follow constitutional standards (component-first, mobile-first, WCAG 2.1 AA)

## Recent Changes
- 002-milestone-calendar-view: Added TypeScript 5.3+ (strict mode), Node.js 20 LTS + Next.js 15 (App Router), React 18, Tailwind CSS 3.4+, date-fns 3.x, SWR

- 001-anniversary-calendar: Added Next.js 15 monorepo architecture with TypeScript 5.3+, React 18, Tailwind CSS, Prisma ORM, PostgreSQL, Docker deployment

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
