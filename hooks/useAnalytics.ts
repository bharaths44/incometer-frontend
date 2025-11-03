import { useQuery } from '@tanstack/react-query';
import {
	fetchBudgetAnalytics,
	fetchCategoryBreakdown,
	fetchExpenseSummary,
} from '../services/analyticsService';

// Query keys
export const analyticsKeys = {
	all: ['analytics'] as const,
	categoryBreakdown: (
		userId: number,
		dateRange?: { startDate: string; endDate: string } | null
	) =>
		[...analyticsKeys.all, 'categoryBreakdown', userId, dateRange] as const,
	expenseSummary: (
		userId: number,
		dateRange?: { startDate: string; endDate: string } | null
	) => [...analyticsKeys.all, 'expenseSummary', userId, dateRange] as const,
	budgetAnalytics: (userId: number) =>
		[...analyticsKeys.all, 'budgetAnalytics', userId] as const,
};

// Hooks
export const useCategoryBreakdown = (
	userId: number,
	dateRange?: { startDate: string; endDate: string } | null
) => {
	return useQuery({
		queryKey: analyticsKeys.categoryBreakdown(userId, dateRange),
		queryFn: () => fetchCategoryBreakdown(userId, dateRange),
		enabled: !!userId,
	});
};

export const useExpenseSummary = (
	userId: number,
	dateRange?: { startDate: string; endDate: string } | null
) => {
	return useQuery({
		queryKey: analyticsKeys.expenseSummary(userId, dateRange),
		queryFn: () => fetchExpenseSummary(userId, dateRange),
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
