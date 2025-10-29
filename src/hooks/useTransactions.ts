import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionRequestDTO } from "../types/transaction";
import { createExpenseService, createIncomeService } from "../services/transactionService";

// Query keys
export const transactionKeys = {
    all: ['transactions'] as const,
    lists: () => [...transactionKeys.all, 'list'] as const,
    list: (userId: number, type: 'expense' | 'income') => [...transactionKeys.lists(), userId, type] as const,
    details: () => [...transactionKeys.all, 'detail'] as const,
    detail: (userId: number, id: number) => [...transactionKeys.details(), userId, id] as const,
};

// Hooks for expense transactions
export const useExpenseTransactions = (userId: number) => {
    return useQuery({
        queryKey: transactionKeys.list(userId, 'expense'),
        queryFn: async () => {
            const service = createExpenseService();
            return service.getAll(userId);
        },
        enabled: !!userId,
    });
};

export const useIncomeTransactions = (userId: number) => {
    return useQuery({
        queryKey: transactionKeys.list(userId, 'income'),
        queryFn: async () => {
            const service = createIncomeService();
            return service.getAll(userId);
        },
        enabled: !!userId,
    });
};

export const useRecentTransactions = (userId: number, limit: number = 5) => {
    return useQuery({
        queryKey: [...transactionKeys.lists(), userId, 'recent', limit],
        queryFn: async () => {
            const expenseService = createExpenseService();
            const incomeService = createIncomeService();

            const [expenses, incomes] = await Promise.all([
                expenseService.getAll(userId),
                incomeService.getAll(userId)
            ]);

            return [...expenses, ...incomes]
                .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
                .slice(0, limit);
        },
        enabled: !!userId,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: TransactionRequestDTO) => {
            const service = createExpenseService();
            return service.create(dto);
        },
        onSuccess: () => {
            // Invalidate and refetch expense transactions
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};

export const useCreateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: TransactionRequestDTO) => {
            const service = createIncomeService();
            return service.create(dto);
        },
        onSuccess: () => {
            // Invalidate and refetch income transactions
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: TransactionRequestDTO }) => {
            const service = createExpenseService();
            return service.update(id, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};

export const useUpdateIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: TransactionRequestDTO }) => {
            const service = createIncomeService();
            return service.update(id, dto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, userId }: { id: number; userId: number }) => {
            const service = createExpenseService();
            return service.delete(id, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};

export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, userId }: { id: number; userId: number }) => {
            const service = createIncomeService();
            return service.delete(id, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
        },
    });
};