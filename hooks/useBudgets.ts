import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createBudget,
	deleteBudget,
	getBudgetsByUser,
	updateBudget,
} from '../services/budgetService';
import { BudgetRequestDTO } from '../types/budget';

// Query keys
export const budgetKeys = {
	all: ['budgets'] as const,
	lists: () => [...budgetKeys.all, 'list'] as const,
	list: (userId: number) => [...budgetKeys.lists(), userId] as const,
	targets: () => [...budgetKeys.all, 'targets'] as const,
	targetsList: (userId: number) => [...budgetKeys.targets(), userId] as const,
};

// Hooks
export const useBudgets = (userId: number) => {
	return useQuery({
		queryKey: budgetKeys.list(userId),
		queryFn: () => getBudgetsByUser(userId),
		enabled: !!userId,
	});
};

export const useCreateBudget = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createBudget,
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
		mutationFn: ({ id, userId }: { id: number; userId: number }) =>
			deleteBudget(id, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
			queryClient.invalidateQueries({ queryKey: budgetKeys.targets() });
		},
	});
};
