import {
	BudgetRequestDTO,
	BudgetResponseDTO,
	BudgetType,
} from '../types/budget';
import { API_BASE_URL } from '../lib/constants';

// API URLs for budget operations
const BUDGET_API_URLS = {
	baseUrl: `${API_BASE_URL}/budgets`,
	create: `${API_BASE_URL}/budgets`,
	getById: `${API_BASE_URL}/budgets/:id`,
	getByUser: `${API_BASE_URL}/budgets/user/:userId`,
	getByUserAndDate: `${API_BASE_URL}/budgets/user/:userId/date`,
	update: `${API_BASE_URL}/budgets/:id`,
	delete: `${API_BASE_URL}/budgets/:id`,
	deactivate: `${API_BASE_URL}/budgets/:id/deactivate`,
	getAll: `${API_BASE_URL}/budgets`,
};

// Helper function to replace URL parameters
const replaceUrlParams = (
	url: string,
	params: Record<string, string | number>
): string => {
	let result = url;
	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, value.toString());
	});

	return result;
};

// Create a new budget
export const createBudget = async (
	budgetData: BudgetRequestDTO
): Promise<BudgetResponseDTO> => {
	try {
		const response = await fetch(BUDGET_API_URLS.create, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(budgetData),
		});

		if (!response.ok) {
			throw new Error(`Failed to create budget: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error creating budget:', error);
		throw error;
	}
};

// Get budget by ID
export const getBudgetById = async (id: number): Promise<BudgetResponseDTO> => {
	try {
		const url = replaceUrlParams(BUDGET_API_URLS.getById, { id });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to get budget: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting budget:', error);
		throw error;
	}
};

// Get budgets by user ID
export const getBudgetsByUser = async (
	userId: number
): Promise<BudgetResponseDTO[]> => {
	try {
		const url = replaceUrlParams(BUDGET_API_URLS.getByUser, { userId });
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to get budgets: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting budgets by user:', error);
		throw error;
	}
};

// Get budgets by user ID and date
export const getBudgetsByUserAndDate = async (
	userId: number,
	date?: string
): Promise<BudgetResponseDTO[]> => {
	try {
		let url = replaceUrlParams(BUDGET_API_URLS.getByUserAndDate, {
			userId,
		});
		if (date) {
			url += `?date=${date}`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to get budgets: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting budgets by user and date:', error);
		throw error;
	}
};

// Update a budget
export const updateBudget = async (
	id: number,
	budgetData: BudgetRequestDTO
): Promise<BudgetResponseDTO> => {
	try {
		const url = replaceUrlParams(BUDGET_API_URLS.update, { id });
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(budgetData),
		});

		if (!response.ok) {
			throw new Error(`Failed to update budget: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error updating budget:', error);
		throw error;
	}
};

// Delete a budget
export const deleteBudget = async (
	id: number,
	userId: number
): Promise<void> => {
	try {
		const url =
			replaceUrlParams(BUDGET_API_URLS.delete, { id }) +
			`?userId=${userId}`;
		const response = await fetch(url, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(`Failed to delete budget: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error deleting budget:', error);
		throw error;
	}
};

// Deactivate a budget
export const deactivateBudget = async (
	id: number,
	userId: number
): Promise<BudgetResponseDTO> => {
	try {
		const url =
			replaceUrlParams(BUDGET_API_URLS.deactivate, { id }) +
			`?userId=${userId}`;
		const response = await fetch(url, {
			method: 'PUT',
		});

		if (!response.ok) {
			throw new Error(
				`Failed to deactivate budget: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		console.error('Error deactivating budget:', error);
		throw error;
	}
};

// Get all budgets
export const getAllBudgets = async (): Promise<BudgetResponseDTO[]> => {
	try {
		const response = await fetch(BUDGET_API_URLS.getAll);

		if (!response.ok) {
			throw new Error(
				`Failed to get all budgets: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting all budgets:', error);
		throw error;
	}
};

// Get targets by user ID (targets are budgets with type TARGET)
export const getTargetsByUser = async (
	userId: number
): Promise<BudgetResponseDTO[]> => {
	try {
		const budgets = await getBudgetsByUser(userId);
		return budgets.filter((budget) => budget.type === BudgetType.TARGET);
	} catch (error) {
		console.error('Error getting targets by user:', error);
		throw error;
	}
};
