import { SecureStorage } from '@/lib/secureStorage';

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
	writable: true,
});

describe('SecureStorage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset mock implementations
		localStorageMock.getItem.mockReset();
		localStorageMock.setItem.mockReset();
		localStorageMock.removeItem.mockReset();
		localStorageMock.clear.mockReset();
	});

	describe('setToken', () => {
		it('should store valid JWT token', () => {
			const validToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

			expect(() => SecureStorage.setToken(validToken)).not.toThrow();
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'auth_token',
				validToken
			);
		});

		it('should reject invalid token', () => {
			expect(() => SecureStorage.setToken('')).toThrow(
				'Failed to store authentication token'
			);
			expect(() => SecureStorage.setToken(null as any)).toThrow(
				'Failed to store authentication token'
			);
		});

		it('should reject malformed JWT', () => {
			expect(() => SecureStorage.setToken('invalid.jwt')).toThrow(
				'Failed to store authentication token'
			);
			expect(() => SecureStorage.setToken('not.a.jwt.at.all')).toThrow(
				'Failed to store authentication token'
			);
		});

		it('should handle localStorage errors', () => {
			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('Storage quota exceeded');
			});

			expect(() => SecureStorage.setToken('valid.jwt.token')).toThrow(
				'Failed to store authentication token'
			);
		});
	});

	describe('getToken', () => {
		it('should return stored token', () => {
			const token = 'valid.jwt.token';
			localStorageMock.getItem.mockReturnValue(token);

			const result = SecureStorage.getToken();
			expect(result).toBe(token);
		});

		it('should return null when no token stored', () => {
			localStorageMock.getItem.mockReturnValue(null);

			const result = SecureStorage.getToken();
			expect(result).toBeNull();
		});

		it('should clear invalid JWT and return null', () => {
			localStorageMock.getItem.mockReturnValue('invalid.jwt');
			const consoleWarnSpy = jest
				.spyOn(console, 'warn')
				.mockImplementation();

			const result = SecureStorage.getToken();
			expect(result).toBeNull();
			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_token'
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'Stored token has invalid JWT format'
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle localStorage errors', () => {
			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('Storage error');
			});
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation();

			const result = SecureStorage.getToken();
			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Failed to retrieve token:',
				expect.any(Error)
			);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('setUser', () => {
		it('should store valid user data', () => {
			const user = {
				userId: '123',
				email: 'test@example.com',
				name: 'Test User',
			};

			expect(() => SecureStorage.setUser(user)).not.toThrow();
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'auth_user',
				JSON.stringify(user)
			);
		});

		it('should reject invalid user data', () => {
			expect(() => SecureStorage.setUser(null as any)).toThrow(
				'Failed to store user data'
			);
			expect(() => SecureStorage.setUser('not an object')).toThrow(
				'Failed to store user data'
			);
			expect(() => SecureStorage.setUser({})).toThrow(
				'Failed to store user data'
			);
			expect(() => SecureStorage.setUser({ userId: '123' })).toThrow(
				'Failed to store user data'
			);
		});

		it('should handle localStorage errors', () => {
			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			expect(() =>
				SecureStorage.setUser({
					userId: '123',
					email: 'test@example.com',
				})
			).toThrow('Failed to store user data');
		});
	});

	describe('getUser', () => {
		it('should return stored user data', () => {
			const user = { userId: '123', email: 'test@example.com' };
			localStorageMock.getItem.mockReturnValue(JSON.stringify(user));

			const result = SecureStorage.getUser();
			expect(result).toEqual(user);
		});

		it('should return null when no user stored', () => {
			localStorageMock.getItem.mockReturnValue(null);

			const result = SecureStorage.getUser();
			expect(result).toBeNull();
		});

		it('should clear invalid user data and return null', () => {
			localStorageMock.getItem.mockReturnValue(
				JSON.stringify({ invalid: 'data' })
			);
			const consoleWarnSpy = jest
				.spyOn(console, 'warn')
				.mockImplementation();

			const result = SecureStorage.getUser();
			expect(result).toBeNull();
			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_user'
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'Stored user data is invalid'
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle localStorage errors', () => {
			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('Storage error');
			});
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation();

			const result = SecureStorage.getUser();
			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Failed to retrieve user data:',
				expect.any(Error)
			);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('setRefreshToken and getRefreshToken', () => {
		it('should store and retrieve refresh token', () => {
			const token = 'refresh_token_123';

			SecureStorage.setRefreshToken(token);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'auth_refresh_token',
				token
			);

			localStorageMock.getItem.mockReturnValue(token);
			const result = SecureStorage.getRefreshToken();
			expect(result).toBe(token);
		});

		it('should handle errors gracefully', () => {
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation();

			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			// Should not throw for refresh token storage but should log error
			expect(() => SecureStorage.setRefreshToken('token')).not.toThrow();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Failed to store refresh token:',
				expect.any(Error)
			);

			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			const result = SecureStorage.getRefreshToken();
			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Failed to retrieve refresh token:',
				expect.any(Error)
			);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('clear methods', () => {
		it('should clear all data', () => {
			SecureStorage.clearAll();

			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_token'
			);
			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_user'
			);
			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_refresh_token'
			);
		});

		it('should clear token only', () => {
			SecureStorage.clearToken();

			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_token'
			);
		});

		it('should clear user only', () => {
			SecureStorage.clearUser();

			expect(localStorageMock.removeItem).toHaveBeenCalledWith(
				'auth_user'
			);
		});

		it('should handle localStorage errors in clear methods', () => {
			localStorageMock.removeItem.mockImplementation(() => {
				throw new Error('Storage error');
			});
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation();

			expect(() => SecureStorage.clearAll()).not.toThrow();
			expect(() => SecureStorage.clearToken()).not.toThrow();
			expect(() => SecureStorage.clearUser()).not.toThrow();

			consoleErrorSpy.mockRestore();
		});
	});

	describe('isAuthenticated', () => {
		it('should return true for valid authentication', () => {
			const validToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwMDAwMDAwMDB9.test';
			const user = { userId: '123', email: 'test@example.com' };

			localStorageMock.getItem
				.mockReturnValueOnce(validToken) // token
				.mockReturnValueOnce(JSON.stringify(user)); // user

			const result = SecureStorage.isAuthenticated();
			expect(result).toBe(true);
		});

		it('should return false when no token', () => {
			localStorageMock.getItem.mockReturnValue(null);

			const result = SecureStorage.isAuthenticated();
			expect(result).toBe(false);
		});

		it('should return false when token is expired', () => {
			const expiredToken =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjEwMDAwMDAwMDB9.test';
			const user = { userId: '123', email: 'test@example.com' };

			localStorageMock.getItem
				.mockReturnValueOnce(expiredToken) // token
				.mockReturnValueOnce(JSON.stringify(user)); // user

			const consoleWarnSpy = jest
				.spyOn(console, 'warn')
				.mockImplementation();

			const result = SecureStorage.isAuthenticated();
			expect(result).toBe(false);
			expect(consoleWarnSpy).toHaveBeenCalledWith('Token has expired');

			consoleWarnSpy.mockRestore();
		});

		it('should clear data on authentication errors', () => {
			localStorageMock.getItem
				.mockReturnValueOnce('header.invalid_payload.signature') // token with 3 parts but invalid base64
				.mockReturnValueOnce(
					JSON.stringify({ userId: '123', email: 'test@example.com' })
				); // user

			const result = SecureStorage.isAuthenticated();
			expect(result).toBe(false);
			expect(localStorageMock.removeItem).toHaveBeenCalledTimes(3); // clearAll called
		});
	});

	describe('getSecurityWarnings', () => {
		it('should return security warnings', () => {
			const warnings = SecureStorage.getSecurityWarnings();

			expect(Array.isArray(warnings)).toBe(true);
			expect(warnings.length).toBeGreaterThan(0);
			expect(warnings[0]).toContain('localStorage is vulnerable');
			expect(warnings).toContain(
				'🔒 Consider using httpOnly cookies for production'
			);
		});
	});
});
