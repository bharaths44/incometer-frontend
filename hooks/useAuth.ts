'use client';

import { useState, useEffect } from 'react';
import { User, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/authService';
import { SecureStorage } from '@/lib/secureStorage';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check if user is already authenticated on mount
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			console.log('checkAuthStatus: Starting authentication check');

			// First check if there's a token in URL parameters (for OAuth redirect)
			if (typeof window !== 'undefined') {
				const urlParams = new URLSearchParams(window.location.search);
				const tokenFromUrl =
					urlParams.get('token') || urlParams.get('access_token');
				const refreshTokenFromUrl =
					urlParams.get('refresh_token') ||
					urlParams.get('refreshToken');

				if (tokenFromUrl) {
					console.log(
						'Found token in URL, processing OAuth redirect'
					);
					try {
						// Process the token like the callback page does
						const decodedUser =
							AuthService.decodeUserFromTokenPublic(tokenFromUrl);
						console.log('Decoded user from URL token:', {
							decodedUser,
							hasUserId: !!decodedUser.userId,
							hasEmail: !!decodedUser.email,
							userIdValue: decodedUser.userId,
							emailValue: decodedUser.email,
						});

						SecureStorage.setUser(decodedUser);
						SecureStorage.setToken(tokenFromUrl);
						if (refreshTokenFromUrl) {
							SecureStorage.setRefreshToken(refreshTokenFromUrl);
						}

						// Clean up URL
						const url = new URL(window.location.href);
						url.searchParams.delete('token');
						url.searchParams.delete('access_token');
						url.searchParams.delete('refresh_token');
						url.searchParams.delete('refreshToken');
						window.history.replaceState({}, '', url.toString());

						setUser(decodedUser);
						setIsAuthenticated(true);
						setIsLoading(false);
						return;
					} catch (error) {
						console.error(
							'Error processing OAuth redirect:',
							error
						);
						throw error; // Re-throw to be caught by outer catch
					}
				}
			}

			const token = SecureStorage.getToken();
			const storedUser = SecureStorage.getUser();

			console.log(
				'checkAuthStatus: Token present:',
				token ? 'yes' : 'no'
			);
			console.log(
				'checkAuthStatus: Stored user present:',
				storedUser ? 'yes' : 'no'
			);

			if (token) {
				// First try to load user from secure storage
				if (storedUser) {
					console.log(
						'checkAuthStatus: Loading user from storage:',
						storedUser.email
					);
					setUser(storedUser);
					setIsAuthenticated(true);
					return;
				}

				// Then try to get user from API
				try {
					console.log('checkAuthStatus: Fetching user from API');
					const user = await AuthService.getCurrentUser();
					console.log(
						'checkAuthStatus: User fetched from API:',
						user.email
					);
					setUser(user);
					setIsAuthenticated(true);
					SecureStorage.setUser(user); // Update stored user
				} catch (apiError) {
					console.warn(
						'Failed to get user from API, falling back to token:',
						apiError
					);
					// Fallback to token decoding if API fails
					const user = AuthService.getCurrentUserFromToken();
					console.log(
						'checkAuthStatus: User decoded from token:',
						user.email
					);
					setUser(user);
					setIsAuthenticated(true);
					SecureStorage.setUser(user); // Store for future use
				}
			} else {
				console.log(
					'checkAuthStatus: No token found, user not authenticated'
				);
			}
		} catch (error) {
			console.error('Error checking auth status:', error);
			// Clear invalid tokens
			SecureStorage.clearAll();
		} finally {
			setIsLoading(false);
		}
	};

	const signIn = async (
		email: string,
		password: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signIn({ email, password });
		setUser(response.user);
		setIsAuthenticated(true);
		SecureStorage.setUser(response.user);
		SecureStorage.setToken(response.token);
		if (response.refreshToken) {
			SecureStorage.setRefreshToken(response.refreshToken);
		}
		return response;
	};

	const signUp = async (
		name: string,
		email: string,
		phoneNumber: string,
		password: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signUp({
			name,
			email,
			phoneNumber,
			password,
		});
		setUser(response.user);
		setIsAuthenticated(true);
		SecureStorage.setUser(response.user);
		SecureStorage.setToken(response.token);
		if (response.refreshToken) {
			SecureStorage.setRefreshToken(response.refreshToken);
		}
		return response;
	};

	const signInWithOAuth = async (
		provider: 'github' | 'google',
		code: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signInWithOAuth(provider, code);
		setUser(response.user);
		setIsAuthenticated(true);
		SecureStorage.setUser(response.user);
		SecureStorage.setToken(response.token);
		if (response.refreshToken) {
			SecureStorage.setRefreshToken(response.refreshToken);
		}
		return response;
	};

	const signOut = async () => {
		await AuthService.signOut();
		setUser(null);
		setIsAuthenticated(false);
	};

	const refreshAuth = async (): Promise<AuthResponse> => {
		const refreshToken = SecureStorage.getRefreshToken();
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await AuthService.refresh(refreshToken);
		setUser(response.user);
		setIsAuthenticated(true);
		SecureStorage.setUser(response.user);
		SecureStorage.setToken(response.token);
		if (response.refreshToken) {
			SecureStorage.setRefreshToken(response.refreshToken);
		}
		return response;
	};

	return {
		user,
		isLoading,
		isAuthenticated,
		signIn,
		signUp,
		signInWithOAuth,
		signOut,
		refreshAuth,
	};
}
