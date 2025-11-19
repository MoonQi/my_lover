# Data Model: Anniversary Calendar

**Feature**: Anniversary Calendar
**Date**: 2025-11-18
**Database**: PostgreSQL 15+ via Prisma ORM

## Overview

This document defines the database schema, entity relationships, validation rules, and state transitions for the Anniversary Calendar application. The data model is designed to support a single couple's relationship timeline with milestones, photos, and temporal calculations.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────┐
│         Milestone               │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ date: Date                      │
│ title: String(200)              │
│ description: Text (optional)    │
│ imageUrl: String(500) (optional)│
│ imageWidth: Int (optional)      │
│ imageHeight: Int (optional)     │
│ createdAt: DateTime             │
│ updatedAt: DateTime             │
└─────────────────────────────────┘
```

**Note**: This is a single-entity model. No relationships needed since the application is designed for a single couple (no user accounts, no multi-tenancy).

---

## 1. Milestone Entity

### Description
Represents a significant moment or event in the couple's relationship journey. Each milestone marks a point in time with optional descriptive details and an associated photograph.

### Schema Definition (Prisma)

```prisma
model Milestone {
  // Primary Key
  id          String   @id @default(uuid())

  // Core Fields
  date        DateTime @db.Date
  title       String   @db.VarChar(200)
  description String?  @db.Text

  // Image Fields
  imageUrl    String?  @db.VarChar(500)
  imageWidth  Int?     // For aspect ratio preservation
  imageHeight Int?     // For aspect ratio preservation

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Indexes for Performance
  @@index([date(sort: Desc)]) // Timeline sorting
  @@map("milestones")
}
```

### Field Specifications

| Field | Type | Required | Constraints | Purpose |
|-------|------|----------|-------------|---------|
| `id` | UUID | Yes | Primary key, auto-generated | Unique identifier for each milestone |
| `date` | Date | Yes | Valid date, can be future or past | The date of the milestone event |
| `title` | String | Yes | 1-200 characters, non-empty | Short, descriptive name of the milestone |
| `description` | Text | No | 0-2000 characters | Detailed description or memory |
| `imageUrl` | String | No | Valid URL, max 500 chars | Cloud storage URL for uploaded photo |
| `imageWidth` | Integer | No | Positive integer | Original image width in pixels |
| `imageHeight` | Integer | No | Positive integer | Original image height in pixels |
| `createdAt` | DateTime | Yes | Auto-set on creation | When milestone was created |
| `updatedAt` | DateTime | Yes | Auto-updated on changes | Last modification timestamp |

### Business Rules

1. **Date Validation**
   - Can be in the past, present, or future (for planned events)
   - Must be a valid calendar date
   - No restriction on how far back or forward dates can be

2. **Title Rules**
   - MUST be provided (required field)
   - MUST be between 1-200 characters
   - Should be descriptive but concise
   - Examples: "第一次约会" (First Date), "求婚纪念日" (Proposal Anniversary)

3. **Description Rules**
   - Optional, can be empty
   - Maximum 2000 characters
   - Can contain line breaks and formatting (stored as plain text)
   - Examples: Detailed memory, feelings, or context about the milestone

4. **Image Rules**
   - Optional (milestones can exist without photos)
   - Stored as URL to cloud storage (Vercel Blob)
   - Original dimensions stored for aspect ratio calculation
   - Images optimized before storage (WebP/AVIF, max 500KB)

5. **Timeline Rules**
   - Multiple milestones can share the same date
   - If same date, sort by creation time (createdAt)
   - First milestone (earliest date) has special designation as "together since" date

---

## 2. Validation Rules

### Server-Side Validation (Zod Schema)

```typescript
import { z } from 'zod';

