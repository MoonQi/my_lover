<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Constitution Type: MINOR version - Initial constitution creation for Next.js frontend project

Modified Principles:
- N/A (initial creation)

Added Sections:
- Core Principles (5 principles: Component-First, Mobile-First & Responsive, UI Excellence, Code Quality, Test Coverage)
- Development Standards
- Quality Gates
- Governance

Removed Sections:
- N/A (initial creation)

Templates Status:
- ✅ plan-template.md - Constitution Check section present and compatible
- ✅ spec-template.md - User scenarios and requirements structure compatible
- ✅ tasks-template.md - Task organization structure compatible

Follow-up TODOs:
- None - all placeholders filled

Rationale:
This is the initial constitution for a Next.js-based frontend application focused on mobile-first design,
UI excellence, and code quality. The principles emphasize component modularity, responsive design,
aesthetic standards, maintainable code, and comprehensive testing.
-->

# My Lover Constitution

## Core Principles

### I. Component-First Architecture
Every feature MUST be built using reusable, composable React components. Components MUST be:
- **Self-contained**: Each component manages its own state and styling
- **Independently testable**: Can be developed and tested in isolation
- **Well-documented**: Props, states, and usage examples clearly documented
- **Single responsibility**: Each component serves one clear purpose

**Rationale**: Component-first architecture ensures modularity, reusability, and maintainability. It enables parallel development, easier testing, and faster iteration cycles.

### II. Mobile-First & Responsive (NON-NEGOTIABLE)
All UI implementations MUST follow mobile-first design principles:
- **Design from smallest screen up**: Base styles target mobile devices (320px+)
- **Progressive enhancement**: Add complexity for larger screens using breakpoints
- **Touch-friendly**: All interactive elements MUST be at least 44x44px tap targets
- **Responsive typography**: Font sizes and spacing MUST scale appropriately
- **Tested across devices**: MUST verify on iOS Safari, Android Chrome, and desktop browsers

**Rationale**: Mobile-first ensures the application is accessible and performant on all devices. With mobile traffic dominating, this approach is non-negotiable for modern web applications.

### III. UI Excellence & Aesthetics
Visual design and user experience are first-class concerns:
- **Consistent design system**: MUST use a unified design system (colors, typography, spacing, components)
- **Attention to detail**: Micro-interactions, animations, and transitions MUST be purposeful and polished
- **Accessibility**: MUST meet WCAG 2.1 AA standards (semantic HTML, ARIA labels, keyboard navigation, color contrast)
- **Performance**: Visual performance MUST be smooth (60fps animations, optimized images, lazy loading)
- **Typography**: Font choices MUST be intentional and hierarchy MUST be clear

**Rationale**: UI excellence differentiates the product and directly impacts user satisfaction. Aesthetics combined with accessibility ensures inclusive design that delights all users.

### IV. Code Quality & Maintainability
Code MUST be clean, readable, and maintainable:
- **TypeScript strict mode**: MUST use TypeScript with strict type checking enabled
- **Consistent naming**: Variables, functions, and files MUST follow clear naming conventions (camelCase for functions/variables, PascalCase for components)
- **No code duplication**: DRY principle MUST be followed; extract shared logic into hooks or utilities
- **Documented complexity**: Complex logic MUST include explanatory comments
- **ESLint/Prettier**: MUST pass linting and formatting checks before commit

**Rationale**: High code quality reduces technical debt, makes onboarding easier, and prevents bugs. TypeScript provides type safety that catches errors at compile time.

### V. Test Coverage
Testing MUST ensure reliability and confidence in changes:
- **Component tests**: All components MUST have unit tests covering props, states, and user interactions
- **Integration tests**: Critical user journeys MUST have integration tests
- **Visual regression**: Key UI components SHOULD have visual regression tests
- **Performance budgets**: Pages MUST meet performance budgets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

**Rationale**: Comprehensive testing prevents regressions, enables confident refactoring, and ensures consistent user experience. Performance budgets maintain speed as the application grows.

## Development Standards

### Technology Stack Requirements
- **Framework**: Next.js (latest stable version with App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS Modules / Tailwind CSS / styled-components (choose one, document choice)
- **State Management**: React Context / Zustand / Redux Toolkit (choose based on complexity)
- **Testing**: Vitest + React Testing Library (unit/integration), Playwright (e2e)
- **Package Manager**: pnpm (faster and more efficient than npm/yarn)

### File Structure Standards
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
│   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helper functions
├── styles/          # Global styles and design tokens
└── types/           # TypeScript type definitions

tests/
├── unit/            # Component unit tests
├── integration/     # Integration tests
└── e2e/            # End-to-end tests
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`, `NavigationBar.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`, `useLocalStorage.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase with descriptive names (e.g., `UserProfile`, `ApiResponse`)
- **Files**: Match component/function name; test files append `.test.tsx`

### Performance Standards
- **Bundle size**: Initial JavaScript MUST be < 200KB (gzipped)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5 seconds
  - FID (First Input Delay): < 100 milliseconds
  - CLS (Cumulative Layout Shift): < 0.1
- **Images**: MUST use Next.js Image component with appropriate sizes and formats (WebP/AVIF)
- **Code splitting**: MUST use dynamic imports for heavy components

## Quality Gates

### Pre-Commit Checks
All commits MUST pass:
1. **Type checking**: `tsc --noEmit` with zero errors
2. **Linting**: `eslint` with zero errors (warnings acceptable if justified)
3. **Formatting**: `prettier --check` passes
4. **Unit tests**: Relevant component tests pass

### Pre-PR Checks
All pull requests MUST pass:
1. **All tests**: Full test suite passes (unit + integration)
2. **Build**: Production build succeeds without errors
3. **Performance**: Lighthouse scores ≥ 90 (performance, accessibility, best practices)
4. **Visual review**: Screenshots/videos of UI changes included

### Code Review Requirements
PRs MUST receive approval after reviewer verifies:
- **Constitution compliance**: Changes follow all principles
- **Visual quality**: UI meets aesthetic standards
- **Accessibility**: Changes maintain WCAG 2.1 AA compliance
- **Test coverage**: New code includes appropriate tests
- **Documentation**: Complex changes include explanations

## Governance

### Amendment Process
Constitution changes require:
1. **Proposal**: Document proposed change with rationale
2. **Discussion**: Team reviews impact on existing codebase
3. **Approval**: Consensus reached on necessity and implementation
4. **Migration plan**: Document how existing code will be updated
5. **Version bump**: Update version following semantic versioning

### Versioning Policy
- **MAJOR**: Backward incompatible governance changes (e.g., removing a principle, changing core technology)
- **MINOR**: New principles added or significant expansions (e.g., adding security requirements)
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Complexity Justification
Any violations of principles MUST be justified in `plan.md` Complexity Tracking table:
- **What principle is violated**: Reference specific principle
- **Why deviation is necessary**: Concrete technical or business reason
- **What simpler alternative was rejected**: Why standard approach insufficient

### Compliance Review
Constitution compliance is verified at:
- **Planning phase**: Constitution Check in plan.md MUST pass
- **Implementation phase**: Tasks MUST reference relevant principles
- **Code review**: Reviewers MUST verify adherence to principles
- **Post-implementation**: Retrospectives SHOULD identify constitutional improvements

**Version**: 1.0.0 | **Ratified**: 2025-11-18 | **Last Amended**: 2025-11-18
