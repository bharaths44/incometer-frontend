/**
 * Secure Storage Utility
 *
 * Uses httpOnly cookies for JWT tokens (set by backend) and localStorage for user data only.
 * Tokens are stored in httpOnly cookies which are:
 * - Not accessible via JavaScript (XSS protection)
 * - Automatically sent with requests
 * - Can have Secure and SameSite flags
 */

export class SecureStorage {
	private static readonly USER_KEY = 'auth_user';
	// Note: Tokens are now stored in httpOnly cookies by the backend
	// No localStorage storage for tokens

	/**
	 * Store authentication token - NOT USED with httpOnly cookies
	 * Token is set by backend as httpOnly cookie
	 * This method is kept for backward compatibility but does nothing
	 * @deprecated Use httpOnly cookies set by backend
	 */
	static setToken(token: string): void {
		console.warn(
			'setToken called but tokens are stored in httpOnly cookies by backend'
		);
		// No-op: Backend sets httpOnly cookie
	}

	/**
	 * Get authentication token - NOT AVAILABLE with httpOnly cookies
	 * Token is in httpOnly cookie and not accessible to JavaScript
	 * @deprecated Tokens are in httpOnly cookies and not accessible to JavaScript
	 * @returns null always (token is in httpOnly cookie)
	 */
	static getToken(): string | null {
		// Cannot access httpOnly cookies from JavaScript (this is the security feature!)
		// The browser automatically sends the cookie with requests
		return null;
	}

	/**
	 * Store user data securely
	 */
	static setUser(user: any): void {
		try {
			console.log('setUser called with:', {
				user,
				isObject: typeof user === 'object',
				hasUserId: !!user?.userId,
				hasEmail: !!user?.email,
				userIdType: typeof user?.userId,
				emailType: typeof user?.email,
			});

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
			console.log('User data stored successfully');
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
	static setRefreshToken(token: string): void {
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
	 * For httpOnly cookies, we need to call backend logout endpoint
	 */
	static clearAll(): void {
		try {
			// Clear user data from localStorage
			localStorage.removeItem(this.USER_KEY);

			// Note: httpOnly cookies must be cleared by the backend
			// Call the logout endpoint to clear cookies
			console.log(
				'User data cleared. Cookies will be cleared by backend logout endpoint.'
			);
		} catch (error) {
			console.error('Failed to clear authentication data:', error);
		}
	}

	/**
	 * Clear token only - NOT APPLICABLE with httpOnly cookies
	 * @deprecated Tokens are in httpOnly cookies, cleared by backend
	 */
	static clearToken(): void {
		console.warn(
			'clearToken called but tokens are in httpOnly cookies (cleared by backend)'
		);
		// No-op: Backend must clear httpOnly cookies
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
