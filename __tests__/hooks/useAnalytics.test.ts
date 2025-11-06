import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
	useCategoryBreakdown,
	useExpenseSummary,
	useBudgetAnalytics,
	analyticsKeys,
} from '@/hooks/useAnalytics';
import type {
	CategoryAnalytics,
	ExpenseSummary,
	BudgetAnalytics,
} from '@/types/analytics';

// Mock the analytics service functions
jest.mock('@/services/analyticsService', () => ({
	fetchCategoryBreakdown: jest.fn(),
	fetchExpenseSummary: jest.fn(),
	fetchBudgetAnalytics: jest.fn(),
}));

import {
	fetchCategoryBreakdown,
	fetchExpenseSummary,
	fetchBudgetAnalytics,
} from '@/services/analyticsService';

const mockFetchCategoryBreakdown =
	fetchCategoryBreakdown as jest.MockedFunction<
		typeof fetchCategoryBreakdown
	>;
const mockFetchExpenseSummary = fetchExpenseSummary as jest.MockedFunction<
	typeof fetchExpenseSummary
>;
const mockFetchBudgetAnalytics = fetchBudgetAnalytics as jest.MockedFunction<
	typeof fetchBudgetAnalytics
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

	return ({ children }: { children: React.ReactNode }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children
		);
	};
};

describe('useAnalytics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('analyticsKeys', () => {
		it('should generate correct categoryBreakdown key', () => {
			const key = analyticsKeys.categoryBreakdown('1', {
				startDate: '2024-01-01',
				endDate: '2024-01-31',
			});

			expect(key).toEqual([
				'analytics',
				'categoryBreakdown',
				'1',
				{ startDate: '2024-01-01', endDate: '2024-01-31' },
			]);
		});

		it('should generate correct expenseSummary key', () => {
			const key = analyticsKeys.expenseSummary('1', null);

			expect(key).toEqual(['analytics', 'expenseSummary', '1', null]);
		});

		it('should generate correct budgetAnalytics key', () => {
			const key = analyticsKeys.budgetAnalytics('1');

			expect(key).toEqual(['analytics', 'budgetAnalytics', '1']);
		});
	});

	describe('useCategoryBreakdown', () => {
		it('should fetch category breakdown successfully', async () => {
			const mockData: CategoryAnalytics[] = [
				{
					categoryName: 'Food',
					totalSpent: 500,
					percentageOfTotal: 50,
				},
				{
					categoryName: 'Transport',
					totalSpent: 300,
					percentageOfTotal: 30,
				},
			];

			mockFetchCategoryBreakdown.mockResolvedValueOnce(mockData);

			const { result } = renderHook(
				() =>
					useCategoryBreakdown('1', {
						startDate: '2024-01-01',
						endDate: '2024-01-31',
					}),
				{ wrapper: createWrapper() }
			);

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockData);
			expect(mockFetchCategoryBreakdown).toHaveBeenCalledWith('1', {
				startDate: '2024-01-01',
				endDate: '2024-01-31',
			});
		});

		it('should handle error when fetching category breakdown fails', async () => {
			const error = new Error('Failed to fetch');
			mockFetchCategoryBreakdown.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCategoryBreakdown('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useCategoryBreakdown(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockFetchCategoryBreakdown).not.toHaveBeenCalled();
		});
	});

	describe('useExpenseSummary', () => {
		it('should fetch expense summary successfully', async () => {
			const mockData: ExpenseSummary = {
				totalIncome: 5000,
				totalExpense: 3200,
				netSavings: 1800,
				currentMonthExpense: 800,
				currentMonthIncome: 4000,
				incomePercentageChange: 5.2,
				expensePercentageChange: -2.1,
				savingsPercentageChange: 15.3,
			};

			mockFetchExpenseSummary.mockResolvedValueOnce(mockData);

			const { result } = renderHook(
				() =>
					useExpenseSummary('1', {
						startDate: '2024-01-01',
						endDate: '2024-01-31',
					}),
				{ wrapper: createWrapper() }
			);

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockData);
			expect(mockFetchExpenseSummary).toHaveBeenCalledWith('1', {
				startDate: '2024-01-01',
				endDate: '2024-01-31',
			});
		});

		it('should handle error when fetching expense summary fails', async () => {
			const error = new Error('Network error');
			mockFetchExpenseSummary.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useExpenseSummary('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useExpenseSummary(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockFetchExpenseSummary).not.toHaveBeenCalled();
		});
	});

	describe('useBudgetAnalytics', () => {
		it('should fetch budget analytics successfully', async () => {
			const mockData: BudgetAnalytics[] = [
				{
					categoryName: 'Food',
					spent: 450,
					limit: 500,
					remaining: 50,
					usagePercentage: 90,
					exceeded: false,
				},
				{
					categoryName: 'Transport',
					spent: 320,
					limit: 300,
					remaining: -20,
					usagePercentage: 106.7,
					exceeded: true,
				},
			];

			mockFetchBudgetAnalytics.mockResolvedValueOnce(mockData);

			const { result } = renderHook(() => useBudgetAnalytics('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockData);
			expect(mockFetchBudgetAnalytics).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching budget analytics fails', async () => {
			const error = new Error('Server error');
			mockFetchBudgetAnalytics.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useBudgetAnalytics('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useBudgetAnalytics(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockFetchBudgetAnalytics).not.toHaveBeenCalled();
		});
	});
});
