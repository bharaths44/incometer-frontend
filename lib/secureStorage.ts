/**
 * Secure Storage Utility
 *
 * Pure cookie-based authentication:
 * - accessToken: Stored in httpOnly cookie by backend (XSS protection, short-lived)
 * - refreshToken: Stored in httpOnly cookie by backend (XSS protection, long-lived)
 * - User data: Stored in localStorage (non-sensitive profile info only)
 *
 * All tokens are managed by backend via httpOnly cookies.
 * Frontend only stores non-sensitive user profile data.
 */

export class SecureStorage {
	private static readonly USER_KEY = 'auth_user';

	/**
	 * Store user data securely
	 */
	static setUser(user: any): void {
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

		try {
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
	 * Clear all authentication data
	 * Note: httpOnly cookies can only be cleared by backend logout endpoint
	 */
	static clearAll(): void {
		try {
			// Clear user data from localStorage
			localStorage.removeItem(this.USER_KEY);
			console.log(
				'User data cleared. Cookies will be cleared by backend logout endpoint.'
			);
		} catch (error) {
			console.error('Failed to clear authentication data:', error);
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
	 * With pure cookie approach, we check if user data exists in localStorage
	 * The actual token validation happens on the backend with each request
	 */
	static isAuthenticated(): boolean {
		const user = this.getUser();
		// If user data exists, backend cookies should be valid
		// Backend validates tokens on each request
		return !!user;
	}

	/**
	 * Get security information for current storage method
	 */
	static getSecurityInfo(): string[] {
		return [
			'✅ Pure cookie-based authentication',
			'✅ AccessToken in httpOnly cookie (XSS protected)',
			'✅ RefreshToken in httpOnly cookie (XSS protected)',
			'✅ Cookies automatically sent with requests',
			'✅ No tokens exposed to JavaScript',
			'✅ User profile in localStorage (non-sensitive only)',
			'🔐 Requires HTTPS in production',
			'🛡️ Backend sets Secure, HttpOnly, SameSite flags',
		];
	}
}
