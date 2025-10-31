import { useQuery } from '@tanstack/react-query';
import {
	fetchCategoryBreakdown,
	fetchExpenseSummary,
	fetchBudgetAnalytics,
} from '../services/analyticsService';

// Query keys
export const analyticsKeys = {
	all: ['analytics'] as const,
	categoryBreakdown: (userId: number) =>
		[...analyticsKeys.all, 'categoryBreakdown', userId] as const,
	expenseSummary: (userId: number) =>
		[...analyticsKeys.all, 'expenseSummary', userId] as const,
	budgetAnalytics: (userId: number) =>
		[...analyticsKeys.all, 'budgetAnalytics', userId] as const,
};

// Hooks
export const useCategoryBreakdown = (userId: number) => {
	return useQuery({
		queryKey: analyticsKeys.categoryBreakdown(userId),
		queryFn: () => fetchCategoryBreakdown(userId),
		enabled: !!userId,
	});
};

export const useExpenseSummary = (userId: number) => {
	return useQuery({
		queryKey: analyticsKeys.expenseSummary(userId),
		queryFn: () => fetchExpenseSummary(userId),
		enabled: !!userId,
	});
};

export const useBudgetAnalytics = (userId: number) => {
	return useQuery({
		queryKey: analyticsKeys.budgetAnalytics(userId),
		queryFn: () => fetchBudgetAnalytics(userId),
		enabled: !!userId,
	});
};
