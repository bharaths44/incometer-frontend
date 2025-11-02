import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionRequestDTO } from '@/types/transaction';
import {
	createExpenseService,
	createIncomeService,
	TransactionService,
} from '@/services/transactionService';
import { analyticsKeys } from './useAnalytics';
// Query keys
export const transactionKeys = {
	all: ['transactions'] as const,
	lists: () => [...transactionKeys.all, 'list'] as const,
	list: (userId: number, type: 'expense' | 'income') =>
		[...transactionKeys.lists(), userId, type] as const,
	details: () => [...transactionKeys.all, 'detail'] as const,
	detail: (userId: number, id: number) =>
		[...transactionKeys.details(), userId, id] as const,
};

// Generic transaction query hook
const useTransactions = (userId: number, type: 'expense' | 'income') => {
	return useQuery({
		queryKey: transactionKeys.list(userId, type),
		queryFn: async () => {
			const service =
				type === 'expense'
					? createExpenseService()
					: createIncomeService();
			return service.getAll(userId);
		},
		enabled: !!userId,
	});
};

// Generic mutation hooks
const useCreateTransactionMutation = (
	createService: () => TransactionService
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (dto: TransactionRequestDTO) => {
			const service = createService();
			return service.create(dto);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: analyticsKeys.all,
			});
		},
	});
};

const useUpdateTransactionMutation = (
	createService: () => TransactionService
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			dto,
		}: {
			id: number;
			dto: TransactionRequestDTO;
		}) => {
			const service = createService();
			return service.update(id, dto);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: analyticsKeys.all,
			});
		},
	});
};

const useDeleteTransactionMutation = (
	createService: () => TransactionService
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, userId }: { id: number; userId: number }) => {
			const service = createService();
			return service.delete(id, userId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: analyticsKeys.all,
			});
		},
	});
};

// Hooks for expense transactions
export const useExpenseTransactions = (userId: number) => {
	return useTransactions(userId, 'expense');
};

export const useIncomeTransactions = (userId: number) => {
	return useTransactions(userId, 'income');
};

export const useRecentTransactions = (userId: number, limit: number = 5) => {
	return useQuery({
		queryKey: [...transactionKeys.lists(), userId, 'recent', limit],
		queryFn: async () => {
			const expenseService = createExpenseService();
			const incomeService = createIncomeService();

			const [expenses, incomes] = await Promise.all([
				expenseService.getAll(userId),
				incomeService.getAll(userId),
			]);

			return [...expenses, ...incomes]
				.sort(
					(a, b) =>
						new Date(b.transactionDate).getTime() -
						new Date(a.transactionDate).getTime()
				)
				.slice(0, limit);
		},
		enabled: !!userId,
	});
};

export const useCreateExpense = () => {
	return useCreateTransactionMutation(createExpenseService);
};

export const useCreateIncome = () => {
	return useCreateTransactionMutation(createIncomeService);
};

export const useUpdateExpense = () => {
	return useUpdateTransactionMutation(createExpenseService);
};

export const useUpdateIncome = () => {
	return useUpdateTransactionMutation(createIncomeService);
};

export const useDeleteExpense = () => {
	return useDeleteTransactionMutation(createExpenseService);
};

export const useDeleteIncome = () => {
	return useDeleteTransactionMutation(createIncomeService);
};
