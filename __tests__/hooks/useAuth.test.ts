import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import type { User, AuthResponse } from '@/types/auth';

// Mock the auth service
jest.mock('@/services/authService', () => ({
	AuthService: {
		signIn: jest.fn(),
		signUp: jest.fn(),
		signInWithOAuth: jest.fn(),
		signOut: jest.fn(),
		refresh: jest.fn(),
		getCurrentUser: jest.fn(),
		getCurrentUserFromToken: jest.fn(),
	},
}));

import { AuthService } from '@/services/authService';

// Mock secure storage
jest.mock('@/lib/secureStorage', () => ({
	SecureStorage: {
		getToken: jest.fn(),
		setToken: jest.fn(),
		getRefreshToken: jest.fn(),
		setRefreshToken: jest.fn(),
		getUser: jest.fn(),
		setUser: jest.fn(),
		clearAll: jest.fn(),
	},
}));

import { SecureStorage } from '@/lib/secureStorage';

const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockSecureStorage = SecureStorage as jest.Mocked<typeof SecureStorage>;

describe('useAuth', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset all mocks to default behavior
		mockSecureStorage.getToken.mockReturnValue(null);
		mockSecureStorage.getRefreshToken.mockReturnValue(null);
		mockSecureStorage.getUser.mockReturnValue(null);
	});

	describe('initial state', () => {
		it('should start with loading state and transition to not loading', async () => {
			const { result } = renderHook(() => useAuth());

			// Initially might be loading or not depending on timing
			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.user).toBe(null);

			// Wait for auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});
		});
	});

	describe('checkAuthStatus', () => {
		it('should authenticate user from stored token and user', async () => {
			const mockUser: User = {
				userId: '1',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			mockSecureStorage.getToken.mockReturnValue('valid-token');
			mockSecureStorage.getUser.mockReturnValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockUser);
			expect(mockAuthService.getCurrentUser).not.toHaveBeenCalled();
		});

		it('should authenticate user from API when only token exists', async () => {
			const mockUser: User = {
				userId: '1',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			mockSecureStorage.getToken.mockReturnValue('valid-token');
			mockSecureStorage.getUser.mockReturnValue(null);
			mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockUser);
			expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(mockUser);
		});

		it('should fallback to token decoding when API fails', async () => {
			const mockUser: User = {
				userId: '1',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			mockSecureStorage.getToken.mockReturnValue('valid-token');
			mockSecureStorage.getUser.mockReturnValue(null);
			mockAuthService.getCurrentUser.mockRejectedValue(
				new Error('API error')
			);
			mockAuthService.getCurrentUserFromToken.mockReturnValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockUser);
			expect(mockAuthService.getCurrentUserFromToken).toHaveBeenCalled();
		});

		it('should clear storage when auth check fails', async () => {
			mockSecureStorage.getToken.mockReturnValue('invalid-token');
			mockSecureStorage.getUser.mockReturnValue(null);
			mockAuthService.getCurrentUser.mockRejectedValue(
				new Error('Invalid token')
			);
			mockAuthService.getCurrentUserFromToken.mockImplementation(() => {
				throw new Error('Invalid token');
			});

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.user).toBe(null);
			expect(mockSecureStorage.clearAll).toHaveBeenCalled();
		});
	});

	describe('signIn', () => {
		it('should sign in user successfully', async () => {
			const mockResponse: AuthResponse = {
				user: {
					userId: '1',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'access-token',
				refreshToken: 'refresh-token',
			};

			mockAuthService.signIn.mockResolvedValue(mockResponse);

			const { result } = renderHook(() => useAuth());

			// Wait for initial auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			let signInResult: AuthResponse;
			await act(async () => {
				signInResult = await result.current.signIn(
					'john@example.com',
					'password'
				);
			});

			expect(signInResult!).toEqual(mockResponse);
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockResponse.user);
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(
				mockResponse.user
			);
			expect(mockSecureStorage.setToken).toHaveBeenCalledWith(
				mockResponse.token
			);
			expect(mockSecureStorage.setRefreshToken).toHaveBeenCalledWith(
				mockResponse.refreshToken
			);
		});
	});

	describe('signUp', () => {
		it('should sign up user successfully', async () => {
			const mockResponse: AuthResponse = {
				user: {
					userId: '1',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'access-token',
				refreshToken: 'refresh-token',
			};

			mockAuthService.signUp.mockResolvedValue(mockResponse);

			const { result } = renderHook(() => useAuth());

			// Wait for initial auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			let signUpResult: AuthResponse;
			await act(async () => {
				signUpResult = await result.current.signUp(
					'John Doe',
					'john@example.com',
					'+1234567890',
					'password'
				);
			});

			expect(signUpResult!).toEqual(mockResponse);
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockResponse.user);
		});
	});

	describe('signInWithOAuth', () => {
		it('should sign in with OAuth successfully', async () => {
			const mockResponse: AuthResponse = {
				user: {
					userId: '1',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'access-token',
				refreshToken: 'refresh-token',
			};

			mockAuthService.signInWithOAuth.mockResolvedValue(mockResponse);

			const { result } = renderHook(() => useAuth());

			// Wait for initial auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			let oauthResult: AuthResponse;
			await act(async () => {
				oauthResult = await result.current.signInWithOAuth(
					'github',
					'auth-code'
				);
			});

			expect(oauthResult!).toEqual(mockResponse);
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockResponse.user);
		});
	});

	describe('signOut', () => {
		it('should sign out user successfully', async () => {
			// First sign in a user
			const mockUser: User = {
				userId: '1',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			mockSecureStorage.getToken.mockReturnValue('valid-token');
			mockSecureStorage.getUser.mockReturnValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isAuthenticated).toBe(true);
			});

			mockAuthService.signOut.mockResolvedValue(undefined);

			await act(async () => {
				await result.current.signOut();
			});

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.user).toBe(null);
			expect(mockAuthService.signOut).toHaveBeenCalled();
		});
	});

	describe('refreshAuth', () => {
		it('should refresh authentication successfully', async () => {
			const mockResponse: AuthResponse = {
				user: {
					userId: '1',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'new-access-token',
				refreshToken: 'new-refresh-token',
			};

			mockSecureStorage.getRefreshToken.mockReturnValue('refresh-token');
			mockAuthService.refresh.mockResolvedValue(mockResponse);

			const { result } = renderHook(() => useAuth());

			// Wait for initial auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			let refreshResult: AuthResponse;
			await act(async () => {
				refreshResult = await result.current.refreshAuth();
			});

			expect(refreshResult!).toEqual(mockResponse);
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.user).toEqual(mockResponse.user);
		});

		it('should throw error when no refresh token available', async () => {
			mockSecureStorage.getRefreshToken.mockReturnValue(null);

			const { result } = renderHook(() => useAuth());

			// Wait for initial auth check to complete
			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			await expect(result.current.refreshAuth()).rejects.toThrow(
				'No refresh token available'
			);
		});
	});
});
