<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/bharaths44/incometer-frontend">
    <img src="public/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Incometer Frontend - Expense Tracker</h3>

<p align="center">
    A modern, responsive expense tracking application built with Next.js 16, featuring comprehensive transaction management, analytics, and budgeting tools.
  </p>
</div>

## Built With

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff" alt="shadcn/ui">
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Query">
  <img src="https://img.shields.io/badge/Lucide_React-000000?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React">
  <img src="https://img.shields.io/badge/Simple_Icons-000000?style=for-the-badge&logo=simple-icons&logoColor=white" alt="Simple Icons">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest">
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier">
</p>
</p>

## Features

- **Comprehensive Transaction Management**: Track income and expenses with
  detailed categorization and payment methods
- **Analytics Dashboard**: Visual insights with charts and statistics for
  financial overview
- **Budget Tracking**: Set and monitor budgets with progress indicators
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Data**: TanStack Query for efficient data fetching and caching
- **Form Validation**: Robust form handling with React Hook Form and Zod
  validation
- **Authentication**: JWT and OAuth2 integration (Google login support)
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives
- **Type-Safe Development**: Full TypeScript support with strict type checking

## Tech Stack

- **Frontend Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Component Library**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React with dynamic loading
- **Charts**: Recharts for data visualization
- **Authentication**: NextAuth.js for OAuth2 and JWT
- **Theming**: next-themes for dark/light mode
- **Build Tool**: Turbopack (Next.js built-in)
- **Testing**: Jest with Testing Library
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier

## Prerequisites

- Node.js
- pnpm package manager
- Backend API running

## Installation & Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd incometer-frontend
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**

    Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

    ```

4. **Start the development server**

    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:3000`

## Running the Application

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

## API Integration

This frontend application integrates with the
[Incometer Backend API](https://github.com/bharaths44/incometer-backend):

- **Base URL**: Configurable via `NEXT_PUBLIC_API_BASE_URL` (defaults to
  `http://localhost:8080/api`)
- **Authentication**: JWT tokens and OAuth2 Google login
- **Data Flow**: API → Service Layer → TanStack Query → React Components

### Key Features

- Automatic token refresh
- Request/response interceptors
- Type-safe API calls with TypeScript interfaces
- Optimistic updates and cache invalidation

## Testing

Run the test suite:

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

Tests include:

- Unit tests for utilities and hooks
- Integration tests for services
- Component tests with Testing Library
- Custom hooks testing with TanStack Query

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── auth/              # Authentication pages
│   ├── budget/            # Budget management
│   ├── dashboard/         # Main dashboard
│   ├── expense/           # Expense tracking
│   ├── income/            # Income tracking
│   ├── profile/           # User profile
│   └── settings/          # Application settings
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── transaction/       # Transaction-related components
│   ├── analytics/         # Analytics components
│   └── shared/            # Shared components
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and constants
├── public/                # Static assets
└── __tests__/             # Test files
```

## Authentication

### JWT Authentication

- Login/Register forms with validation
- Automatic token management
- Protected routes with AuthGuard component

### OAuth2 Google Login

- NextAuth.js integration
- Google OAuth2 flow
- Session management and persistence

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
