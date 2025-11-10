import { fetchUserStats } from '@/services/userService';
import { UserStats } from '@/types/user';
import { API_BASE_URL } from '@/lib/constants';

// Mock the authenticatedFetch function
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

import { authenticatedFetch } from '@/lib/authFetch';

const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<
	typeof authenticatedFetch
>;

describe('userService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('fetchUserStats', () => {
		it('should fetch user statistics successfully', async () => {
			const mockData: UserStats = {
				userId: '1',
				userName: 'John Doe',
				userEmail: 'john@example.com',
				accountCreatedAt: '2023-01-01T00:00:00Z',
				totalTransactions: 150,
				totalExpenses: 100,
				totalIncome: 50,
				totalExpenseAmount: 25000,
				totalIncomeAmount: 50000,
				firstTransactionDate: '2023-01-15T00:00:00Z',
			};

			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData,
			} as Response);

			const result = await fetchUserStats('1');

			expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/users/1/stats`
			);
			expect(result).toEqual(mockData);
		});

		it('should throw error when API call fails', async () => {
			mockAuthenticatedFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			} as Response);

			await expect(fetchUserStats('1')).rejects.toThrow(
				'Failed to fetch user statistics'
			);
		});
	});
});
