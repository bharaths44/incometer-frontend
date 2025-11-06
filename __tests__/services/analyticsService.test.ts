import {
	fetchCategoryBreakdown,
	fetchExpenseSummary,
	fetchBudgetAnalytics,
} from '@/services/analyticsService';
import {
	CategoryAnalytics,
	ExpenseSummary,
	BudgetAnalytics,
} from '@/types/analytics';

// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('analyticsService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('fetchCategoryBreakdown', () => {
		it('should fetch category breakdown without date range', async () => {
			const mockData: CategoryAnalytics[] = [
				{
					categoryName: 'Food',
					totalSpent: 500,
					percentageOfTotal: 40,
				},
				{
					categoryName: 'Transport',
					totalSpent: 300,
					percentageOfTotal: 24,
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchCategoryBreakdown('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/analytics/user/1/categories'
			);
			expect(result).toEqual(mockData);
		});

		it('should fetch category breakdown with date range', async () => {
			const mockData: CategoryAnalytics[] = [
				{
					categoryName: 'Food',
					totalSpent: 200,
					percentageOfTotal: 50,
				},
			];

			const dateRange = {
				startDate: '2024-01-01',
				endDate: '2024-01-31',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchCategoryBreakdown('1', dateRange);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/analytics/user/1/categories?startDate=2024-01-01&endDate=2024-01-31'
			);
			expect(result).toEqual(mockData);
		});

		it('should throw error when fetch fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			} as Response);

			await expect(fetchCategoryBreakdown('1')).rejects.toThrow(
				'Failed to fetch category analytics'
			);
		});
	});

	describe('fetchExpenseSummary', () => {
		it('should fetch expense summary without date range', async () => {
			const mockData: ExpenseSummary = {
				totalIncome: 5000,
				totalExpense: 3500,
				netSavings: 1500,
				currentMonthExpense: 1200,
				currentMonthIncome: 4000,
				incomePercentageChange: 5.2,
				expensePercentageChange: -2.1,
				savingsPercentageChange: 15.8,
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchExpenseSummary('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/analytics/user/1/expense-summary'
			);
			expect(result).toEqual(mockData);
		});

		it('should fetch expense summary with date range', async () => {
			const mockData: ExpenseSummary = {
				totalIncome: 3000,
				totalExpense: 2000,
				netSavings: 1000,
				currentMonthExpense: 800,
				currentMonthIncome: 2500,
				incomePercentageChange: null,
				expensePercentageChange: null,
				savingsPercentageChange: null,
			};

			const dateRange = {
				startDate: '2024-01-01',
				endDate: '2024-01-31',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchExpenseSummary('1', dateRange);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/analytics/user/1/expense-summary?startDate=2024-01-01&endDate=2024-01-31'
			);
			expect(result).toEqual(mockData);
		});

		it('should throw error when fetch fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			} as Response);

			await expect(fetchExpenseSummary('1')).rejects.toThrow(
				'Failed to fetch expense summary'
			);
		});
	});

	describe('fetchBudgetAnalytics', () => {
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
					spent: 600,
					limit: 500,
					remaining: -100,
					usagePercentage: 120,
					exceeded: true,
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchBudgetAnalytics('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/analytics/user/1/budgets'
			);
			expect(result).toEqual(mockData);
		});

		it('should throw error when fetch fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
			} as Response);

			await expect(fetchBudgetAnalytics('1')).rejects.toThrow(
				'Failed to fetch budget analytics'
			);
		});
	});
});
