# Research: Anniversary Calendar Technology Stack

**Feature**: Anniversary Calendar
**Date**: 2025-11-18
**Purpose**: Document technology choices, best practices, and architectural decisions for implementation

## Overview

This document captures the research findings and rationale for all technical decisions made during the planning phase. Each decision considers performance, maintainability, developer experience, and alignment with the project constitution (mobile-first, UI excellence, code quality).

---

## 1. Frontend Framework: Next.js 15 with App Router

### Decision
Use **Next.js 15** with the **App Router** (not Pages Router) for the frontend framework.

### Rationale
1. **React Server Components (RSC)**: Reduces JavaScript bundle size by rendering components on the server, improving initial page load (critical for LCP < 2.5s)
2. **Built-in optimization**: Automatic code splitting, image optimization via `next/image`, font optimization
3. **Mobile performance**: Server-side rendering ensures fast first paint on mobile devices
4. **Developer experience**: File-system based routing, TypeScript support out-of-the-box, hot module replacement
5. **Integrated API routes**: No need for separate backend server (Next.js API routes handle backend logic)
6. **Vercel deployment**: Zero-config deployment with edge functions and CDN

### Alternatives Considered
- **Vite + React**: More lightweight but requires separate backend, no built-in SSR, manual image optimization
- **Remix**: Excellent performance but smaller ecosystem, less mature than Next.js
- **Create React App**: Deprecated, poor performance, no SSR

### Best Practices
- Use Server Components by default, Client Components only when needed (interactivity, browser APIs)
- Implement streaming with `loading.tsx` for improved perceived performance
- Use `generateMetadata` for SEO-friendly meta tags
- Leverage route groups for layout organization
- Use Parallel Routes for simultaneous data fetching

### References
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)

---

## 2. Styling Solution: Tailwind CSS

### Decision
Use **Tailwind CSS v3.4+** for styling with the JIT (Just-In-Time) compiler.

### Rationale
1. **Mobile-first by default**: Tailwind's responsive utilities follow mobile-first pattern (required by constitution)
2. **Performance**: JIT compiler generates only used classes, minimizing CSS bundle size
3. **Design system alignment**: Easy to configure design tokens (colors, spacing, typography) in `tailwind.config.js`
4. **Developer experience**: IntelliSense support, rapid prototyping, no context switching between files
5. **Accessibility**: Built-in utilities for focus states, screen reader classes
6. **Dark mode**: First-class dark mode support if needed in future

### Alternatives Considered
- **CSS Modules**: More verbose, harder to maintain consistent design system
- **styled-components**: Runtime cost, larger bundle size, not ideal for Server Components
- **Vanilla CSS**: Harder to maintain, no design token management

### Best Practices
- Configure custom color palette for romantic/loving aesthetic (soft pastels, warm tones)
- Use `@layer components` for reusable component classes
- Implement responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Use `clsx` or `cn` utility for conditional class names
- Configure `content` paths to include all component files

### Configuration Example
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        romantic: {
          50: '#fdf2f8',
          100: '#fce7f3',
          // ... romantic pink/rose palette
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### References
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Best Practices](https://tailwindui.com/documentation)

---

## 3. Database: PostgreSQL 15+ with Prisma ORM

### Decision
Use **PostgreSQL 15+** as the relational database with **Prisma ORM** for type-safe database access.

### Rationale
1. **Relational model**: Milestones have structured data (date, title, description) that fits relational model well
2. **ACID compliance**: Ensures data integrity for milestone CRUD operations
3. **JSON support**: PostgreSQL's JSONB type can store flexible metadata if needed
4. **Performance**: Excellent indexing capabilities for date-based queries (timeline sorting)
5. **Prisma benefits**:
   - Type-safe database client generated from schema
   - Automatic migrations
   - Excellent TypeScript integration
   - Query optimization and connection pooling
   - Schema visualization with Prisma Studio

### Alternatives Considered
- **SQLite**: Not suitable for production deployment, lacks concurrent write support
- **MongoDB**: Overkill for simple structured data, no strict schema enforcement
- **Supabase**: PostgreSQL-based but adds vendor lock-in; direct PostgreSQL more flexible

### Best Practices
- Use Prisma migrations for schema versioning
- Index the `date` field on milestones for fast timeline queries
- Use connection pooling (Prisma built-in) for serverless environments
- Implement soft deletes if milestone recovery needed
- Use transactions for operations involving multiple tables

### Schema Design Preview
```prisma
model Milestone {
  id          String   @id @default(uuid())
  date        DateTime @db.Date
  title       String   @db.VarChar(200)
  description String?  @db.Text
  imageUrl    String?  @db.VarChar(500)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([date])
}
```

### References
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/15/index.html)

