# Incometer Frontend - AI Coding Guidelines

## Architecture Overview
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query for server state, React useState for UI state
- **Routing**: Custom page-based routing (no React Router) - pages managed in `App.tsx` with string-based navigation
- **UI**: shadcn/ui components on Radix UI primitives + Tailwind CSS + Lucide icons

## Key Patterns & Conventions

### Data Layer
- **Services**: Class-based services in `/services/` with DTO mapping between API and internal types
- **Hooks**: TanStack Query hooks in `/hooks/` with structured query keys (see `useTransactions.ts`)
- **Types**: Strict TypeScript interfaces in `/types/` with separate Request/Response DTOs
- **API Pattern**: Services handle API calls, hooks manage caching/invalidation

### Component Structure
- **Pages**: Feature pages in `/pages/` using composition of components
- **Components**: Feature components in `/components/{feature}/`, UI primitives in `/components/ui/`
- **Layout**: Single `Layout.tsx` component with navigation state passed via props

### Styling & UI
- **Design System**: shadcn/ui "new-york" style with zinc color scheme
- **Currency**: Indian Rupee (₹) hardcoded throughout
- **Gradients**: Custom green-to-emerald gradients for branding
- **Icons**: Lucide React icons with consistent 4-6h sizing

### Development Workflow
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
```

### Critical Implementation Details

#### Authentication & User Context
- User ID hardcoded as `1` throughout (TODO: replace with auth context)
- Authentication state managed in `App.tsx` root component

#### Transaction Management
- Separate services for expenses vs income (`createExpenseService()` vs `createIncomeService()`)
- Transactions fetched via parallel queries in `useRecentTransactions()`
- Date sorting: newest first using `transactionDate`

#### Analytics Data Flow
- Analytics hooks (`useAnalytics.ts`) compute derived data from transaction services
- Budget tracking compares category spending against limits
- Financial health score calculated from expense-to-income ratios

#### Form Handling
- React Hook Form with Zod validation
- Category/payment method selection via modals
- Date handling with `react-day-picker`

### File Organization Examples
```
# Add new transaction type
1. Add to `types/transaction.ts`
2. Create service method in `services/transactionService.ts`
3. Add hook in `hooks/useTransactions.ts`
4. Update form in `components/transaction/TransactionForm.tsx`

# Add analytics metric
1. Define type in `types/analytics.ts`
2. Add computation in `hooks/useAnalytics.ts`
3. Create component in `components/analytics/`
4. Add to `pages/Analytics.tsx` grid
```

### Common Gotchas
- **Query Keys**: Always use structured keys like `transactionKeys.list(userId, 'expense')`
- **Service Instantiation**: Use factory functions like `createExpenseService()` not `new TransactionService()`
- **Currency Display**: Always format as `₹{amount}` with Indian Rupee symbol
- **Loading States**: Check multiple loading flags: `categoryLoading || expenseLoading || budgetLoading`
- **Navigation**: Use string page IDs, not routes: `onNavigate('dashboard')`

### External Dependencies
- **Supabase**: Database and auth - check connection strings in services
- **TanStack Query**: Cache invalidation required after mutations
- **Radix UI**: Accessible primitives - prefer over custom implementations
- **Tailwind**: Custom gradients defined inline, not in config</content>
<parameter name="filePath">/Users/bharaths/Developer/incometer-frontend/.github/copilot-instructions.md