import '@testing-library/jest-dom';

// Set test environment variables before importing any modules
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api';

// Mock Next.js router
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
		};
	},
	useSearchParams() {
		return new URLSearchParams();
	},
	usePathname() {
		return '';
	},
}));

// Mock next-themes
jest.mock('next-themes', () => ({
	useTheme: () => ({
		theme: 'light',
		setTheme: jest.fn(),
	}),
}));

// Global test utilities
global.fetch = jest.fn();

// Suppress console methods in tests to reduce noise from expected errors/logs
// Tests still pass/fail correctly, but logs don't clutter output
global.console.error = jest.fn();
global.console.log = jest.fn();
global.console.warn = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});