---

## 4. Image Storage: Local Filesystem

### Decision
Use **local filesystem storage** for image uploads with manual optimization using `sharp`.

### Rationale
1. **Self-hosted control**: Full control over storage without external dependencies
2. **No vendor lock-in**: Images stored on your own server
3. **Cost-effective**: No cloud storage fees
4. **Simple integration**: Direct filesystem access with Node.js
5. **Docker volume persistence**: Images persist across container restarts
6. **Privacy**: All data stays on your infrastructure

### Alternatives Considered
- **Vercel Blob**: Requires Vercel deployment (not applicable)
- **Cloudinary**: External dependency, ongoing costs, unnecessary for self-hosted
- **AWS S3**: Overkill for single-user app, adds complexity
- **PostgreSQL storage**: Bad practice for large files, database bloat

### Best Practices
- Store images in `public/uploads/` directory (served statically by Next.js)
- Use Docker volumes to persist uploads across container restarts
- Implement `sharp` for server-side image optimization (resize, compress, format conversion)
- Generate WebP/AVIF formats for modern browsers
- Create multiple sizes (thumbnail: 300px, medium: 800px, full: 1920px)
- Store relative file paths in database (e.g., `/uploads/abc123.webp`)
- Implement file size validation (max 10MB)
- Add cleanup logic to delete orphaned images when milestones are deleted

### Implementation Pattern
```typescript
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(file: File) {
  const buffer = await file.arrayBuffer();
  const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');

  // Ensure upload directory exists
  await mkdir(uploadDir, { recursive: true });

  // Optimize and save image
  const optimized = await sharp(Buffer.from(buffer))
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  await writeFile(join(uploadDir, filename), optimized);

  // Return relative path for database storage
  return `/uploads/${filename}`;
}
```

### Docker Volume Configuration
```yaml
volumes:
  - ./public/uploads:/app/public/uploads
```

