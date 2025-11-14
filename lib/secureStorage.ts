/**
 * Secure Storage Utility
 *
 * Uses in-memory storage for accessToken and httpOnly cookie for refreshToken.
 * - accessToken: Stored in memory (cleared on page refresh, short-lived)
 * - refreshToken: Stored in httpOnly cookie by backend (XSS protection, long-lived)
 * - User data: Stored in localStorage (non-sensitive)
 */

export class SecureStorage {
	private static readonly USER_KEY = 'auth_user';
	// In-memory storage for accessToken (more secure than localStorage)
	private static accessToken: string | null = null;

	/**
	 * Store authentication token in memory
	 * Token is stored in memory (not localStorage) for better security
	 * Will be cleared on page refresh (user needs to use refreshToken)
	 */
	static setToken(token: string): void {
		if (!token || typeof token !== 'string') {
			console.error('Invalid token provided to setToken');
			return;
		}
		this.accessToken = token;
	}

	/**
	 * Get authentication token from memory
	 * @returns accessToken if available, null otherwise
	 */
	static getToken(): string | null {
		return this.accessToken;
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
				console.error('User validation failed:', {
					userId: user.userId,
					email: user.email,
					fullUser: user,
				});
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
	 * Store refresh token - NOT USED with httpOnly cookies
	 * @deprecated Refresh token is stored in httpOnly cookie by backend
	 */
	static setRefreshToken(_token: string): void {
		console.warn(
			'setRefreshToken called but tokens are stored in httpOnly cookies by backend'
		);
		// No-op: Backend sets httpOnly cookie
	}

	/**
	 * Get refresh token - NOT AVAILABLE with httpOnly cookies
	 * @deprecated Refresh token is in httpOnly cookie and not accessible to JavaScript
	 */
	static getRefreshToken(): string | null {
		// Cannot access httpOnly cookies from JavaScript
		return null;
	}

	/**
	 * Clear all authentication data
	 * Clears in-memory accessToken and localStorage user data
	 * For httpOnly refreshToken cookie, backend logout endpoint must be called
	 */
	static clearAll(): void {
		try {
			// Clear in-memory accessToken
			this.accessToken = null;

			// Clear user data from localStorage
			localStorage.removeItem(this.USER_KEY);

			console.log(
				'User data and accessToken cleared. RefreshToken cookie will be cleared by backend logout endpoint.'
			);
		} catch (error) {
			console.error('Failed to clear authentication data:', error);
		}
	}

	/**
	 * Clear token only (in-memory accessToken)
	 */
	static clearToken(): void {
		this.accessToken = null;
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
	 * With httpOnly cookies, we check if user data exists
	 * The actual token validation happens on the backend
	 */
	static isAuthenticated(): boolean {
		const user = this.getUser();

		// If user data exists, we assume the httpOnly cookie is valid
		// Backend will validate the actual token on each request
		return !!user;
	}

	/**
	 * Get security information for current storage method
	 */
	static getSecurityInfo(): string[] {
		const info: string[] = [];

		info.push('✅ Tokens stored in httpOnly cookies (XSS protected)');
		info.push('✅ Cookies automatically sent with requests');
		info.push('✅ User data stored in localStorage (non-sensitive)');
		info.push('🔐 Ensure HTTPS in production');
		info.push('🛡️ Backend must set Secure and SameSite flags');

		return info;
	}
}
