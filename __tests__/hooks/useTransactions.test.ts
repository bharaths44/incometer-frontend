import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
	useExpenseTransactions,
	useIncomeTransactions,
	useRecentTransactions,
	useCreateExpense,
	useCreateIncome,
	useUpdateExpense,
	useUpdateIncome,
	useDeleteExpense,
	useDeleteIncome,
	transactionKeys,
} from '@/hooks/useTransactions';
import type {
	TransactionResponseDTO,
	TransactionRequestDTO,
} from '@/types/transaction';

// Mock the transaction service
jest.mock('@/services/transactionService', () => ({
	createExpenseService: jest.fn(),
	createIncomeService: jest.fn(),
}));

import {
	createExpenseService,
	createIncomeService,
} from '@/services/transactionService';

const mockCreateExpenseService = createExpenseService as jest.MockedFunction<
	typeof createExpenseService
>;
const mockCreateIncomeService = createIncomeService as jest.MockedFunction<
	typeof createIncomeService
>;

// Mock service instances
const mockExpenseService = {
	getAll: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	getByDateRange: jest.fn(),
};

const mockIncomeService = {
	getAll: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	getById: jest.fn(),
	getByDateRange: jest.fn(),
};

mockCreateExpenseService.mockReturnValue(mockExpenseService as any);
mockCreateIncomeService.mockReturnValue(mockIncomeService as any);

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

