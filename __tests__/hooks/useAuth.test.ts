import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/authService';
import { SecureStorage } from '@/lib/secureStorage';
import type { User, AuthResponse } from '@/types/auth';

// Mock dependencies
jest.mock('@/services/authService');
jest.mock('@/lib/secureStorage');

const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockSecureStorage = SecureStorage as jest.Mocked<typeof SecureStorage>;

describe('useAuth', () => {
	const mockUser: User = {
		userId: '1',
		name: 'John Doe',
		email: 'john@example.com',
		phoneNumber: '1234567890',
		createdAt: '2023-01-01T00:00:00Z',
		updatedAt: '2023-01-01T00:00:00Z',
	};

	const mockAuthResponse: AuthResponse = {
		user: mockUser,
		token: 'mock-token',
		refreshToken: 'mock-refresh-token',
	};

	beforeEach(() => {
		jest.clearAllMocks();
		// Reset mocks
		mockSecureStorage.getUser.mockReturnValue(null);
		mockSecureStorage.setUser.mockImplementation(() => {});
		mockSecureStorage.clearAll.mockImplementation(() => {});
		mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
		mockAuthService.signIn.mockResolvedValue(mockAuthResponse);
		mockAuthService.signUp.mockResolvedValue(mockAuthResponse);
		mockAuthService.signInWithOAuth.mockResolvedValue(mockAuthResponse);
		mockAuthService.signOut.mockResolvedValue(undefined);
	});

	describe('initial state', () => {
		it('should initialize with null user and false authenticated when no stored user', () => {
			mockSecureStorage.getUser.mockReturnValue(null);

			const { result } = renderHook(() => useAuth());

			expect(result.current.user).toBeNull();
			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.isLoading).toBe(true);
		});

		it('should initialize with stored user and true authenticated when user exists', () => {
			mockSecureStorage.getUser.mockReturnValue(mockUser);

			const { result } = renderHook(() => useAuth());

			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
			// isLoading will be set to false after effect, but initially true
		});
	});

	describe('checkAuthStatus', () => {
		it('should set user and authenticated on successful auth check', async () => {
			mockSecureStorage.getUser.mockReturnValue(null);
			mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(mockUser);
			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
		});

		it('should clear user and set unauthenticated on failed auth check', async () => {
			mockSecureStorage.getUser.mockReturnValue(null);
			mockAuthService.getCurrentUser.mockRejectedValue(
				new Error('Auth failed')
			);

			const { result } = renderHook(() => useAuth());

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
			expect(mockSecureStorage.clearAll).toHaveBeenCalledTimes(1);
			expect(result.current.user).toBeNull();
			expect(result.current.isAuthenticated).toBe(false);
		});
	});

	describe('signIn', () => {
		it('should sign in user successfully', async () => {
			const { result } = renderHook(() => useAuth());

			await act(async () => {
				await result.current.signIn('john@example.com', 'password');
			});

			expect(mockAuthService.signIn).toHaveBeenCalledWith({
				email: 'john@example.com',
				password: 'password',
			});
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(mockUser);
			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
		});

		it('should throw error on sign in failure', async () => {
			mockAuthService.signIn.mockRejectedValue(
				new Error('Sign in failed')
			);

			const { result } = renderHook(() => useAuth());

			await expect(
				act(async () => {
					await result.current.signIn(
						'john@example.com',
						'wrongpassword'
					);
				})
			).rejects.toThrow('Sign in failed');
		});
	});

	describe('signUp', () => {
		it('should sign up user successfully', async () => {
			const { result } = renderHook(() => useAuth());

			await act(async () => {
				await result.current.signUp(
					'John Doe',
					'john@example.com',
					'1234567890',
					'password'
				);
			});

			expect(mockAuthService.signUp).toHaveBeenCalledWith({
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '1234567890',
				password: 'password',
			});
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(mockUser);
			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
		});
	});

	describe('signInWithOAuth', () => {
		it('should sign in with OAuth successfully', async () => {
			const { result } = renderHook(() => useAuth());

			await act(async () => {
				await result.current.signInWithOAuth('github', 'code123');
			});

			expect(mockAuthService.signInWithOAuth).toHaveBeenCalledWith(
				'github',
				'code123'
			);
			expect(mockSecureStorage.setUser).toHaveBeenCalledWith(mockUser);
			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
		});
	});

	describe('signOut', () => {
		it('should sign out user successfully', async () => {
			// Set initial user
			mockSecureStorage.getUser.mockReturnValue(mockUser);

			const { result } = renderHook(() => useAuth());

			await act(async () => {
				await result.current.signOut();
			});

			expect(mockAuthService.signOut).toHaveBeenCalledTimes(1);
			expect(result.current.user).toBeNull();
			expect(result.current.isAuthenticated).toBe(false);
		});
	});
});
