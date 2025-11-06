/**
 * Secure Storage Utility
 *
 * WARNING: localStorage is vulnerable to XSS attacks.
 * For production applications, consider using:
 * 1. httpOnly cookies for sensitive tokens (requires backend changes)
 * 2. Secure token storage with encryption
 * 3. Content Security Policy (CSP) headers
 */

export class SecureStorage {
	private static readonly TOKEN_KEY = 'auth_token';
	private static readonly USER_KEY = 'auth_user';
	private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

	/**
	 * Store authentication token securely
	 * Note: In production, use httpOnly cookies instead
	 */
	static setToken(token: string): void {
		try {
			// Basic validation
			if (!token || typeof token !== 'string') {
				throw new Error('Invalid token');
			}

			// Check if token is a valid JWT
			const parts = token.split('.');
			if (parts.length !== 3) {
				throw new Error('Invalid JWT format');
			}

			localStorage.setItem(this.TOKEN_KEY, token);
		} catch (error) {
			console.error('Failed to store token:', error);
			throw new Error('Failed to store authentication token');
		}
	}

	/**
	 * Get authentication token
	 */
	static getToken(): string | null {
		try {
			const token = localStorage.getItem(this.TOKEN_KEY);

			// Basic validation if token exists
			if (token) {
				const parts = token.split('.');
				if (parts.length !== 3) {
					console.warn('Stored token has invalid JWT format');
					this.clearToken();
					return null;
				}
			}

			return token;
		} catch (error) {
			console.error('Failed to retrieve token:', error);
			return null;
		}
	}

	/**
	 * Store user data securely
	 */
	static setUser(user: any): void {
		try {
			if (!user || typeof user !== 'object') {
				throw new Error('Invalid user data');
			}

			// Validate required user fields
			if (!user.userId || !user.email) {
				throw new Error('User data missing required fields');
			}

			localStorage.setItem(this.USER_KEY, JSON.stringify(user));
		} catch (error) {
			console.error('Failed to store user data:', error);
			throw new Error('Failed to store user data');
		}
	}

	/**
	 * Get user data
	 */
	static getUser(): any | null {
		try {
			const userJson = localStorage.getItem(this.USER_KEY);
			if (!userJson) return null;

			const user = JSON.parse(userJson);

			// Validate user object
			if (!user || typeof user !== 'object' || !user.userId) {
				console.warn('Stored user data is invalid');
				this.clearUser();
				return null;
			}

			return user;
		} catch (error) {
			console.error('Failed to retrieve user data:', error);
			this.clearUser();
			return null;
		}
	}

	/**
	 * Store refresh token
	 */
	static setRefreshToken(token: string): void {
		try {
			if (!token || typeof token !== 'string') {
				throw new Error('Invalid refresh token');
			}
			localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
		} catch (error) {
			console.error('Failed to store refresh token:', error);
		}
	}

	/**
	 * Get refresh token
	 */
	static getRefreshToken(): string | null {
		try {
			return localStorage.getItem(this.REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error('Failed to retrieve refresh token:', error);
			return null;
		}
	}

	/**
	 * Clear all authentication data
	 */
	static clearAll(): void {
		try {
			localStorage.removeItem(this.TOKEN_KEY);
			localStorage.removeItem(this.USER_KEY);
			localStorage.removeItem(this.REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error('Failed to clear authentication data:', error);
		}
	}

	/**
	 * Clear token only
	 */
	static clearToken(): void {
		try {
			localStorage.removeItem(this.TOKEN_KEY);
		} catch (error) {
			console.error('Failed to clear token:', error);
		}
	}

	/**
	 * Clear user data only
	 */
	static clearUser(): void {
		try {
			localStorage.removeItem(this.USER_KEY);
		} catch (error) {
			console.error('Failed to clear user data:', error);
		}
	}

	/**
	 * Check if user is authenticated
	 */
	static isAuthenticated(): boolean {
		const token = this.getToken();
		const user = this.getUser();

		if (!token || !user) return false;

		try {
			// Check if token is expired (basic check)
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Math.floor(Date.now() / 1000);

			if (payload.exp && payload.exp < currentTime) {
				console.warn('Token has expired');
				this.clearAll();
				return false;
			}

			return true;
		} catch (error) {
			console.error('Error checking authentication:', error);
			this.clearAll();
			return false;
		}
	}

	/**
	 * Get security warnings for current storage method
	 */
	static getSecurityWarnings(): string[] {
		const warnings: string[] = [];

		warnings.push('⚠️ localStorage is vulnerable to XSS attacks');
		warnings.push('🔒 Consider using httpOnly cookies for production');
		warnings.push('🛡️ Implement Content Security Policy (CSP)');
		warnings.push('🔐 Use HTTPS in production');

		return warnings;
	}
}
