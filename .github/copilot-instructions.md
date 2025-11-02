# Copilot Instructions for Incometer Frontend

## Project Overview

Next.js 16 financial tracking app (income/expense tracker) using React 19,
TypeScript, TanStack Query, and shadcn/ui components. Backend is a Spring Boot
REST API at `http://localhost:8080/api` (configurable via `.env`).

## Architecture Patterns

### Service Layer Pattern

All API interactions use dedicated service classes with configuration objects:

- `TransactionService` (shared for expenses/income via `createExpenseService()`
  / `createIncomeService()`)
- `categoryService`, `paymentMethodService`, `analyticsService` (plain function
  exports)
- Services map between API DTOs and frontend types
- See `services/transactionService.ts` for the config-driven pattern

### Type-Driven Configuration

The `TransactionConfig` type (in `types/transaction.ts`) drives UI labels, API
endpoints, and form fields:

```typescript
const config = createTransactionConfig('expense'); // or 'income'
```

This eliminates code duplication between expense/income pages. Always extend
this pattern for similar dual-mode features.

### Component Composition Strategy

Transaction pages follow strict separation:

- `TransactionPage.tsx` - Layout orchestration only
- `TransactionPageLogic.tsx` - Custom hook with all state/handlers
- `TransactionFormFields.tsx` - Reusable form UI
- `TransactionTable.tsx`, `TransactionStats.tsx`, etc. - Feature components

**Always extract logic into custom hooks** (`use*` pattern) and keep page
components purely compositional.

### React Query Patterns

- Query keys use factory pattern: `transactionKeys.list(userId, type)`
- Mutations invalidate both transaction and analytics queries
- All data fetching uses TanStack Query (no `useState` for server data)
- See `hooks/useTransactions.ts` for reference implementation

### Hardcoded User ID

**Critical**: User authentication not implemented yet (planned for future). All
pages use `userId = 1` (see `TransactionPageLogic.tsx:29`). When adding new
features requiring userId, follow this pattern consistently until auth is
implemented.

## Tech Stack Specifics

### UI Components (shadcn/ui)

- Use New York style variant with CSS variables (see `components.json`)
- Import from `@/components/ui/*` - these are pre-configured Radix primitives
- Form components use `react-hook-form` + `zod` validation
- Theme toggling via `next-themes` (see `components/theme-provider.tsx`)

### Icon System

Dynamic Lucide icon loading via `lib/iconUtils.tsx`:

```typescript
<Icon name="shopping-bag" size={20} />
```

Icons searchable by kebab-case names. Predefined set in `lib/constants.ts`. Use
`getAllLucideIconNames()` for full list.

### Styling

- Tailwind CSS 4.x with `@tailwindcss/postcss`
- Path alias: `@/*` maps to project root
- All app pages require `'use client'` directive (client-side state management)
- Layout components handle responsive sidebar/topbar

## Development Workflow

### Commands

```bash
pnpm dev          # Dev server (port 3000)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm format       # Prettier auto-format
pnpm format:check # Prettier validation
```

### Environment Variables

Set `VITE_API_BASE_URL` in `.env` (defaults to `http://localhost:8080/api` in
`lib/constants.ts`). Note: Using Vite env convention despite being Next.js
project.

### Build Configuration

- TypeScript build errors ignored (`ignoreBuildErrors: true` in
  `next.config.mjs`)
- Images unoptimized for static export compatibility
- App Router mode (Next.js 16 with React 19 RC)

## Common Patterns & Gotchas

### Page Structure

Every app route page:

1. Starts with `'use client'` directive
2. Wraps content in `<AppLayout>` component
3. Uses shared layout components (no inline layout logic)

### Form Handling

- All forms use `react-hook-form` with resolver pattern
- Date fields use `react-day-picker` via shadcn Calendar component
- Category/payment method dropdowns fetch via custom hooks (`useCategories`,
  `usePaymentMethods`)

### API Response Mapping

Services transform API responses to frontend types. Always handle:

- `transactionId` / `categoryId` / `paymentMethodId` fields
- `userUserId` (nested user reference)
- Date strings in ISO format

### Modal/Dialog Pattern

Modals controlled by parent state (`isOpen`, `onClose`). See `TransactionForm`
for reference. Use shadcn `Dialog` component, not custom implementations.

## File Organization

```
app/              # Next.js pages (all 'use client')
components/       # Organized by feature (dashboard, transaction, layout, shared, ui)
hooks/            # Custom React hooks with query key factories
services/         # API service layer
types/            # TypeScript interfaces (DTOs match backend)
lib/              # Utilities (iconUtils, constants, cn helper)
```

## Backend Integration

- Spring Boot REST API with standard JSON responses
- DTOs follow Java naming conventions (e.g., `userUserId`, nested objects)
- Error responses handled via response status checks in services
- No authentication headers required (will be added when auth is implemented)

## Testing & Deployment

- **Testing**: Not currently implemented
- **Deployment**: No specific deployment process configured

## When Adding Features

1. Check if pattern exists in transaction/category/paymentMethod implementations
2. Create service class/functions in `services/`
3. Define TypeScript types in `types/` (match Spring Boot DTOs)
4. Build custom hook in `hooks/` with TanStack Query
5. Create feature components in `components/<feature>/`
6. Add page in `app/` directory using existing page template
7. Update sidebar navigation in `components/layout/sidebar.tsx` if needed
