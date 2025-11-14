import { useQuery } from '@tanstack/react-query';
import {
	fetchBudgetAnalytics,
	fetchCategoryBreakdown,
	fetchExpenseSummary,
} from '@/services/analyticsService';

// Query keys
export const analyticsKeys = {
	all: ['analytics'] as const,
	categoryBreakdown: (
		userId: string,
		dateRange?: { startDate: string; endDate: string } | null
	) =>
		[...analyticsKeys.all, 'categoryBreakdown', userId, dateRange] as const,
	expenseSummary: (
		userId: string,
		dateRange?: { startDate: string; endDate: string } | null
	) => [...analyticsKeys.all, 'expenseSummary', userId, dateRange] as const,
	budgetAnalytics: (userId: string) =>
		[...analyticsKeys.all, 'budgetAnalytics', userId] as const,
};

// Hooks
export const useCategoryBreakdown = (
	userId: string,
	dateRange?: { startDate: string; endDate: string } | null
) => {
	return useQuery({
		queryKey: analyticsKeys.categoryBreakdown(userId, dateRange),
		queryFn: () => fetchCategoryBreakdown(userId, dateRange),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};

export const useExpenseSummary = (
	userId: string,
	dateRange?: { startDate: string; endDate: string } | null
) => {
	return useQuery({
		queryKey: analyticsKeys.expenseSummary(userId, dateRange),
		queryFn: () => fetchExpenseSummary(userId, dateRange),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};

export const useBudgetAnalytics = (userId: string) => {
	return useQuery({
		queryKey: analyticsKeys.budgetAnalytics(userId),
		queryFn: () => fetchBudgetAnalytics(userId),
		enabled: !!userId,
		staleTime: 30000, // Cache for 30 seconds
	});
};
