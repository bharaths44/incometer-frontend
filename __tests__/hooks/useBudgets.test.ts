import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
	useBudgets,
	useCreateBudget,
	useUpdateBudget,
	useDeleteBudget,
	budgetKeys,
} from '@/hooks/useBudgets';
import type { BudgetResponseDTO, BudgetRequestDTO } from '@/types/budget';
import { BudgetFrequency, BudgetType } from '@/types/budget';

// Mock the budget service functions
jest.mock('@/services/budgetService', () => ({
	createBudget: jest.fn(),
	deleteBudget: jest.fn(),
	getBudgetsByUser: jest.fn(),
	updateBudget: jest.fn(),
}));

import {
	createBudget,
	deleteBudget,
	getBudgetsByUser,
	updateBudget,
} from '@/services/budgetService';

const mockCreateBudget = createBudget as jest.MockedFunction<
	typeof createBudget
>;
const mockDeleteBudget = deleteBudget as jest.MockedFunction<
	typeof deleteBudget
>;
const mockGetBudgetsByUser = getBudgetsByUser as jest.MockedFunction<
	typeof getBudgetsByUser
>;
const mockUpdateBudget = updateBudget as jest.MockedFunction<
	typeof updateBudget
>;

// Create a test wrapper with QueryClient
const createWrapper = () => {
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

	const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children
		);
	};

	return Wrapper;
};

describe('useBudgets', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('budgetKeys', () => {
		it('should generate correct list key', () => {
			const key = budgetKeys.list('1');

			expect(key).toEqual(['budgets', 'list', '1']);
		});

		it('should generate correct targetsList key', () => {
			const key = budgetKeys.targetsList('1');

			expect(key).toEqual(['budgets', 'targets', '1']);
		});
	});

	describe('useBudgets', () => {
		it('should fetch budgets successfully', async () => {
			const mockBudgets: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 500,
					spent: 200,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockGetBudgetsByUser.mockResolvedValueOnce(mockBudgets);

			const { result } = renderHook(() => useBudgets('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockBudgets);
			expect(mockGetBudgetsByUser).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching budgets fails', async () => {
			const error = new Error('Failed to fetch budgets');
			mockGetBudgetsByUser.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useBudgets('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useBudgets(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockGetBudgetsByUser).not.toHaveBeenCalled();
		});
	});

	describe('useCreateBudget', () => {
		it('should create budget successfully', async () => {
			const mockBudget: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 500,
				spent: 0,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: true,
				createdAt: '2024-01-01T00:00:00Z',
			};

			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 500,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockCreateBudget.mockResolvedValueOnce(mockBudget);

			const { result } = renderHook(() => useCreateBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(budgetRequest);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockBudget);
			expect(mockCreateBudget).toHaveBeenCalledTimes(1);
			expect(mockCreateBudget).toHaveBeenCalledWith(budgetRequest);
		});

		it('should handle error when creating budget fails', async () => {
			const error = new Error('Failed to create budget');
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 500,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockCreateBudget.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCreateBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(budgetRequest);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useUpdateBudget', () => {
		it('should update budget successfully', async () => {
			const mockBudget: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 600,
				spent: 200,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: true,
				createdAt: '2024-01-01T00:00:00Z',
			};

			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 600,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockUpdateBudget.mockResolvedValueOnce(mockBudget);

			const { result } = renderHook(() => useUpdateBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, budget: budgetRequest });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockBudget);
			expect(mockUpdateBudget).toHaveBeenCalledWith(1, budgetRequest);
		});

		it('should handle error when updating budget fails', async () => {
			const error = new Error('Failed to update budget');
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 600,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockUpdateBudget.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useUpdateBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, budget: budgetRequest });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useDeleteBudget', () => {
		it('should delete budget successfully', async () => {
			mockDeleteBudget.mockResolvedValueOnce(undefined);

			const { result } = renderHook(() => useDeleteBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(mockDeleteBudget).toHaveBeenCalledWith(1, '1');
		});

		it('should handle error when deleting budget fails', async () => {
			const error = new Error('Failed to delete budget');
			mockDeleteBudget.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useDeleteBudget(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});
});
