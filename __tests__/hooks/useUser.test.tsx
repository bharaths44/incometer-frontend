import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUserStats, userKeys } from '@/hooks/useUser';
import type { UserStats } from '@/types/user';

// Mock the user service functions
jest.mock('@/services/userService', () => ({
	fetchUserStats: jest.fn(),
}));

import { fetchUserStats } from '@/services/userService';

const mockFetchUserStats = fetchUserStats as jest.MockedFunction<
	typeof fetchUserStats
>;

// Create a test wrapper with QueryClient
const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const TestWrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);

	TestWrapper.displayName = 'TestWrapper';

	return TestWrapper;
};

describe('useUser', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('useUserStats', () => {
		it('should return user stats data when successful', async () => {
			const mockData: UserStats = {
				userId: '1',
				userName: 'John Doe',
				userEmail: 'john@example.com',
				accountCreatedAt: '2023-01-01T00:00:00Z',
				totalTransactions: 150,
				totalExpenses: 100,
				totalIncome: 50,
				totalExpenseAmount: 25000,
				totalIncomeAmount: 50000,
				firstTransactionDate: '2023-01-15T00:00:00Z',
			};

			mockFetchUserStats.mockResolvedValueOnce(mockData);

			const { result } = renderHook(() => useUserStats('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData);
			expect(result.current.error).toBe(null);
			expect(mockFetchUserStats).toHaveBeenCalledWith('1');
		});

		it('should handle error state', async () => {
			const errorMessage = 'Failed to fetch user statistics';
			mockFetchUserStats.mockRejectedValueOnce(new Error(errorMessage));

			const { result } = renderHook(() => useUserStats('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toBe(undefined);
			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe(errorMessage);
		});

		it('should not fetch when userId is empty', () => {
			const { result } = renderHook(() => useUserStats(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(false);
			expect(result.current.data).toBe(undefined);
			expect(mockFetchUserStats).not.toHaveBeenCalled();
		});
	});

	describe('userKeys', () => {
		it('should generate correct query keys', () => {
			expect(userKeys.all).toEqual(['user']);
			expect(userKeys.stats('1')).toEqual(['user', 'stats', '1']);
		});
	});
});
