import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createBudget,
	deleteBudget,
	getBudgetsByUser,
	updateBudget,
} from '@/services/budgetService';
import { BudgetRequestDTO } from '@/types/budget';

// Query keys
export const budgetKeys = {
	all: ['budgets'] as const,
	lists: () => [...budgetKeys.all, 'list'] as const,
	list: (userId: string) => [...budgetKeys.lists(), userId] as const,
	targets: () => [...budgetKeys.all, 'targets'] as const,
	targetsList: (userId: string) => [...budgetKeys.targets(), userId] as const,
};

// Hooks
export const useBudgets = (userId: string) => {
	return useQuery({
		queryKey: budgetKeys.list(userId),
		queryFn: () => getBudgetsByUser(userId),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};

export const useCreateBudget = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (budget: BudgetRequestDTO) => createBudget(budget),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
			queryClient.invalidateQueries({ queryKey: budgetKeys.targets() });
		},
	});
};

export const useUpdateBudget = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			budget,
		}: {
			id: number;
			budget: BudgetRequestDTO;
		}) => updateBudget(id, budget),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
			queryClient.invalidateQueries({ queryKey: budgetKeys.targets() });
		},
	});
};

export const useDeleteBudget = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, userId }: { id: number; userId: string }) =>
			deleteBudget(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
			queryClient.invalidateQueries({ queryKey: budgetKeys.targets() });
		},
	});
};
