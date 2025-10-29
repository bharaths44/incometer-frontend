import { CategoryAnalytics, BudgetAnalytics, ExpenseSummary } from '../types/analytics';
import { API_BASE_URL } from '@/lib/constants';

const API_BASE_URL_ANALYTICS = `${API_BASE_URL}/analytics`;

export const fetchCategoryBreakdown = async (userId: number): Promise<CategoryAnalytics[]> => {
    const response = await fetch(`${API_BASE_URL_ANALYTICS}/user/${userId}/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
    }
    return response.json();
};

export const fetchExpenseSummary = async (userId: number): Promise<ExpenseSummary> => {
    const response = await fetch(`${API_BASE_URL_ANALYTICS}/user/${userId}/expense-summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch expense summary');
    }
    return response.json();
};

export const fetchBudgetAnalytics = async (userId: number): Promise<BudgetAnalytics[]> => {
    const response = await fetch(`${API_BASE_URL_ANALYTICS}/user/${userId}/budgets`);
    if (!response.ok) {
        throw new Error('Failed to fetch budget analytics');
    }
    return response.json();
};