describe('useTransactions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('transactionKeys', () => {
		it('should generate correct list key', () => {
			const key = transactionKeys.list('1', 'expense');
			expect(key).toEqual(['transactions', 'list', '1', 'expense']);
		});

		it('should generate correct detail key', () => {
			const key = transactionKeys.detail('1', 123);
			expect(key).toEqual(['transactions', 'detail', '1', 123]);
		});
	});

	describe('useExpenseTransactions', () => {
		it('should fetch expense transactions successfully', async () => {
			const mockTransactions: TransactionResponseDTO[] = [
				{
					transactionId: 1,
					userUserId: '1',
					amount: 50,
					description: 'Lunch',
					transactionDate: '2024-01-01',
					transactionType: 'EXPENSE',
					createdAt: '2024-01-01T12:00:00Z',
					category: { categoryId: 1, name: 'Food', icon: 'utensils' },
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Cash',
						displayName: 'Cash',
						type: 'CASH',
					},
				},
			];

			mockExpenseService.getAll.mockResolvedValueOnce(mockTransactions);

			const { result } = renderHook(() => useExpenseTransactions('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransactions);
			expect(mockExpenseService.getAll).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching expense transactions fails', async () => {
			const error = new Error('Failed to fetch expenses');
			mockExpenseService.getAll.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useExpenseTransactions('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});

		it('should be disabled when userId is not provided', () => {
			const { result } = renderHook(() => useExpenseTransactions(''), {
				wrapper: createWrapper(),
			});

			expect(result.current.isFetching).toBe(false);
			expect(mockExpenseService.getAll).not.toHaveBeenCalled();
		});
	});

	describe('useIncomeTransactions', () => {
		it('should fetch income transactions successfully', async () => {
			const mockTransactions: TransactionResponseDTO[] = [
				{
					transactionId: 2,
					userUserId: '1',
					amount: 1000,
					description: 'Salary',
					transactionDate: '2024-01-01',
					transactionType: 'INCOME',
					createdAt: '2024-01-01T12:00:00Z',
					category: {
						categoryId: 2,
						name: 'Salary',
						icon: 'dollar-sign',
					},
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Bank',
						displayName: 'Bank Account',
						type: 'BANK_ACCOUNT',
					},
				},
			];

			mockIncomeService.getAll.mockResolvedValueOnce(mockTransactions);

			const { result } = renderHook(() => useIncomeTransactions('1'), {
				wrapper: createWrapper(),
			});

			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransactions);
			expect(mockIncomeService.getAll).toHaveBeenCalledWith('1');
		});

		it('should handle error when fetching income transactions fails', async () => {
			const error = new Error('Failed to fetch incomes');
			mockIncomeService.getAll.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useIncomeTransactions('1'), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useRecentTransactions', () => {
		it('should fetch recent transactions successfully', async () => {
			const mockExpenses: TransactionResponseDTO[] = [
				{
					transactionId: 1,
					userUserId: '1',
					amount: 50,
					description: 'Lunch',
					transactionDate: '2024-01-02',
					transactionType: 'EXPENSE',
					createdAt: '2024-01-02T12:00:00Z',
					category: { categoryId: 1, name: 'Food', icon: 'utensils' },
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Cash',
						displayName: 'Cash',
						type: 'CASH',
					},
				},
			];

			const mockIncomes: TransactionResponseDTO[] = [
				{
					transactionId: 2,
					userUserId: '1',
					amount: 1000,
					description: 'Salary',
					transactionDate: '2024-01-01',
					transactionType: 'INCOME',
					createdAt: '2024-01-01T12:00:00Z',
					category: {
						categoryId: 2,
						name: 'Salary',
						icon: 'dollar-sign',
					},
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Bank',
						displayName: 'Bank Account',
						type: 'BANK_ACCOUNT',
					},
				},
			];

			mockExpenseService.getAll.mockResolvedValueOnce(mockExpenses);
			mockIncomeService.getAll.mockResolvedValueOnce(mockIncomes);

			const { result } = renderHook(() => useRecentTransactions('1', 5), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toHaveLength(2);
			expect(result.current.data?.[0].transactionDate).toBe('2024-01-02'); // Most recent first
			expect(result.current.data?.[1].transactionDate).toBe('2024-01-01');
		});

		it('should limit results to specified limit', async () => {
			const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
				transactionId: i + 1,
				userUserId: '1',
				amount: 100,
				description: `Transaction ${i + 1}`,
				transactionDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
				category: {
					categoryId: 1,
					name: 'Test',
					icon: 'test',
					type: 'EXPENSE' as const,
				},
				paymentMethod: {
					paymentMethodId: 1,
					name: 'Cash',
					type: 'CASH' as const,
				},
			}));

			mockExpenseService.getAll.mockResolvedValueOnce(mockTransactions);
			mockIncomeService.getAll.mockResolvedValueOnce([]);

			const { result } = renderHook(() => useRecentTransactions('1', 3), {
				wrapper: createWrapper(),
			});

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toHaveLength(3);
		});
	});

	describe('useCreateExpense', () => {
		it('should create expense successfully', async () => {
			const transactionRequest: TransactionRequestDTO = {
				userId: '1',
				amount: 25.5,
				description: 'Coffee',
				transactionDate: '2024-01-01',
				categoryId: 1,
				paymentMethodId: 1,
				transactionType: 'EXPENSE',
			};

			const mockTransaction: TransactionResponseDTO = {
				transactionId: 3,
				userUserId: '1',
				amount: 25.5,
				description: 'Coffee',
				transactionDate: '2024-01-01',
				transactionType: 'EXPENSE',
				createdAt: '2024-01-01T12:00:00Z',
				category: { categoryId: 1, name: 'Food', icon: 'utensils' },
				paymentMethod: {
					paymentMethodId: 1,
					name: 'Cash',
					displayName: 'Cash',
					type: 'CASH',
				},
			};

			mockExpenseService.create.mockResolvedValueOnce(mockTransaction);

			const { result } = renderHook(() => useCreateExpense(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(transactionRequest);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransaction);
			expect(mockExpenseService.create).toHaveBeenCalledWith(
				transactionRequest
			);
		});

		it('should handle error when creating expense fails', async () => {
			const error = new Error('Failed to create expense');
			const transactionRequest: TransactionRequestDTO = {
				userId: '1',
				amount: 100,
				description: 'Test',
				transactionDate: '2024-01-01',
				categoryId: 1,
				paymentMethodId: 1,
				transactionType: 'EXPENSE',
			};

			mockExpenseService.create.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useCreateExpense(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(transactionRequest);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useCreateIncome', () => {
		it('should create income successfully', async () => {
			const transactionRequest: TransactionRequestDTO = {
				userId: '1',
				amount: 5000,
				description: 'Freelance work',
				transactionDate: '2024-01-01',
				categoryId: 2,
				paymentMethodId: 1,
				transactionType: 'INCOME',
			};

			const mockTransaction: TransactionResponseDTO = {
				transactionId: 4,
				userUserId: '1',
				amount: 5000,
				description: 'Freelance work',
				transactionDate: '2024-01-01',
				transactionType: 'INCOME',
				createdAt: '2024-01-01T12:00:00Z',
				category: {
					categoryId: 2,
					name: 'Freelance',
					icon: 'briefcase',
				},
				paymentMethod: {
					paymentMethodId: 1,
					name: 'Bank',
					displayName: 'Bank Account',
					type: 'BANK_ACCOUNT',
				},
			};

			mockIncomeService.create.mockResolvedValueOnce(mockTransaction);

			const { result } = renderHook(() => useCreateIncome(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(transactionRequest);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransaction);
			expect(mockIncomeService.create).toHaveBeenCalledWith(
				transactionRequest
			);
		});
	});

	describe('useUpdateExpense', () => {
		it('should update expense successfully', async () => {
			const transactionRequest: TransactionRequestDTO = {
				userId: '1',
				amount: 75.0,
				description: 'Updated lunch',
				transactionDate: '2024-01-01',
				categoryId: 1,
				paymentMethodId: 1,
				transactionType: 'EXPENSE',
			};

			const mockTransaction: TransactionResponseDTO = {
				transactionId: 1,
				userUserId: '1',
				amount: 75.0,
				description: 'Updated lunch',
				transactionDate: '2024-01-01',
				transactionType: 'EXPENSE',
				createdAt: '2024-01-01T12:00:00Z',
				category: { categoryId: 1, name: 'Food', icon: 'utensils' },
				paymentMethod: {
					paymentMethodId: 1,
					name: 'Cash',
					displayName: 'Cash',
					type: 'CASH',
				},
			};

			mockExpenseService.update.mockResolvedValueOnce(mockTransaction);

			const { result } = renderHook(() => useUpdateExpense(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, dto: transactionRequest });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransaction);
			expect(mockExpenseService.update).toHaveBeenCalledWith(
				1,
				transactionRequest
			);
		});
	});

	describe('useUpdateIncome', () => {
		it('should update income successfully', async () => {
			const transactionRequest: TransactionRequestDTO = {
				userId: '1',
				amount: 3000.0,
				description: 'Updated salary',
				transactionDate: '2024-01-01',
				categoryId: 2,
				paymentMethodId: 1,
				transactionType: 'INCOME',
			};

			const mockTransaction: TransactionResponseDTO = {
				transactionId: 2,
				userUserId: '1',
				amount: 3000.0,
				description: 'Updated salary',
				transactionDate: '2024-01-01',
				transactionType: 'INCOME',
				createdAt: '2024-01-01T12:00:00Z',
				category: {
					categoryId: 2,
					name: 'Salary',
					icon: 'dollar-sign',
				},
				paymentMethod: {
					paymentMethodId: 1,
					name: 'Bank',
					displayName: 'Bank Account',
					type: 'BANK_ACCOUNT',
				},
			};

			mockIncomeService.update.mockResolvedValueOnce(mockTransaction);

			const { result } = renderHook(() => useUpdateIncome(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 2, dto: transactionRequest });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual(mockTransaction);
			expect(mockIncomeService.update).toHaveBeenCalledWith(
				2,
				transactionRequest
			);
		});
	});

	describe('useDeleteExpense', () => {
		it('should delete expense successfully', async () => {
			mockExpenseService.delete.mockResolvedValueOnce(undefined);

			const { result } = renderHook(() => useDeleteExpense(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toBeUndefined();
			expect(mockExpenseService.delete).toHaveBeenCalledWith(1, '1');
		});

		it('should handle error when deleting expense fails', async () => {
			const error = new Error('Failed to delete expense');
			mockExpenseService.delete.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useDeleteExpense(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 1, userId: '1' });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toEqual(error);
		});
	});

	describe('useDeleteIncome', () => {
		it('should delete income successfully', async () => {
			mockIncomeService.delete.mockResolvedValueOnce(undefined);

			const { result } = renderHook(() => useDeleteIncome(), {
				wrapper: createWrapper(),
			});

			result.current.mutate({ id: 2, userId: '1' });

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toBeUndefined();
			expect(mockIncomeService.delete).toHaveBeenCalledWith(2, '1');
		});
	});
});
