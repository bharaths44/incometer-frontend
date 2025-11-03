import {
	BudgetAnalytics,
	CategoryAnalytics,
	ExpenseSummary,
} from '../types/analytics';
import { API_BASE_URL } from '@/lib/constants';

const API_BASE_URL_ANALYTICS = `${API_BASE_URL}/analytics`;

export const fetchCategoryBreakdown = async (
	userId: number,
	dateRange?: { startDate: string; endDate: string } | null
): Promise<CategoryAnalytics[]> => {
	let url = `${API_BASE_URL_ANALYTICS}/user/${userId}/categories`;
	if (dateRange) {
		url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch category analytics');
	}
	return response.json();
};

export const fetchExpenseSummary = async (
	userId: number,
	dateRange?: { startDate: string; endDate: string } | null
): Promise<ExpenseSummary> => {
	let url = `${API_BASE_URL_ANALYTICS}/user/${userId}/expense-summary`;
	if (dateRange) {
		url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch expense summary');
	}
	return response.json();
};

export const fetchBudgetAnalytics = async (
	userId: number
): Promise<BudgetAnalytics[]> => {
	const response = await fetch(
		`${API_BASE_URL_ANALYTICS}/user/${userId}/budgets`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch budget analytics');
	}
	return response.json();
};
