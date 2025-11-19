# API Contracts: Milestone Calendar View

**Feature**: `002-milestone-calendar-view`
**Date**: 2025-11-19
**Status**: Phase 1 - Design

## Overview

The Milestone Calendar View is a **frontend-only feature** that reuses existing API endpoints from feature 001-anniversary-calendar. No new API routes are required.

## Existing API Endpoints (Reused)

### GET /api/milestones

**Purpose**: Fetch all milestones for calendar display

**Implemented In**: `src/app/api/milestones/route.ts` (feature 001)

**Request**:
```http
GET /api/milestones HTTP/1.1
Host: localhost:3000
```

**Response** (200 OK):
```json
{
  "milestones": [
    {
      "id": "uuid-string",
      "date": "2025-03-15T00:00:00.000Z",
      "title": "First Date",
      "description": "Coffee at the park",
      "imageUrl": "/uploads/first-date.webp",
      "imageWidth": 1920,
      "imageHeight": 1080,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "uuid-string-2",
      "date": "2025-03-20T00:00:00.000Z",
      "title": "Anniversary",
      "description": null,
      "imageUrl": null,
      "imageWidth": null,
      "imageHeight": null,
      "createdAt": "2025-01-02T12:00:00.000Z",
      "updatedAt": "2025-01-02T12:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `500 Internal Server Error` - Database connection failed

**Usage in Calendar View**:
- Called once on calendar page load via `useMilestones` SWR hook
- Filtered client-side by `useMilestonesByMonth` to show only current month's milestones
- Cached by SWR for instant month navigation

**OpenAPI Reference**: See `specs/001-anniversary-calendar/contracts/api-spec.yaml` for complete specification

## Why No New API Endpoints?

### Rationale for Client-Side Filtering

The calendar view filters milestones by month on the client-side rather than adding query parameters to the API (e.g., `GET /api/milestones?month=2025-03`) for the following reasons:

1. **Small Dataset**: Expected milestone count is 50-200 total, which is trivial to transfer and filter client-side (< 50KB payload)

2. **SWR Caching**: Fetching all milestones once and caching allows instant month navigation without network requests. Query param approach would require a new fetch on every month change.

3. **Simpler Backend**: No need to implement date range query logic, validation, or optimize database queries for date ranges

4. **Performance**: Client-side filtering is nearly instant (< 1ms) for small datasets. Network latency (even local) is orders of magnitude slower (10-100ms)

5. **Consistency**: Reusing existing endpoint ensures calendar view and timeline view always show identical data (no cache invalidation issues)

### When to Add API Filtering

If the milestone count grows beyond 1000 entries, consider adding:
```http
GET /api/milestones?startDate=2025-03-01&endDate=2025-03-31
```

This would optimize bandwidth and improve performance for users with large datasets. Current scope assumes personal use (couples app) with < 200 milestones.

## Frontend Data Flow

### SWR Integration

**Hook**: `useMilestones` (existing from feature 001)

```typescript
// src/hooks/useMilestones.ts (existing)
import useSWR from 'swr'
import { Milestone } from '@/types/milestone'

export function useMilestones() {
  const { data, error, isLoading } = useSWR<{ milestones: Milestone[] }>(
    '/api/milestones',
    fetcher
  )

  return {
    milestones: data?.milestones || [],
    isLoading,
    isError: error,
  }
}
```

**Calendar Usage**:
```typescript
// src/app/calendar/page.tsx
import { useMilestones } from '@/hooks/useMilestones'
import { useMilestonesByMonth } from '@/hooks/useMilestonesByMonth'
import { useCalendar } from '@/hooks/useCalendar'

export default function CalendarPage() {
  const { currentMonth } = useCalendar()
  const { milestones, isLoading } = useMilestones() // Fetch all milestones
  const monthMilestones = useMilestonesByMonth(milestones, currentMonth) // Filter to current month

  // Render calendar with monthMilestones...
}
```

## Type Contracts

### Milestone Type (Existing)

**File**: `src/types/milestone.ts` (from feature 001)

```typescript
export interface Milestone {
  id: string
  date: string // ISO 8601 date string
  title: string
  description: string | null
  imageUrl: string | null
  imageWidth: number | null
  imageHeight: number | null
  createdAt: string // ISO 8601 datetime string
  updatedAt: string // ISO 8601 datetime string
}
```

### API Response Types (Existing)

```typescript
// GET /api/milestones response
export interface MilestonesResponse {
  milestones: Milestone[]
}
```

## Error Handling

### Network Errors

**SWR Behavior**:
- Automatic retry with exponential backoff
- Shows cached data while revalidating
- Exposes `isError` flag for error states

**Calendar View Handling**:
```typescript
const { milestones, isLoading, isError } = useMilestones()

if (isError) {
  return <ErrorMessage>Failed to load milestones</ErrorMessage>
}

if (isLoading) {
  return <CalendarSkeleton />
}

// Render calendar with milestones...
```

### Empty State

When no milestones exist:
```typescript
if (milestones.length === 0) {
  return <CalendarEmpty message="No milestones yet. Create your first one!" />
}
```

## Testing Contracts

### MSW (Mock Service Worker) Mocks

**File**: `tests/mocks/handlers.ts` (extend existing)

```typescript
import { rest } from 'msw'

export const handlers = [
  // Existing handler (from feature 001)
  rest.get('/api/milestones', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        milestones: [
          {
            id: '1',
            date: '2025-03-15T00:00:00.000Z',
            title: 'Test Milestone',
            description: 'Test description',
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
      })
    )
  }),
]
```

## Future API Considerations

### Potential Enhancements (Not in Current Scope)

1. **Date Range Query** (if dataset grows):
   ```http
   GET /api/milestones?startDate=2025-03-01&endDate=2025-03-31
   ```

2. **Pagination** (if dataset exceeds 1000 entries):
   ```http
   GET /api/milestones?page=1&limit=50
   ```

3. **Sorting** (if multiple sort orders needed):
   ```http
   GET /api/milestones?sortBy=date&order=desc
   ```

4. **Calendar-Specific Metadata** (aggregation for year view):
   ```http
   GET /api/milestones/counts?year=2025
   Response: { "2025-01": 5, "2025-02": 3, ... }
   ```

**Note**: These are not required for the initial implementation. Implement only if performance issues arise or new use cases emerge.

---

**Contract Status**: ✅ Complete - Reuses existing API endpoints. No new contracts required. Proceed to quickstart.md generation.