export const milestoneSchema = z.object({
  date: z.date({
    required_error: "日期是必填项", // Date is required
    invalid_type_error: "请输入有效的日期", // Please enter a valid date
  }),

  title: z.string()
    .min(1, "标题不能为空") // Title cannot be empty
    .max(200, "标题不能超过200个字符") // Title cannot exceed 200 characters
    .trim(),

  description: z.string()
    .max(2000, "描述不能超过2000个字符") // Description cannot exceed 2000 characters
    .optional()
    .transform(val => val === '' ? null : val),

  imageUrl: z.string()
    .url("图片链接无效") // Invalid image URL
    .max(500)
    .optional(),

  imageWidth: z.number()
    .int()
    .positive()
    .optional(),

  imageHeight: z.number()
    .int()
    .positive()
    .optional(),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;
```

### Client-Side Validation

- **Real-time validation**: Validate on blur for immediate feedback
- **Visual indicators**: Red borders + error messages below fields
- **Disable submit**: Button disabled until all validations pass
- **File size check**: Validate image < 10MB before upload attempt

---

## 3. Database Indexes

### Performance Optimization

```sql
-- Primary index (auto-created)
CREATE UNIQUE INDEX milestones_id_key ON milestones(id);

-- Timeline sorting index (most important)
CREATE INDEX milestones_date_idx ON milestones(date DESC);

-- Full-text search index (future enhancement)
-- CREATE INDEX milestones_title_search_idx ON milestones
--   USING gin(to_tsvector('simple', title || ' ' || COALESCE(description, '')));
```

**Rationale**:
1. **Date index (DESC)**: Timeline view sorts by date descending (most recent first). Index scan is O(log n) vs O(n) table scan.
2. **UUID index**: Automatic with primary key, enables fast lookups by ID for edit/delete operations.

---

## 4. State Transitions

### Milestone Lifecycle

```
┌──────────┐
│  Create  │
│  (POST)  │
└─────┬────┘
      │
      v
┌─────────────┐       ┌──────────┐
│   Active    │────-->│  Update  │
│  (exists)   │       │   (PUT)  │
└─────────────┘       └─────┬────┘
      │                     │
      │                     v
      │               ┌─────────────┐
      └──────────────>│   Deleted   │
                      │  (DELETE)   │
                      └─────────────┘
```

### State Descriptions

1. **Create**: New milestone is created via POST /api/milestones
   - Validation runs on input data
   - Image uploaded to Vercel Blob if provided
   - Record inserted into database
   - Returns created milestone with generated ID

2. **Active**: Milestone exists in database
   - Visible in timeline view
   - Can be queried via GET /api/milestones
   - Available for edit/delete operations
   - Part of time calculation displays

3. **Update**: Existing milestone is modified via PUT /api/milestones/:id
   - Partial updates supported (only changed fields)
   - Date changes trigger timeline re-sort
   - Image URL changes require old image cleanup
   - `updatedAt` timestamp automatically updated

4. **Deleted**: Milestone is permanently removed via DELETE /api/milestones/:id
   - Hard delete (not soft delete for simplicity)
   - Associated image deleted from Vercel Blob
   - Confirmation required on client-side
   - No undo mechanism (can be added later if needed)

---

## 5. Data Access Patterns

### Common Queries

#### 1. Get All Milestones (Timeline View)
```typescript
const milestones = await prisma.milestone.findMany({
  orderBy: { date: 'desc' },
});
```
**Index Used**: `milestones_date_idx`
**Expected Performance**: < 50ms for 200 records

#### 2. Get Upcoming Anniversaries (Next 30 Days)
```typescript
const thirtyDaysFromNow = new Date();
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

const upcoming = await prisma.milestone.findMany({
  where: {
    date: {
      gte: new Date(),
      lte: thirtyDaysFromNow,
    },
  },
  orderBy: { date: 'asc' },
});
```
**Index Used**: `milestones_date_idx`
**Expected Performance**: < 20ms

#### 3. Get Single Milestone (Edit/Delete)
```typescript
const milestone = await prisma.milestone.findUnique({
  where: { id: milestoneId },
});
```
**Index Used**: Primary key index
**Expected Performance**: < 10ms

#### 4. Get First Milestone ("Together Since")
```typescript
const firstMilestone = await prisma.milestone.findFirst({
  orderBy: { date: 'asc' },
});
```
**Index Used**: `milestones_date_idx`
**Expected Performance**: < 10ms

---

## 6. Migration Strategy

### Initial Migration

```sql
-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "imageUrl" VARCHAR(500),
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "milestones_date_idx" ON "milestones"("date" DESC);
```

### Running Migrations

```bash
# Generate migration
pnpm prisma migrate dev --name init

# Apply to production
pnpm prisma migrate deploy
```

---

## 7. Seed Data (Development)

### Sample Milestones

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.milestone.createMany({
    data: [
      {
        date: new Date('2020-02-14'),
        title: '我们在一起的第一天',
        description: '在那个美丽的情人节，我们决定开始这段旅程。',
      },
      {
        date: new Date('2020-12-25'),
        title: '第一个圣诞节',
        description: '一起度过的第一个节日，充满了温暖和快乐。',
      },
      {
        date: new Date('2022-06-01'),
        title: '求婚',
        description: '人生中最重要的时刻之一。',
        imageUrl: 'https://example.com/proposal.jpg',
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 8. Data Integrity & Constraints

### Database-Level Constraints

1. **NOT NULL Constraints**:
   - `id`, `date`, `title`, `createdAt`, `updatedAt` cannot be null
   - Enforced at database level for data integrity

2. **Length Constraints**:
   - `title`: VARCHAR(200) prevents excessively long titles
   - `imageUrl`: VARCHAR(500) limits URL length
   - `description`: TEXT allows unlimited length (limited by application logic)

3. **Type Constraints**:
   - `date`: Date type ensures valid dates only
   - `imageWidth`, `imageHeight`: Integer ensures numeric values

### Application-Level Constraints

1. **Referential Integrity**: Not applicable (single entity, no foreign keys)
2. **Unique Constraints**: Not needed (multiple milestones can share same date/title)
3. **Check Constraints**: Handled by Zod validation (positive dimensions, valid URLs)

---

## 9. Scaling Considerations

### Current Scale (Single Couple)
- **Expected records**: 50-200 milestones over lifetime
- **Database size**: < 1MB for text data, images stored externally
- **Query performance**: All queries < 100ms with indexes

### Future Scale (If Expanding to Multi-Couple)
Would require:
1. **User/Couple entity**: Authentication and authorization
2. **Foreign key**: `milestones.coupleId` linking to couples table
3. **Row-level security**: Ensure couples only see their own milestones
4. **Additional indexes**: Composite index on `(coupleId, date)`

**Decision**: Not implementing now. Single-couple simplicity prioritized per spec assumptions.

---

## 10. Backup & Recovery

### Backup Strategy
- **Automated backups**: Vercel Postgres / Railway provides daily automated backups
- **Retention**: 7-day backup retention minimum
- **Point-in-time recovery**: Supported by managed PostgreSQL services

### Data Export
```typescript
// Export milestones to JSON
const milestones = await prisma.milestone.findMany();
const backup = JSON.stringify(milestones, null, 2);
// Save to file or cloud storage
```

---

## Summary

### Key Points
✅ **Single entity model**: Simple and efficient for single-couple use case
✅ **Type-safe**: Prisma generates TypeScript types from schema
✅ **Performant**: Indexes optimize timeline sorting and queries
✅ **Validated**: Zod schemas ensure data integrity
✅ **Scalable**: Design supports 50-200 milestones with sub-100ms queries
✅ **Cloud-native**: Images stored externally, database optimized for serverless

### Files to Create
1. `prisma/schema.prisma` - Database schema definition
2. `prisma/seed.ts` - Development seed data
3. `src/lib/validation.ts` - Zod schemas
4. `src/types/milestone.ts` - TypeScript types

This data model is ready for implementation in Phase 2 (tasks generation).
