import {
	createBudget,
	getBudgetById,
	getBudgetsByUser,
	getBudgetsByUserAndDate,
	updateBudget,
	deleteBudget,
	deactivateBudget,
	getAllBudgets,
	getTargetsByUser,
} from '@/services/budgetService';
import {
	BudgetRequestDTO,
	BudgetResponseDTO,
	BudgetType,
	BudgetFrequency,
} from '@/types/budget';



// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('budgetService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createBudget', () => {
		it('should create budget successfully', async () => {
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 1000,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const mockResponse: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 1000,
				spent: 0,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: true,
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => mockResponse,
			} as Response);

			const result = await createBudget(budgetRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(budgetRequest),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when creation fails', async () => {
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 1000,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: 'Bad Request',
			} as Response);

			await expect(createBudget(budgetRequest)).rejects.toThrow(
				'Failed to create budget: Bad Request'
			);
		});
	});

	describe('getBudgetById', () => {
		it('should get budget by ID successfully', async () => {
			const mockResponse: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 1000,
				spent: 450,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: true,
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getBudgetById(1);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/1'
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when getting budget fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			} as Response);

			await expect(getBudgetById(1)).rejects.toThrow(
				'Failed to get budget: Not Found'
			);
		});
	});

	describe('getBudgetsByUser', () => {
		it('should get budgets by user successfully', async () => {
			const mockResponse: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 1000,
					spent: 450,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
				{
					budgetId: 2,
					userId: '1',
					categoryId: 2,
					categoryName: 'Transport',
					amount: 500,
					spent: 200,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.TARGET,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getBudgetsByUser('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/user/1'
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when getting budgets fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			await expect(getBudgetsByUser('1')).rejects.toThrow(
				'Failed to get budgets: Internal Server Error'
			);
		});
	});

	describe('getBudgetsByUserAndDate', () => {
		it('should get budgets by user and date successfully', async () => {
			const mockResponse: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 1000,
					spent: 450,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getBudgetsByUserAndDate('1', '2024-01-15');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/user/1/date?date=2024-01-15'
			);
			expect(result).toEqual(mockResponse);
		});

		it('should get budgets by user without date', async () => {
			const mockResponse: BudgetResponseDTO[] = [];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getBudgetsByUserAndDate('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/user/1/date'
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('updateBudget', () => {
		it('should update budget successfully', async () => {
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 1200,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const mockResponse: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 1200,
				spent: 450,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: true,
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await updateBudget(1, budgetRequest);

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/1',
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(budgetRequest),
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when update fails', async () => {
			const budgetRequest: BudgetRequestDTO = {
				userId: '1',
				categoryId: 1,
				amount: 1200,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: 'Forbidden',
			} as Response);

			await expect(updateBudget(1, budgetRequest)).rejects.toThrow(
				'Failed to update budget: Forbidden'
			);
		});
	});

	describe('deleteBudget', () => {
		it('should delete budget successfully', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
			} as Response);

			await expect(deleteBudget(1, '1')).resolves.toBeUndefined();

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/1?userId=1',
				{
					method: 'DELETE',
				}
			);
		});

		it('should throw error when deletion fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			} as Response);

			await expect(deleteBudget(1, '1')).rejects.toThrow(
				'Failed to delete budget: Not Found'
			);
		});
	});

	describe('deactivateBudget', () => {
		it('should deactivate budget successfully', async () => {
			const mockResponse: BudgetResponseDTO = {
				budgetId: 1,
				userId: '1',
				categoryId: 1,
				categoryName: 'Food',
				amount: 1000,
				spent: 450,
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
				active: false,
				createdAt: '2024-01-01T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await deactivateBudget(1, '1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/1/deactivate?userId=1',
				{
					method: 'PUT',
				}
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when deactivation fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			await expect(deactivateBudget(1, '1')).rejects.toThrow(
				'Failed to deactivate budget: Internal Server Error'
			);
		});
	});

	describe('getAllBudgets', () => {
		it('should get all budgets successfully', async () => {
			const mockResponse: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 1000,
					spent: 450,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			} as Response);

			const result = await getAllBudgets();

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets'
			);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error when getting all budgets fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: 'Forbidden',
			} as Response);

			await expect(getAllBudgets()).rejects.toThrow(
				'Failed to get all budgets: Forbidden'
			);
		});
	});

	describe('getTargetsByUser', () => {
		it('should get targets by user successfully', async () => {
			const mockBudgets: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 1000,
					spent: 450,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
				{
					budgetId: 2,
					userId: '1',
					categoryId: 2,
					categoryName: 'Vacation',
					amount: 5000,
					spent: 1000,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.YEARLY,
					type: BudgetType.TARGET,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockBudgets,
			} as Response);

			const result = await getTargetsByUser('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/user/1'
			);
			expect(result).toEqual([
				{
					budgetId: 2,
					userId: '1',
					categoryId: 2,
					categoryName: 'Vacation',
					amount: 5000,
					spent: 1000,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.YEARLY,
					type: BudgetType.TARGET,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			]);
		});

		it('should return empty array when no targets found', async () => {
			const mockBudgets: BudgetResponseDTO[] = [
				{
					budgetId: 1,
					userId: '1',
					categoryId: 1,
					categoryName: 'Food',
					amount: 1000,
					spent: 450,
					startDate: '2024-01-01',
					endDate: '2024-12-31',
					frequency: BudgetFrequency.MONTHLY,
					type: BudgetType.LIMIT,
					active: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockBudgets,
			} as Response);

			const result = await getTargetsByUser('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/budgets/user/1'
			);
			expect(result).toEqual([]);
		});
	});
});
