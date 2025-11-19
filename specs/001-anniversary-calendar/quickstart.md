# Quickstart Guide: Anniversary Calendar

**Feature**: Anniversary Calendar
**Date**: 2025-11-18
**Purpose**: Get the development environment up and running in < 15 minutes

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x LTS or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.x or higher (Install: `npm install -g pnpm`)
- **Git**: For version control
- **Docker**: v24+ and Docker Compose v2+ ([Download](https://www.docker.com/))
- **PostgreSQL**: v15+ (local for development, Docker for production)
- **Code editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma
  - Docker

**Verify installations**:
```bash
node --version  # Should be v20.x+
pnpm --version  # Should be v8.x+
git --version   # Any recent version
docker --version  # Should be v24.x+
docker-compose --version  # Should be v2.x+
```

---

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Navigate to project directory
cd D:\Code\my_lover

# Install dependencies
pnpm install

# This will install:
# - Next.js 15
# - React 18
# - TypeScript
# - Tailwind CSS
# - Prisma
# - All other dependencies
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/my_lover"
NODE_ENV="development"
```

**For production (Docker)**:
- **DATABASE_URL**: PostgreSQL connection string
  - Development: `postgresql://postgres:password@localhost:5432/my_lover`
  - Docker: `postgresql://postgres:password@postgres:5432/my_lover` (using service name)

Create `.env.production` for Docker deployment with your secure credentials.

### 3. Initialize Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations (creates database schema)
pnpm prisma migrate dev --name init

# Seed database with sample data (optional)
pnpm prisma db seed
```

### 4. Start Development Server

```bash
# Start Next.js dev server
pnpm dev

# Server will start at http://localhost:3000
# API routes available at http://localhost:3000/api/*
```

**You're ready!** Open http://localhost:3000 in your browser.

---

## Project Structure Overview

```
my_lover/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page (timeline view)
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── api/            # API routes
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   └── features/       # Feature components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities & helpers
│   ├── styles/             # Design tokens
│   └── types/              # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Seed data
├── tests/                  # Test files
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

---

## Common Development Tasks

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Run type checking
pnpm type-check
```

### Linting & Formatting

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

### Database Management

```bash
# Open Prisma Studio (GUI for database)
pnpm prisma studio

# Create a new migration
pnpm prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Generate Prisma client after schema changes
pnpm prisma generate
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server locally
pnpm start

# Build and start
pnpm build && pnpm start
```

---

## Development Workflow

### 1. Creating a New Component

```bash
# Create component file
touch src/components/features/MyComponent/MyComponent.tsx

# Create test file
touch tests/unit/components/MyComponent.test.tsx
```

**Component template**:
```tsx
// src/components/features/MyComponent/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  // Define props
}

export const MyComponent: FC<MyComponentProps> = (props) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 2. Creating a New API Route

```bash
# Create API route file
touch src/app/api/my-endpoint/route.ts
```

**API route template**:
```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    return NextResponse.json({ data: 'success' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Adding a Database Model

```bash
# Edit prisma/schema.prisma
# Add new model definition

# Create migration
pnpm prisma migrate dev --name add_new_model

# Generate updated Prisma client
pnpm prisma generate
```

### 4. Running Pre-Commit Checks

```bash
# Run all checks before committing
pnpm type-check && pnpm lint && pnpm test && pnpm build
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Or use a different port
pnpm dev --port 3001
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in .env is correct

# Test connection
pnpm prisma db pull
```

### Prisma Client Out of Sync

```bash
# Regenerate Prisma client
pnpm prisma generate

# If still issues, reset and re-migrate
pnpm prisma migrate reset
pnpm prisma migrate dev
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"

# Or run type check
pnpm type-check
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

---

## VS Code Configuration

Create `.vscode/settings.json` for optimal development experience:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` | Yes |
| `NODE_ENV` | Environment | `development` / `production` | Auto-set |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` | No (dev) |

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

```bash
# Run unit tests
pnpm test:unit

# Watch mode
pnpm test:unit --watch
```

**Example test**:
```typescript
// tests/unit/components/MilestoneCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MilestoneCard } from '@/components/features/Timeline/MilestoneCard';

describe('MilestoneCard', () => {
  it('renders milestone title', () => {
    render(<MilestoneCard title="First Date" date="2024-02-14" />);
    expect(screen.getByText('First Date')).toBeInTheDocument();
  });
});
```

### Integration Tests

```bash
# Run integration tests
pnpm test:integration
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
pnpm playwright install

# Run e2e tests
pnpm test:e2e

# Run e2e tests in UI mode (interactive)
pnpm test:e2e --ui

# Run e2e tests in headed mode (see browser)
pnpm test:e2e --headed
```

---

## Database Schema Visualization

Open Prisma Studio to visualize and edit data:

```bash
pnpm prisma studio

# Opens at http://localhost:5555
```

---

## Performance Monitoring

### Core Web Vitals

```bash
# Build and analyze bundle
pnpm build

# Run Lighthouse audit
pnpm lighthouse http://localhost:3000
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build

# Check .next/analyze/ for detailed reports
```

---

## Deployment

### Docker Self-Hosted (Production)

#### 1. Build Docker Image

```bash
# Build production image
docker-compose up -d --build

# Or build manually
docker build -t my-lover-app .
```

#### 2. Run with Docker Compose

```bash
# Start all services (app + database)
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

#### 3. Run Database Migrations in Container

```bash
# Run migrations
docker-compose exec app pnpm prisma migrate deploy

# Seed data (optional)
docker-compose exec app pnpm prisma db seed
```

#### 4. Access Application

- **Application**: http://your-server-ip:3000
- **With Nginx**: http://your-domain.com (after configuring reverse proxy)

#### 5. Environment Setup

Create `.env.production`:

```bash
DATABASE_URL=postgresql://postgres:secure_password@postgres:5432/my_lover
NODE_ENV=production
```

Create `docker-compose.yml` (see Docker Configuration Files section below).

#### 6. Backup & Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres my_lover > backup.sql

# Backup uploaded images
tar -czf uploads_backup.tar.gz public/uploads/

# Restore database
docker-compose exec -T postgres psql -U postgres my_lover < backup.sql

# Restore images
tar -xzf uploads_backup.tar.gz
```

#### 7. Update Deployment

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Run migrations
docker-compose exec app pnpm prisma migrate deploy
```

### Nginx Reverse Proxy (Optional but Recommended)

Create `/etc/nginx/sites-available/my-lover`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/my-lover /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

## Next Steps

After completing the quickstart:

1. **Explore the codebase**: Start with `src/app/page.tsx`
2. **Review the spec**: Read `specs/001-anniversary-calendar/spec.md`
3. **Check the plan**: Read `specs/001-anniversary-calendar/plan.md`
4. **Run tests**: Ensure everything works with `pnpm test`
5. **Start implementing**: Follow tasks in `specs/001-anniversary-calendar/tasks.md` (generated via `/speckit.tasks`)

---

## Getting Help

- **Documentation**: Check `/specs/001-anniversary-calendar/` folder
- **Constitution**: Review `.specify/memory/constitution.md` for coding standards
- **API Reference**: See `contracts/api-spec.yaml` for API documentation
- **Research**: Read `research.md` for technology decisions

---

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Build production bundle |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `test` | `vitest` | Run all tests |
| `test:unit` | `vitest --dir tests/unit` | Run unit tests |
| `test:integration` | `vitest --dir tests/integration` | Run integration tests |
| `test:e2e` | `playwright test` | Run e2e tests |
| `type-check` | `tsc --noEmit` | Check TypeScript types |
| `format` | `prettier --write .` | Format code |
| `prisma:studio` | `prisma studio` | Open Prisma Studio |
| `prisma:generate` | `prisma generate` | Generate Prisma client |
| `prisma:migrate` | `prisma migrate dev` | Run migrations |

---

## Constitutional Compliance Checklist

Before committing code, ensure:

- [ ] TypeScript strict mode passes (`pnpm type-check`)
- [ ] ESLint passes with zero errors (`pnpm lint`)
- [ ] Prettier formatting applied (`pnpm format`)
- [ ] All tests pass (`pnpm test`)
- [ ] Mobile-first responsive design (test at 320px width)
- [ ] WCAG 2.1 AA accessibility (run axe DevTools)
- [ ] Components are self-contained and testable
- [ ] No code duplication (DRY principle)

---

**You're all set!** Start the dev server with `pnpm dev` and begin implementing the Anniversary Calendar features. 🎉
