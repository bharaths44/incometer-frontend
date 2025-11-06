// Utility for making authenticated API calls
import { SecureStorage } from './secureStorage';
import { AuthService } from '@/services/authService';

export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const token = SecureStorage.getToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		...options,
		headers,
	});

	// If we get a 401 and have a refresh token, try to refresh
	if (response.status === 401) {
		const refreshToken = SecureStorage.getRefreshToken();
		if (refreshToken) {
			try {
				console.log('Access token expired, attempting refresh...');
				const refreshResponse = await AuthService.refresh(refreshToken);

				// Store the new tokens
				SecureStorage.setToken(refreshResponse.token);
				if (refreshResponse.refreshToken) {
					SecureStorage.setRefreshToken(refreshResponse.refreshToken);
				}
				SecureStorage.setUser(refreshResponse.user);

				// Retry the original request with the new token
				const newHeaders = {
					...headers,
					Authorization: `Bearer ${refreshResponse.token}`,
				};

				console.log(
					'Token refreshed successfully, retrying request...'
				);
				return fetch(url, {
					...options,
					headers: newHeaders,
				});
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				// If refresh fails, clear tokens and throw the original error
				SecureStorage.clearAll();
				throw new Error(
					'Authentication expired. Please sign in again.'
				);
			}
		}
	}

	return response;
};
