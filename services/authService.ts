import {
	SignUpRequest,
	SignInRequest,
	AuthResponse,
	User,
} from '../types/auth';
import { API_BASE_URL } from '../lib/constants';
import { authenticatedFetch } from '@/lib/authFetch';
import { SecureStorage } from '@/lib/secureStorage';

// Auth service for calling backend API
export class AuthService {
	private static readonly BASE_URL = `${API_BASE_URL}/v1/auth`;

	// Sign up with email and password
	static async signUp(request: SignUpRequest): Promise<AuthResponse> {
		const response = await fetch(`${this.BASE_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Include cookies in request
			body: JSON.stringify({
				name: request.name,
				email: request.email,
				phoneNumber: request.phoneNumber,
				password: request.password,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || 'Registration failed');
		}

		// Backend should set httpOnly cookie with refreshToken
		// Response includes accessToken for immediate use
		const data = await response.json();

		// Backend returns accessToken in response body
		if (data.accessToken) {
			// Store accessToken in memory for Authorization header
			SecureStorage.setToken(data.accessToken);

			const user = this.decodeUserFromTokenPublic(data.accessToken);
			return {
				user,
				token: data.accessToken,
				refreshToken: data.refreshToken,
			};
		} else {
			// Fallback: fetch user data from /users/me endpoint
			const user = await this.getCurrentUser();
			return {
				user,
				token: '', // Token is in httpOnly cookie
				refreshToken: '',
			};
		}
	}

	// Sign in with email and password
	static async signIn(request: SignInRequest): Promise<AuthResponse> {
		const response = await fetch(`${this.BASE_URL}/authenticate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Include cookies in request
			body: JSON.stringify({
				username: request.email, // Spring Security often expects 'username'
				password: request.password,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('Sign in failed:', response.status, error);
			throw new Error(error || 'Authentication failed');
		}

		// Backend should set httpOnly cookie with refreshToken
		const data = await response.json();

		// Backend returns accessToken in response body
		if (data.accessToken) {
			// Store accessToken in memory for Authorization header
			SecureStorage.setToken(data.accessToken);

			const user = this.decodeUserFromTokenPublic(data.accessToken);
			return {
				user,
				token: data.accessToken,
				refreshToken: data.refreshToken,
			};
		} else {
			// Fallback: fetch user data from /users/me endpoint
			const user = await this.getCurrentUser();
			return {
				user,
				token: '', // Token is in httpOnly cookie
				refreshToken: '',
			};
		}
	}

	// Sign in with OAuth provider
	static async signInWithOAuth(
		provider: 'github' | 'google',
		code: string
	): Promise<AuthResponse> {
		// Call the backend's OAuth callback endpoint
		const response = await fetch(
			`${API_BASE_URL}/oauth2/callback/${provider}?code=${encodeURIComponent(code)}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OAuth callback failed:', errorText);
			throw new Error(
				errorText || `${provider} OAuth authentication failed`
			);
		}

		const data: { accessToken: string; refreshToken: string } =
			await response.json();

		// Store accessToken in memory for Authorization header
		SecureStorage.setToken(data.accessToken);

		// Decode JWT to get user info
		const user = this.decodeUserFromTokenPublic(data.accessToken);

		return {
			user,
			token: data.accessToken,
			refreshToken: data.refreshToken,
		};
	}

	// Initiate OAuth flow by redirecting to backend
	static initiateOAuth(provider: 'github' | 'google'): void {
		// Backend should redirect back to the authorizedRedirectUri configured in application.yml
		// which is http://localhost:3000/auth/callback
		const url = `${API_BASE_URL}/oauth2/authorize/${provider}`;
		window.location.href = url;
	}

	// Get current user profile from backend API
	static async getCurrentUser(): Promise<User> {
		const response = await authenticatedFetch(`${API_BASE_URL}/users/me`);
		if (!response.ok) {
			throw new Error('Failed to get current user');
		}
		const userData = await response.json();
		return {
			userId: userData.userId,
			name: userData.name,
			email: userData.email,
			phoneNumber: userData.phoneNumber || '',
			createdAt: userData.createdAt || new Date().toISOString(),
			updatedAt: userData.updatedAt || new Date().toISOString(),
		};
	}

	// Get current user profile from JWT token (fallback)
	static getCurrentUserFromToken(): User {
		const token = SecureStorage.getToken();
		if (!token) {
			throw new Error('No token found');
		}

		// Decode user from token
		return this.decodeUserFromTokenPublic(token);
	}

	// Refresh access token using refresh token
	static async refresh(refreshToken: string): Promise<AuthResponse> {
		const response = await fetch(`${this.BASE_URL}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refreshToken: refreshToken,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || 'Token refresh failed');
		}

		const data: { accessToken: string; refreshToken: string } =
			await response.json();

		// Store new accessToken in memory
		SecureStorage.setToken(data.accessToken);

		// Decode JWT to get user info
		const user = this.decodeUserFromTokenPublic(data.accessToken);

		return {
			user,
			token: data.accessToken,
			refreshToken: data.refreshToken,
		};
	}

	// Sign out
	static async signOut(): Promise<void> {
		try {
			// Call backend logout endpoint to clear httpOnly cookies
			await fetch(`${this.BASE_URL}/logout`, {
				method: 'POST',
				credentials: 'include', // Include cookies in request
			});
		} catch (error) {
			console.warn(
				'Backend logout failed, clearing local storage anyway:',
				error
			);
		}

		// Clear secure storage
		SecureStorage.clearAll();
	}

	// Decode JWT token to extract user info (public version)
	static decodeUserFromTokenPublic(token: string): User {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));

			// Try different possible fields for userId
			const userId =
				payload.uuid || payload.userId || payload.sub || payload.id;

			if (!userId) {
				console.error('No userId found in JWT payload:', payload);
				throw new Error('No userId found in JWT payload');
			}

			// Try different possible fields for email
			const email = payload.email || payload.sub;

			if (!email) {
				console.error('No email found in JWT payload:', payload);
				throw new Error('No email found in JWT payload');
			}

			const user: User = {
				userId: String(userId), // Ensure it's a string
				name: payload.name || email.split('@')[0], // Fallback to email prefix if no name
				email: String(email), // Ensure it's a string
				phoneNumber: payload.phoneNumber || '',
				createdAt: payload.createdAt || new Date().toISOString(),
				updatedAt: payload.updatedAt || new Date().toISOString(),
			};

			return user;
		} catch (error) {
			console.error('Error decoding JWT:', error);
			throw new Error('Invalid token');
		}
	}
}
