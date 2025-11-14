// Utility for making authenticated API calls using pure httpOnly cookies
import { SecureStorage } from './secureStorage';

/**
 * Make authenticated API requests using httpOnly cookies for authentication
 * Backend reads accessToken from cookie and auto-refreshes using refreshToken cookie
 */
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	// Include credentials to send httpOnly cookies with request
	const response = await fetch(url, {
		...options,
		headers,
		credentials: 'include', // CRITICAL: Sends and receives httpOnly cookies
	});

	// If we get a 401, cookies are invalid/expired
	if (response.status === 401) {
		console.warn(
			'Authentication failed (401). User needs to sign in again.'
		);
		// Clear user data (cookies cleared by backend)
		SecureStorage.clearAll();
		// Throw error - let AuthGuard handle redirect
		throw new Error('Authentication failed (401)');
	}

	return response;
};