### References
- [sharp Documentation](https://sharp.pixelplumbing.com/)
- [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)

---

## 5. Date/Time Library: date-fns

### Decision
Use **date-fns v3** for date manipulation and formatting.

### Rationale
1. **Functional approach**: Immutable, pure functions (easier to test, no side effects)
2. **Tree-shakeable**: Import only needed functions, reduces bundle size
3. **Localization**: Excellent i18n support for Chinese date formats
4. **Type safety**: Full TypeScript support with proper types
5. **Lightweight**: Smaller than Moment.js, more modern than Dayjs

### Alternatives Considered
- **Moment.js**: Large bundle size (67KB), mutable API, deprecated
- **Dayjs**: Smaller but less feature-complete, weaker TypeScript support
- **Luxon**: Good but heavier, overkill for this use case

### Best Practices
- Use `formatDistance` for human-readable time durations ("2 years, 3 months ago")
- Use `differenceInDays` for anniversary countdown
- Configure Chinese locale for date formatting
- Use `parseISO` for parsing ISO date strings from database
- Implement date validation with `isValid`

### Key Functions
```typescript
import { formatDistance, differenceInDays, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// "3年2个月前"
formatDistance(milestoneDate, new Date(), {
  addSuffix: true,
  locale: zhCN
});

// Anniversary countdown
differenceInDays(nextAnniversary, new Date());
```

### References
- [date-fns Documentation](https://date-fns.org/docs)
- [date-fns i18n Guide](https://date-fns.org/docs/I18n)

---

## 6. State Management: React Context + SWR

### Decision
Use **React Context** for global state and **SWR** for server state management (data fetching).

### Rationale
1. **Simplicity**: No external state management library needed for this single-user app
2. **Server state separation**: SWR handles caching, revalidation, and optimistic updates
3. **React 18 features**: Use `useTransition` and `useOptimistic` for smooth UX
4. **SWR benefits**:
   - Automatic revalidation on window focus
   - Request deduplication
   - Optimistic UI updates
   - Built-in error retry logic
   - TypeScript support

### Alternatives Considered
- **Zustand**: Great library but overkill for simple milestone state
- **Redux Toolkit**: Too complex for single-user app, unnecessary boilerplate
- **TanStack Query**: Excellent but SWR is lighter and sufficient

### Best Practices
- Use SWR for all API data fetching (`useMilestones` hook)
- Use React Context for UI state (modal open/close, selected milestone)
- Implement optimistic updates for instant UI feedback
- Use SWR's `mutate` for cache invalidation after mutations

### Implementation Pattern
```typescript
import useSWR from 'swr';

export function useMilestones() {
  const { data, error, mutate } = useSWR('/api/milestones', fetcher);

  return {
    milestones: data,
    isLoading: !error && !data,
    isError: error,
    mutate, // For cache updates
  };
}
```

### References
- [SWR Documentation](https://swr.vercel.app/)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)

---

## 7. Form Management & Validation: React Hook Form + Zod

### Decision
Use **React Hook Form v7** for form state management and **Zod** for schema validation.

### Rationale
1. **Performance**: Minimal re-renders, uses uncontrolled components
2. **TypeScript integration**: Type-safe with Zod schema inference
3. **Developer experience**: Simple API, built-in error handling
4. **Validation**: Zod provides runtime type checking and custom error messages
5. **Bundle size**: Combined ~15KB, lightweight

### Alternatives Considered
- **Formik**: Heavier, more re-renders, less performant
- **Vanilla HTML forms**: No validation, poor UX, manual error handling

### Best Practices
- Define Zod schemas in `src/lib/validation.ts`
- Use `@hookform/resolvers/zod` for integration
- Implement custom error messages in Chinese
- Use `useForm` with `mode: 'onBlur'` for better UX
- Handle file uploads with `FileList` type

### Implementation Pattern
```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const milestoneSchema = z.object({
  date: z.date(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

const form = useForm({
  resolver: zodResolver(milestoneSchema),
});
```

### References
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

## 8. Testing Strategy

### Decision
Use **Vitest** (unit/integration), **React Testing Library** (component), and **Playwright** (e2e).

### Rationale
1. **Vitest**: Vite-powered, fastest test runner, compatible with Jest API
2. **React Testing Library**: Encourages testing user behavior, not implementation
3. **Playwright**: Modern e2e framework, cross-browser support, great mobile testing
4. **Type safety**: All three have excellent TypeScript support

### Best Practices
- Unit tests: Test hooks (`useMilestones`, `useTimeCalculation`) in isolation
- Component tests: Test rendering, user interactions, accessibility
- Integration tests: Test API routes with database mocking
- E2e tests: Test critical user journeys (P1, P2 user stories)
- Use MSW (Mock Service Worker) for API mocking in tests

### Test Coverage Goals
- Components: >80% coverage
- Hooks: 100% coverage (critical business logic)
- API routes: >90% coverage
- E2e: Cover all P1 and P2 acceptance scenarios

### References
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

---

## 9. Deployment: Docker Self-Hosted

### Decision
Deploy using **Docker + Docker Compose** on your own server with self-hosted PostgreSQL.

### Rationale
1. **Full control**: Complete ownership of infrastructure and data
2. **Cost-effective**: No cloud platform fees, only server costs
3. **Privacy**: All data stays on your infrastructure
4. **Reproducible**: Docker ensures consistent environment across dev/prod
5. **Simple orchestration**: Docker Compose manages multi-container setup
6. **Portable**: Can deploy to any server with Docker support

### Architecture
```
┌─────────────────────────────────┐
│    Your Server (Docker Host)    │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐  │
│  │   Nginx (Reverse Proxy)  │  │
│  │   Port 80/443 → 3000     │  │
│  └──────────────────────────┘  │
│              ↓                  │
│  ┌──────────────────────────┐  │
│  │   Next.js App Container  │  │
│  │   Port 3000              │  │
│  └──────────────────────────┘  │
│              ↓                  │
│  ┌──────────────────────────┐  │
│  │ PostgreSQL Container     │  │
│  │   Port 5432              │  │
│  └──────────────────────────┘  │
│                                 │
│  Volumes:                       │
│  - postgres_data (database)     │
│  - uploads (images)             │
└─────────────────────────────────┘
```

### Best Practices
- Use Docker Compose for multi-container orchestration
- Separate containers for Next.js app and PostgreSQL
- Use named volumes for data persistence (database + uploads)
- Configure Nginx reverse proxy for SSL/TLS termination
- Set resource limits (CPU, memory) for containers
- Use environment variables for configuration (`.env` file)
- Implement health checks for container monitoring
- Set up automatic restart policies (`restart: unless-stopped`)
- Use Docker secrets for sensitive data (database passwords)
- Enable logging with log rotation

### Docker Compose Configuration
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: my_lover_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: my_lover
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my_lover_app
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/my_lover
      NODE_ENV: production
    volumes:
      - ./public/uploads:/app/public/uploads
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
```

### Deployment Steps
```bash
# 1. Build and start containers
docker-compose up -d --build

# 2. Run database migrations
docker-compose exec app pnpm prisma migrate deploy

# 3. Check container status
docker-compose ps

# 4. View logs
docker-compose logs -f app

# 5. Stop containers
docker-compose down

# 6. Update deployment (pull new code)
git pull && docker-compose up -d --build
```

### Nginx Configuration (Optional but Recommended)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Backup Strategy
```bash
# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U ${DB_USER} my_lover > backup.sql

# Backup uploaded images
tar -czf uploads_backup.tar.gz public/uploads/

# Restore database
docker-compose exec -T postgres psql -U ${DB_USER} my_lover < backup.sql

# Restore images
tar -xzf uploads_backup.tar.gz
```

### Monitoring & Maintenance
- **Container monitoring**: `docker stats` or Portainer
- **Log management**: Configure log rotation in Docker daemon
- **Auto-updates**: Use Watchtower for automatic container updates (optional)
- **Backups**: Automated daily backups with cron jobs
- **SSL/TLS**: Use Let's Encrypt with Certbot for HTTPS

### References
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

---

## 10. Accessibility & Internationalization

### Decision
- **Accessibility**: Follow WCAG 2.1 AA standards, use semantic HTML, test with screen readers
- **Internationalization**: Simplified Chinese primary, use `next-intl` for future expansion

### Rationale
1. **Constitutional requirement**: WCAG 2.1 AA compliance mandated
2. **User base**: Primary language is Simplified Chinese
3. **Future-proofing**: Architecture supports adding more languages

### Best Practices
- Use semantic HTML5 elements (`<article>`, `<time>`, `<button>`)
- Add ARIA labels for icon buttons
- Ensure 4.5:1 color contrast ratio
- Test keyboard navigation (tab order, focus indicators)
- Use `lang` attribute for proper screen reader pronunciation
- Implement Chinese date formatting with date-fns locale

### Tools
- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Automated accessibility audit
- **VoiceOver/TalkBack**: Screen reader testing on mobile

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## Summary of Technology Stack

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Framework** | Next.js | 15.x | App Router, RSC, built-in optimizations |
| **Language** | TypeScript | 5.3+ | Type safety, developer experience |
| **Styling** | Tailwind CSS | 3.4+ | Mobile-first, JIT compiler, design tokens |
| **Database** | PostgreSQL | 15+ | ACID compliance, relational model |
| **ORM** | Prisma | 5.x | Type-safe queries, migrations |
| **Image Storage** | Local Filesystem + sharp | - | Self-hosted, image optimization |
| **Date Library** | date-fns | 3.x | Tree-shakeable, i18n support |
| **State Management** | React Context + SWR | - | Simple, server state caching |
| **Forms** | React Hook Form + Zod | 7.x / 3.x | Performance, validation |
| **Testing** | Vitest + RTL + Playwright | - | Fast, modern, comprehensive |
| **Deployment** | Docker + Docker Compose | - | Self-hosted, full control |

---

## Performance Budget Validation

All technology choices support meeting the constitutional performance requirements:

✅ **LCP < 2.5s**: Server Components + static image serving + sharp optimization
✅ **FID < 100ms**: Minimal JavaScript with RSC, hydration optimization
✅ **CLS < 0.1**: `next/image` with dimensions, no layout shifts
✅ **Bundle < 200KB**: Tree-shaking, code splitting, Server Components
✅ **60fps animations**: CSS transforms, will-change, optimized repaints

---

## Next Steps

With all technology decisions finalized, proceed to:
1. **Phase 1**: Create data-model.md (database schema)
2. **Phase 1**: Generate API contracts (OpenAPI specification)
3. **Phase 1**: Write quickstart.md (development setup guide)
4. **Phase 1**: Update agent context with technology stack

All decisions are final and ready for implementation.
