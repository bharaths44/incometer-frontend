// Utility for making authenticated API calls with httpOnly cookies
import { SecureStorage } from './secureStorage';

/**
 * Make authenticated API requests using httpOnly cookies
 * Cookies are automatically sent by the browser
 * No need to manually attach Authorization headers
 */
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	// Include credentials (cookies) with the request
	// This tells the browser to send httpOnly cookies automatically
	const response = await fetch(url, {
		...options,
		headers,
		credentials: 'include', // CRITICAL: This sends httpOnly cookies
	});

	// If we get a 401, the httpOnly cookie is invalid/expired
	// Backend should handle token refresh automatically or return 401
	if (response.status === 401) {
		console.warn(
			'Authentication failed (401). User needs to sign in again.'
		);
		// Clear user data (cookies will be cleared by backend logout)
		SecureStorage.clearAll();

		// Redirect to login page
		if (typeof window !== 'undefined') {
			window.location.href = '/auth/sign-in';
		}
	}

	return response;
};
