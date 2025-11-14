// Utility for making authenticated API calls with accessToken and httpOnly cookies
import { SecureStorage } from './secureStorage';

/**
 * Make authenticated API requests using accessToken in Authorization header
 * and refreshToken in httpOnly cookie for token refresh
 */
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const accessToken = SecureStorage.getToken();

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	// Add Authorization header if accessToken exists
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	// Include credentials (cookies) with the request for refreshToken
	const response = await fetch(url, {
		...options,
		headers,
		credentials: 'include', // CRITICAL: This sends httpOnly refreshToken cookie
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
