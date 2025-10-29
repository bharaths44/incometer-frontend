import { CategoryAnalytics, BudgetAnalytics, ExpenseSummary } from '../types/analytics';

const API_BASE_URL = 'http://localhost:8080/api/analytics';

export const fetchCategoryBreakdown = async (userId: number): Promise<CategoryAnalytics[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
    }
    return response.json();
};

export const fetchExpenseSummary = async (userId: number): Promise<ExpenseSummary> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/expense-summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch expense summary');
    }
    return response.json();
};

export const fetchBudgetAnalytics = async (userId: number): Promise<BudgetAnalytics[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/budgets`);
    if (!response.ok) {
        throw new Error('Failed to fetch budget analytics');
    }
    return response.json();
};
