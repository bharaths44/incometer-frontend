import { AuthResponse, SignInRequest, SignUpRequest, User } from '@/types/auth';
import { API_BASE_URL } from '@/lib/constants';
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

		// Backend sets httpOnly cookies for both tokens
		// Response only contains user data (no tokens)
		await response.json();
		// Fetch user profile to get complete data
		const user = await this.getCurrentUser();
		SecureStorage.setUser(user);

		return {
			user,
			token: '', // Token is in httpOnly cookie
			refreshToken: '', // Token is in httpOnly cookie
		};
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

		// Backend sets httpOnly cookies for both tokens
		// Response only contains user data (no tokens)
		await response.json();
		// Fetch user profile to get complete data
		const user = await this.getCurrentUser();
		SecureStorage.setUser(user);

		return {
			user,
			token: '', // Token is in httpOnly cookie
			refreshToken: '', // Token is in httpOnly cookie
		};
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
		await response.json();
		// Fetch user profile to get complete data
		const user = await this.getCurrentUser();
		SecureStorage.setUser(user);

		return {
			user,
			token: '', // Token is in httpOnly cookie
			refreshToken: '', // Token is in httpOnly cookie
		};
	}

	// Initiate OAuth flow by redirecting to backend
	static initiateOAuth(provider: 'github' | 'google'): void {
		// Backend should redirect back to the authorizedRedirectUri configured in application.yml
		// which is http://localhost:3000/auth/callback
		window.location.href = `${API_BASE_URL}/oauth2/authorize/${provider}`;
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

	// Note: Token refresh is handled automatically by backend JWT filter
	// No need for explicit refresh endpoint in pure cookie approach

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
}
