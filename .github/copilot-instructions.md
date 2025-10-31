# Incometer Frontend - AI Coding Guidelines

## Architecture Overview
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query for server state, React useState for UI state
- **Routing**: Custom page-based routing (no React Router) - pages managed in `App.tsx` with string-based navigation
- **UI**: shadcn/ui components on Radix UI primitives + Tailwind CSS + Lucide icons
- **Forms**: React Hook Form with Zod validation
- **AI Assistant**: Built-in ChatBot component with hardcoded responses

## Key Patterns & Conventions

### Code Organization
- **File Splitting**: Always split code into multiple files when components/services become large (>200 lines). Break down by responsibility: types, utilities, components, hooks, services
- **Single Responsibility**: Each file should have one clear purpose and export related functionality

### Data Layer
- **Services**: Class-based services in `/services/` with DTO mapping between API and internal types
- **Hooks**: TanStack Query hooks in `/hooks/` with structured query keys (see `useTransactions.ts`)
- **Types**: Strict TypeScript interfaces in `/types/` with separate Request/Response DTOs
- **API Pattern**: Services handle API calls, hooks manage caching/invalidation
- **Factory Functions**: Use `createExpenseService()` and `createIncomeService()` instead of `new TransactionService()`

### Component Structure
- **Pages**: Feature pages in `/pages/` using composition of components
- **Components**: Feature components in `/components/{feature}/`, UI primitives in `/components/ui/`
- **Layout**: Single `Layout.tsx` component with navigation state passed via props
- **Modals**: Category/payment method selection via dedicated modal components (`NewCategoryModal`, `NewPaymentMethodModal`)

### Styling & UI
- **Design System**: shadcn/ui "new-york" style with zinc color scheme
- **Currency**: Indian Rupee (₹) hardcoded throughout - always format as `₹{amount}`
- **Gradients**: Custom green-to-emerald gradients for branding (`bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30`)
- **Icons**: Lucide React icons with dynamic loading via `Icon` component (kebab-case names like "shopping-bag")
- **Transitions**: Use `page-transition` CSS class for page animations

## Critical Implementation Details

#### Authentication & User Context
- User ID hardcoded as `1` throughout (TODO: replace with auth context)
- Authentication state managed in `App.tsx` root component
- Auth flow: landing → login/signup → dashboard with conditional rendering

#### Transaction Management
- Separate services for expenses vs income (`createExpenseService()` vs `createIncomeService()`)
- Transactions fetched via parallel queries in `useRecentTransactions()`
- Date sorting: newest first using `transactionDate` field
- DTO Mapping: Services handle conversion between API format and internal types

#### Analytics Data Flow
- Analytics hooks (`useAnalytics.ts`) compute derived data from transaction services
- Budget tracking compares category spending against limits
- Financial health score calculated from expense-to-income ratios

#### Form Handling
- React Hook Form with Zod validation schemas
- Category/payment method selection via modals with `NewCategoryModal`/`NewPaymentMethodModal`
- Date handling with `react-day-picker` and `date-fns` formatting
- Icon selection from predefined list with pascal-to-kebab-case conversion

#### Icon System
- Dynamic loading: Convert kebab-case ("shopping-bag") to PascalCase ("ShoppingBag") for Lucide import
- Predefined icons list in `TransactionForm.tsx` for category selection
- Fallback handling for unknown icon names

### Development Workflow
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
```

### File Organization Examples
```
# Add new transaction type
1. Add to `types/transaction.ts` (Request/Response DTOs)
2. Create service method in `services/transactionService.ts`
3. Add hook in `hooks/useTransactions.ts` with structured query keys
4. Update form in `components/transaction/TransactionForm.tsx`

# Add analytics metric
1. Define type in `types/analytics.ts`
2. Add computation in `hooks/useAnalytics.ts`
3. Create component in `components/analytics/`
4. Add to `pages/Analytics.tsx` grid

# Add new icon
1. Add kebab-case name to predefinedIcons array in `TransactionForm.tsx`
2. Icon component handles PascalCase conversion automatically
```

### Common Gotchas
- **Query Keys**: Always use structured keys like `transactionKeys.list(userId, 'expense')`
- **Service Instantiation**: Use factory functions like `createExpenseService()` not `new TransactionService()`
- **Currency Display**: Always format as `₹{amount}` with Indian Rupee symbol
- **Loading States**: Check multiple loading flags: `categoryLoading || expenseLoading || budgetLoading`
- **Navigation**: Use string page IDs, not routes: `onNavigate('dashboard')`
- **User ID**: Hardcoded as `1` - replace with auth context when implementing real auth
- **Date Sorting**: Use `new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()` for newest-first
- **Parallel Queries**: Combine expense/income data with `Promise.all([expenseService.getAll(), incomeService.getAll()])`
- **Modal Selection**: Categories and payment methods require modal components for creation/selection
- **Icon Loading**: Handle async icon loading with loading states and error fallbacks

### External Dependencies
- **Supabase**: Database and auth - check connection strings in services
- **TanStack Query**: Cache invalidation required after mutations
- **Radix UI**: Accessible primitives - prefer over custom implementations
- **Tailwind**: Custom gradients defined inline, not in config
- **Lucide React**: Dynamic icon loading with name conversion
- **React Day Picker**: Date selection with custom formatting
- **React Hook Form + Zod**: Form validation with schema-based validation