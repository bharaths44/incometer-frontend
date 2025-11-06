import { authenticatedFetch } from '@/lib/authFetch';
import { SecureStorage } from '@/lib/secureStorage';
import { AuthService } from '@/services/authService';

// Mock dependencies
jest.mock('@/lib/secureStorage');
jest.mock('@/services/authService');

const mockSecureStorage = SecureStorage as jest.Mocked<typeof SecureStorage>;
const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('authenticatedFetch', () => {
	const mockUrl = 'https://api.example.com/test';
	const mockOptions: RequestInit = { method: 'GET' };
	const mockToken = 'mock.jwt.token';
	const mockRefreshToken = 'mock.refresh.token';
	const mockNewToken = 'new.jwt.token';
	const mockNewRefreshToken = 'new.refresh.token';

	beforeEach(() => {
		jest.clearAllMocks();
		// Reset all mocks
		mockSecureStorage.getToken.mockReturnValue(null);
		mockSecureStorage.getRefreshToken.mockReturnValue(null);
		mockSecureStorage.setToken.mockImplementation();
		mockSecureStorage.setRefreshToken.mockImplementation();
		mockSecureStorage.setUser.mockImplementation();
		mockSecureStorage.clearAll.mockImplementation();
	});

	describe('normal requests', () => {
		it('should make request with Authorization header when token exists', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);

			const mockResponse = { status: 200, ok: true } as Response;
			global.fetch = jest.fn().mockResolvedValue(mockResponse);

			const result = await authenticatedFetch(mockUrl, mockOptions);

			expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
				...mockOptions,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${mockToken}`,
				},
			});
			expect(result).toBe(mockResponse);
		});

		it('should make request without Authorization header when no token', async () => {
			const mockResponse = { status: 200, ok: true } as Response;
			global.fetch = jest.fn().mockResolvedValue(mockResponse);

			const result = await authenticatedFetch(mockUrl, mockOptions);

			expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
				...mockOptions,
				headers: {
					'Content-Type': 'application/json',
				},
			});
			expect(result).toBe(mockResponse);
		});

		it('should preserve existing headers', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			const customHeaders = { 'X-Custom': 'value' };
			const optionsWithHeaders = {
				...mockOptions,
				headers: customHeaders,
			};

			const mockResponse = { status: 200, ok: true } as Response;
			global.fetch = jest.fn().mockResolvedValue(mockResponse);

			await authenticatedFetch(mockUrl, optionsWithHeaders);

			expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
				...optionsWithHeaders,
				headers: {
					'Content-Type': 'application/json',
					'X-Custom': 'value',
					Authorization: `Bearer ${mockToken}`,
				},
			});
		});
	});

	describe('token refresh on 401', () => {
		it('should refresh token and retry request on 401 with valid refresh token', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			mockSecureStorage.getRefreshToken.mockReturnValue(mockRefreshToken);

			const mockRefreshResponse = {
				token: mockNewToken,
				refreshToken: mockNewRefreshToken,
				user: {
					userId: '1',
					name: 'Test User',
					email: 'test@example.com',
					phoneNumber: '123-456-7890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			};
			mockAuthService.refresh.mockResolvedValue(mockRefreshResponse);

			const mock401Response = { status: 401 } as Response;
			const mock200Response = { status: 200, ok: true } as Response;

			global.fetch = jest
				.fn()
				.mockResolvedValueOnce(mock401Response) // First call fails
				.mockResolvedValueOnce(mock200Response); // Retry succeeds

			const result = await authenticatedFetch(mockUrl, mockOptions);

			expect(mockAuthService.refresh).toHaveBeenCalledWith(
				mockRefreshToken
			);
			expect(mockSecureStorage.setToken).toHaveBeenCalledWith(
				mockNewToken
			);
			expect(mockSecureStorage.setRefreshToken).toHaveBeenCalledWith(
				mockNewRefreshToken
			);
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(
				mockRefreshResponse.user
			);
			expect(global.fetch).toHaveBeenCalledTimes(2);
			expect(result).toBe(mock200Response);
		});

		it('should clear tokens and throw error on refresh failure', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			mockSecureStorage.getRefreshToken.mockReturnValue(mockRefreshToken);

			const refreshError = new Error('Refresh failed');
			mockAuthService.refresh.mockRejectedValue(refreshError);

			const mock401Response = { status: 401 } as Response;
			global.fetch = jest.fn().mockResolvedValue(mock401Response);

			await expect(
				authenticatedFetch(mockUrl, mockOptions)
			).rejects.toThrow('Authentication expired. Please sign in again.');

			expect(mockSecureStorage.clearAll).toHaveBeenCalled();
		});

		it('should not attempt refresh on 401 without refresh token', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			mockSecureStorage.getRefreshToken.mockReturnValue(null);

			const mock401Response = { status: 401 } as Response;
			global.fetch = jest.fn().mockResolvedValue(mock401Response);

			const result = await authenticatedFetch(mockUrl, mockOptions);

			expect(mockAuthService.refresh).not.toHaveBeenCalled();
			expect(result).toBe(mock401Response);
		});

		it('should handle refresh response without new refresh token', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			mockSecureStorage.getRefreshToken.mockReturnValue(mockRefreshToken);

			const mockRefreshResponse = {
				token: mockNewToken,
				user: {
					userId: '1',
					name: 'Test User',
					email: 'test@example.com',
					phoneNumber: '123-456-7890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				// No refreshToken in response
			};
			mockAuthService.refresh.mockResolvedValue(mockRefreshResponse);

			const mock401Response = { status: 401 } as Response;
			const mock200Response = { status: 200, ok: true } as Response;

			global.fetch = jest
				.fn()
				.mockResolvedValueOnce(mock401Response)
				.mockResolvedValueOnce(mock200Response);

			await authenticatedFetch(mockUrl, mockOptions);

			expect(mockSecureStorage.setToken).toHaveBeenCalledWith(
				mockNewToken
			);
			expect(mockSecureStorage.setRefreshToken).not.toHaveBeenCalled();
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(
				mockRefreshResponse.user
			);
		});
	});

	describe('error handling', () => {
		it('should throw error on fetch failure', async () => {
			const fetchError = new Error('Network error');
			global.fetch = jest.fn().mockRejectedValue(fetchError);

			await expect(
				authenticatedFetch(mockUrl, mockOptions)
			).rejects.toThrow('Network error');
		});

		it('should throw error on refresh fetch failure', async () => {
			mockSecureStorage.getToken.mockReturnValue(mockToken);
			mockSecureStorage.getRefreshToken.mockReturnValue(mockRefreshToken);

			const refreshError = new Error('Refresh network error');
			mockAuthService.refresh.mockRejectedValue(refreshError);

			const mock401Response = { status: 401 } as Response;
			global.fetch = jest.fn().mockResolvedValue(mock401Response);

			await expect(
				authenticatedFetch(mockUrl, mockOptions)
			).rejects.toThrow('Authentication expired. Please sign in again.');
		});
	});
});
