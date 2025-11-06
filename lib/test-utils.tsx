import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data helpers
export const createMockTransaction = (overrides = {}) => ({
	transactionId: 1,
	amount: 100,
	description: 'Test transaction',
	date: '2024-01-01',
	type: 'expense',
	category: {
		categoryId: 1,
		name: 'Food',
		icon: 'shopping-bag',
		type: 'expense',
	},
	paymentMethod: {
		paymentMethodId: 1,
		name: 'Cash',
		type: 'cash',
	},
	userUserId: 1,
	...overrides,
});

export const createMockCategory = (overrides = {}) => ({
	categoryId: 1,
	name: 'Food',
	icon: 'shopping-bag',
	type: 'expense',
	userUserId: 1,
	...overrides,
});

export const createMockPaymentMethod = (overrides = {}) => ({
	paymentMethodId: 1,
	name: 'Cash',
	type: 'cash',
	userUserId: 1,
	...overrides,
});
