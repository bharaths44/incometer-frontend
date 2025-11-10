import { AuthService } from '@/services/authService';
import { SignUpRequest, SignInRequest } from '@/types/auth';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock authenticatedFetch
jest.mock('@/lib/authFetch', () => ({
	authenticatedFetch: jest.fn(),
}));

// Import the mocked function
import { authenticatedFetch } from '@/lib/authFetch';

// Mock SecureStorage
jest.mock('@/lib/secureStorage', () => ({
	SecureStorage: {
		getToken: jest.fn(),
		clearAll: jest.fn(),
	},
}));

import { SecureStorage } from '@/lib/secureStorage';

const mockSecureStorage = SecureStorage as jest.Mocked<typeof SecureStorage>;

// Mock window.location
const mockLocation = {
	href: '',
};
try {
	Object.defineProperty(window, 'location', {
		value: mockLocation,
		writable: true,
	});
} catch {
	// If location is already defined, just modify it
	if (window.location) {
		Object.assign(window.location, mockLocation);
	}
}

describe('AuthService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();
		mockLocation.href = '';
	});

	describe('signUp', () => {
		it('should sign up user successfully', async () => {
			const signUpRequest: SignUpRequest = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				password: 'password123',
			};

			const mockResponse = {
				accessToken: 'mock.jwt.token',
				refreshToken: 'mock.refresh.token',
			};

			// Mock JWT decode
			const mockDecode = jest.spyOn(
				AuthService,
				'decodeUserFromTokenPublic'
			);
			mockDecode.mockReturnValue({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => mockResponse,
			});

			const result = await AuthService.signUp(signUpRequest);

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/auth/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
						phoneNumber: '+1234567890',
						password: 'password123',
					}),
				}
			);

			expect(result).toEqual({
				user: {
					userId: '123',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'mock.jwt.token',
				refreshToken: 'mock.refresh.token',
			});

			mockDecode.mockRestore();
		});

		it('should throw error when sign up fails', async () => {
			const signUpRequest: SignUpRequest = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				password: 'password123',
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => 'Email already exists',
			});

			await expect(AuthService.signUp(signUpRequest)).rejects.toThrow(
				'Email already exists'
			);
		});
	});

	describe('signIn', () => {
		it('should sign in user successfully', async () => {
			const signInRequest: SignInRequest = {
				email: 'john@example.com',
				password: 'password123',
			};

			const mockResponse = {
				accessToken: 'mock.jwt.token',
				refreshToken: 'mock.refresh.token',
			};

			const mockDecode = jest.spyOn(
				AuthService,
				'decodeUserFromTokenPublic'
			);
			mockDecode.mockReturnValue({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			});

			const result = await AuthService.signIn(signInRequest);

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/auth/authenticate',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: 'john@example.com',
						password: 'password123',
					}),
				}
			);

			expect(result).toEqual({
				user: {
					userId: '123',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'mock.jwt.token',
				refreshToken: 'mock.refresh.token',
			});

			mockDecode.mockRestore();
		});

		it('should throw error when sign in fails', async () => {
			const signInRequest: SignInRequest = {
				email: 'john@example.com',
				password: 'wrongpassword',
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				text: async () => 'Invalid credentials',
			});

			await expect(AuthService.signIn(signInRequest)).rejects.toThrow(
				'Invalid credentials'
			);
		});
	});

	describe('signInWithOAuth', () => {
		it('should sign in with OAuth successfully', async () => {
			const mockResponse = {
				accessToken: 'mock.oauth.token',
				refreshToken: 'mock.oauth.refresh',
			};

			const mockDecode = jest.spyOn(
				AuthService,
				'decodeUserFromTokenPublic'
			);
			mockDecode.mockReturnValue({
				userId: '456',
				name: 'Jane Doe',
				email: 'jane@github.com',
				phoneNumber: '',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			});

			const result = await AuthService.signInWithOAuth(
				'github',
				'oauth-code-123'
			);

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/oauth2/callback/github?code=oauth-code-123',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			expect(result).toEqual({
				user: {
					userId: '456',
					name: 'Jane Doe',
					email: 'jane@github.com',
					phoneNumber: '',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'mock.oauth.token',
				refreshToken: 'mock.oauth.refresh',
			});

			mockDecode.mockRestore();
		});

		it('should throw error when OAuth fails', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => 'Invalid OAuth code',
			});

			await expect(
				AuthService.signInWithOAuth('google', 'invalid-code')
			).rejects.toThrow('Invalid OAuth code');
		});
	});

	describe('initiateOAuth', () => {
		it.skip('should redirect to OAuth provider', () => {
			const mockLocation = { href: '' };
			Object.defineProperty(window, 'location', {
				value: mockLocation,
				writable: true,
			});

			AuthService.initiateOAuth('github');

			expect(mockLocation.href).toBe(
				'http://localhost:8080/api/oauth2/authorize/github'
			);
		});

		it.skip('should redirect to Google OAuth', () => {
			const mockLocation = { href: '' };
			Object.defineProperty(window, 'location', {
				value: mockLocation,
				writable: true,
			});

			AuthService.initiateOAuth('google');

			expect(mockLocation.href).toBe(
				'http://localhost:8080/api/oauth2/authorize/google'
			);
		});
	});

	describe('getCurrentUser', () => {
		it('should get current user successfully', async () => {
			const mockUserData = {
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			(
				authenticatedFetch as jest.MockedFunction<
					typeof authenticatedFetch
				>
			).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockUserData,
			} as Response);

			const result = await AuthService.getCurrentUser();

			expect(authenticatedFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/users/me'
			);
			expect(result).toEqual(mockUserData);
		});

		it('should throw error when getting current user fails', async () => {
			(
				authenticatedFetch as jest.MockedFunction<
					typeof authenticatedFetch
				>
			).mockResolvedValueOnce({
				ok: false,
				status: 401,
				text: jest.fn().mockResolvedValue('Unauthorized'),
			} as any);

			await expect(AuthService.getCurrentUser()).rejects.toThrow(
				'Failed to get current user'
			);
		});
	});

	describe('getCurrentUserFromToken', () => {
		it('should get user from token successfully', () => {
			mockSecureStorage.getToken.mockReturnValue('mock.jwt.token');

			const mockDecode = jest.spyOn(
				AuthService,
				'decodeUserFromTokenPublic'
			);
			mockDecode.mockReturnValue({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			const result = AuthService.getCurrentUserFromToken();

			expect(mockSecureStorage.getToken).toHaveBeenCalled();
			expect(result).toEqual({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			mockDecode.mockRestore();
		});

		it('should throw error when no token found', () => {
			mockSecureStorage.getToken.mockReturnValue(null);

			expect(() => AuthService.getCurrentUserFromToken()).toThrow(
				'No token found'
			);
		});
	});

	describe('refresh', () => {
		it('should refresh token successfully', async () => {
			const mockResponse = {
				accessToken: 'new.jwt.token',
				refreshToken: 'new.refresh.token',
			};

			const mockDecode = jest.spyOn(
				AuthService,
				'decodeUserFromTokenPublic'
			);
			mockDecode.mockReturnValue({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockResponse,
			});

			const result = await AuthService.refresh('old-refresh-token');

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/auth/refresh',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						refreshToken: 'old-refresh-token',
					}),
				}
			);

			expect(result).toEqual({
				user: {
					userId: '123',
					name: 'John Doe',
					email: 'john@example.com',
					phoneNumber: '+1234567890',
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
				token: 'new.jwt.token',
				refreshToken: 'new.refresh.token',
			});

			mockDecode.mockRestore();
		});

		it('should throw error when refresh fails', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				text: async () => 'Invalid refresh token',
			});

			await expect(AuthService.refresh('invalid-token')).rejects.toThrow(
				'Invalid refresh token'
			);
		});
	});

	describe('signOut', () => {
		it('should clear secure storage', async () => {
			await AuthService.signOut();

			expect(mockSecureStorage.clearAll).toHaveBeenCalled();
		});
	});

	describe('decodeUserFromTokenPublic', () => {
		it('should decode valid JWT token', () => {
			// Create a mock JWT payload
			const payload = {
				uuid: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			};

			// Create a mock JWT (header.payload.signature)
			const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
			const payloadB64 = btoa(JSON.stringify(payload));
			const signature = 'mock-signature';
			const token = `${header}.${payloadB64}.${signature}`;

			const result = AuthService.decodeUserFromTokenPublic(token);

			expect(result).toEqual({
				userId: '123',
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
			});
		});

		it('should handle different userId field names', () => {
			const payload = {
				sub: '456', // Using 'sub' instead of 'uuid'
				name: 'Jane Doe',
				email: 'jane@example.com',
			};

			const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
			const payloadB64 = btoa(JSON.stringify(payload));
			const token = `${header}.${payloadB64}.signature`;

			const result = AuthService.decodeUserFromTokenPublic(token);

			expect(result.userId).toBe('456');
		});

		it('should throw error for invalid token', () => {
			expect(() =>
				AuthService.decodeUserFromTokenPublic('invalid.token')
			).toThrow('Invalid token');
		});

		it('should throw error when no userId in payload', () => {
			const payload = {
				name: 'John Doe',
				email: 'john@example.com',
				// No userId field
			};

			const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
			const payloadB64 = btoa(JSON.stringify(payload));
			const token = `${header}.${payloadB64}.signature`;

			expect(() => AuthService.decodeUserFromTokenPublic(token)).toThrow(
				'Invalid token'
			);
		});
	});
});
