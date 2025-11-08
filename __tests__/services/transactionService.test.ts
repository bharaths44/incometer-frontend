import {
	TransactionService,
	createExpenseService,
	createIncomeService,
} from '@/services/transactionService';
import {
	TransactionRequestDTO,
	TransactionResponseDTO,
} from '@/types/transaction';

// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('transactionService', () => {
	let expenseService: TransactionService;
	let incomeService: TransactionService;

	beforeEach(() => {
		jest.clearAllMocks();
		expenseService = createExpenseService();
		incomeService = createIncomeService();
	});

	describe('TransactionService', () => {
		describe('create', () => {
			it('should create expense transaction successfully', async () => {
				const transactionRequest: TransactionRequestDTO = {
					userId: '1',
					categoryId: 1,
					amount: 100,
					description: 'Lunch',
					paymentMethodId: 1,
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
				};

				const mockResponse: TransactionResponseDTO = {
					transactionId: 1,
					userUserId: '1',
					category: {
						categoryId: 1,
						name: 'Food',
						icon: 'utensils',
					},
					amount: 100,
					description: 'Lunch',
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Credit Card',
						displayName: 'Visa **** 1234',
						type: 'CREDIT_CARD',
					},
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
					createdAt: '2024-01-15T12:00:00Z',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 201,
					json: async () => mockResponse,
				} as Response);

				const result = await expenseService.create(transactionRequest);

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions',
					{
						method: 'POST',
						body: JSON.stringify({
							userId: '1',
							categoryId: 1,
							amount: 100,
							description: 'Lunch',
							paymentMethodId: 1,
							transactionDate: '2024-01-15',
							transactionType: 'EXPENSE',
						}),
					}
				);
				expect(result).toEqual(mockResponse);
			});

			it('should create income transaction successfully', async () => {
				const transactionRequest: TransactionRequestDTO = {
					userId: '1',
					categoryId: 2,
					amount: 5000,
					description: 'Salary',
					paymentMethodId: 2,
					transactionDate: '2024-01-01',
					transactionType: 'INCOME',
				};

				const mockResponse: TransactionResponseDTO = {
					transactionId: 2,
					userUserId: '1',
					category: {
						categoryId: 2,
						name: 'Salary',
						icon: 'dollar-sign',
					},
					amount: 5000,
					description: 'Salary',
					paymentMethod: {
						paymentMethodId: 2,
						name: 'Bank Transfer',
						displayName: 'Bank Account **** 5678',
						type: 'BANK_ACCOUNT',
					},
					transactionDate: '2024-01-01',
					transactionType: 'INCOME',
					createdAt: '2024-01-01T00:00:00Z',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 201,
					json: async () => mockResponse,
				} as Response);

				const result = await incomeService.create(transactionRequest);

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions',
					{
						method: 'POST',
						body: JSON.stringify({
							userId: '1',
							categoryId: 2,
							amount: 5000,
							description: 'Salary',
							paymentMethodId: 2,
							transactionDate: '2024-01-01',
							transactionType: 'INCOME',
						}),
					}
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw error when creation fails', async () => {
				const transactionRequest: TransactionRequestDTO = {
					userId: '1',
					categoryId: 1,
					amount: 100,
					description: 'Lunch',
					paymentMethodId: 1,
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					text: async () => 'Invalid transaction data',
				} as Response);

				await expect(
					expenseService.create(transactionRequest)
				).rejects.toThrow('Failed to create expense');
			});
		});

		describe('getAll', () => {
			it('should get all expense transactions successfully', async () => {
				const mockResponse: TransactionResponseDTO[] = [
					{
						transactionId: 1,
						userUserId: '1',
						category: {
							categoryId: 1,
							name: 'Food',
							icon: 'utensils',
						},
						amount: 100,
						description: 'Lunch',
						paymentMethod: {
							paymentMethodId: 1,
							name: 'Credit Card',
							displayName: 'Visa **** 1234',
							type: 'CREDIT_CARD',
						},
						transactionDate: '2024-01-15',
						transactionType: 'EXPENSE',
						createdAt: '2024-01-15T12:00:00Z',
					},
				];

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => mockResponse,
				} as Response);

				const result = await expenseService.getAll('1');

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions?userId=1&type=EXPENSE'
				);
				expect(result).toEqual(mockResponse);
			});

			it('should get all income transactions successfully', async () => {
				const mockResponse: TransactionResponseDTO[] = [
					{
						transactionId: 2,
						userUserId: '1',
						category: {
							categoryId: 2,
							name: 'Salary',
							icon: 'dollar-sign',
						},
						amount: 5000,
						description: 'Salary',
						paymentMethod: {
							paymentMethodId: 2,
							name: 'Bank Transfer',
							displayName: 'Bank Account **** 5678',
							type: 'BANK_ACCOUNT',
						},
						transactionDate: '2024-01-01',
						transactionType: 'INCOME',
						createdAt: '2024-01-01T00:00:00Z',
					},
				];

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => mockResponse,
				} as Response);

				const result = await incomeService.getAll('1');

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions?userId=1&type=INCOME'
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw error when getting transactions fails', async () => {
				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
				} as Response);

				await expect(expenseService.getAll('1')).rejects.toThrow(
					'Failed to fetch expenses'
				);
			});
		});

		describe('update', () => {
			it('should update transaction successfully', async () => {
				const transactionRequest: TransactionRequestDTO = {
					userId: '1',
					categoryId: 1,
					amount: 150,
					description: 'Updated Lunch',
					paymentMethodId: 1,
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
				};

				const mockResponse: TransactionResponseDTO = {
					transactionId: 1,
					userUserId: '1',
					category: {
						categoryId: 1,
						name: 'Food',
						icon: 'utensils',
					},
					amount: 150,
					description: 'Updated Lunch',
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Credit Card',
						displayName: 'Visa **** 1234',
						type: 'CREDIT_CARD',
					},
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
					createdAt: '2024-01-15T12:00:00Z',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => mockResponse,
				} as Response);

				const result = await expenseService.update(
					1,
					transactionRequest
				);

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions/1',
					{
						method: 'PUT',
						body: JSON.stringify({
							userId: '1',
							categoryId: 1,
							amount: 150,
							description: 'Updated Lunch',
							paymentMethodId: 1,
							transactionDate: '2024-01-15',
							transactionType: 'EXPENSE',
						}),
					}
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw error when update fails', async () => {
				const transactionRequest: TransactionRequestDTO = {
					userId: '1',
					categoryId: 1,
					amount: 150,
					description: 'Updated Lunch',
					paymentMethodId: 1,
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: false,
					status: 404,
					statusText: 'Not Found',
				} as Response);

				await expect(
					expenseService.update(1, transactionRequest)
				).rejects.toThrow('Failed to update expense');
			});
		});

		describe('delete', () => {
			it('should delete transaction successfully', async () => {
				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 204,
				} as Response);

				await expect(
					expenseService.delete(1, '1')
				).resolves.toBeUndefined();

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions/1/1',
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

				await expect(expenseService.delete(1, '1')).rejects.toThrow(
					'Failed to delete expense'
				);
			});
		});

		describe('getById', () => {
			it('should get transaction by ID successfully', async () => {
				const mockResponse: TransactionResponseDTO = {
					transactionId: 1,
					userUserId: '1',
					category: {
						categoryId: 1,
						name: 'Food',
						icon: 'utensils',
					},
					amount: 100,
					description: 'Lunch',
					paymentMethod: {
						paymentMethodId: 1,
						name: 'Credit Card',
						displayName: 'Visa **** 1234',
						type: 'CREDIT_CARD',
					},
					transactionDate: '2024-01-15',
					transactionType: 'EXPENSE',
					createdAt: '2024-01-15T12:00:00Z',
				};

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => mockResponse,
				} as Response);

				const result = await expenseService.getById('1', 1);

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions/1/1'
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw error when getting transaction by ID fails', async () => {
				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: false,
					status: 404,
					statusText: 'Not Found',
				} as Response);

				await expect(expenseService.getById('1', 1)).rejects.toThrow(
					'Failed to fetch expense'
				);
			});
		});

		describe('getByDateRange', () => {
			it('should get transactions by date range successfully', async () => {
				const mockResponse: TransactionResponseDTO[] = [
					{
						transactionId: 1,
						userUserId: '1',
						category: {
							categoryId: 1,
							name: 'Food',
							icon: 'utensils',
						},
						amount: 100,
						description: 'Lunch',
						paymentMethod: {
							paymentMethodId: 1,
							name: 'Credit Card',
							displayName: 'Visa **** 1234',
							type: 'CREDIT_CARD',
						},
						transactionDate: '2024-01-15',
						transactionType: 'EXPENSE',
						createdAt: '2024-01-15T12:00:00Z',
					},
				];

				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => mockResponse,
				} as Response);

				const result = await expenseService.getByDateRange(
					'1',
					'2024-01-01',
					'2024-01-31'
				);

				expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
					'http://localhost:8080/api/transactions/1/date-range?startDate=2024-01-01&endDate=2024-01-31&type=EXPENSE'
				);
				expect(result).toEqual(mockResponse);
			});

			it('should throw error when getting transactions by date range fails', async () => {
				mockAuthenticatedFetch.mockResolvedValueOnce({
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
				} as Response);

				await expect(
					expenseService.getByDateRange(
						'1',
						'2024-01-01',
						'2024-01-31'
					)
				).rejects.toThrow('Failed to fetch expenses by date range');
			});
		});
	});

	describe('Factory functions', () => {
		it('should create expense service with correct config', () => {
			const service = createExpenseService();
			expect(service.config.type).toBe('expense');
			expect(service.config.title).toBe('Expenses');
			expect(service.config.api.baseUrl).toBe(
				'http://localhost:8080/api/transactions'
			);
		});

		it('should create income service with correct config', () => {
			const service = createIncomeService();
			expect(service.config.type).toBe('income');
			expect(service.config.title).toBe('Income');
			expect(service.config.api.baseUrl).toBe(
				'http://localhost:8080/api/transactions'
			);
		});
	});
});
