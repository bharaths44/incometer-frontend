'use client';

import { useState, useEffect } from 'react';
import { User, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/authService';

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
			const token = localStorage.getItem('token');
			const storedUser = localStorage.getItem('user');

			if (token) {
				// First try to load user from localStorage
				if (storedUser) {
					try {
						const user = JSON.parse(storedUser);
						setUser(user);
						setIsAuthenticated(true);
						return;
					} catch (parseError) {
						console.warn(
							'Failed to parse stored user:',
							parseError
						);
					}
				}

				// Then try to get user from API
				try {
					const user = await AuthService.getCurrentUser();
					setUser(user);
					setIsAuthenticated(true);
					localStorage.setItem('user', JSON.stringify(user)); // Update stored user
				} catch (apiError) {
					console.warn(
						'Failed to get user from API, falling back to token:',
						apiError
					);
					// Fallback to token decoding if API fails
					const user = AuthService.getCurrentUserFromToken();
					setUser(user);
					setIsAuthenticated(true);
					localStorage.setItem('user', JSON.stringify(user)); // Store for future use
				}
			}
		} catch (error) {
			console.error('Error checking auth status:', error);
			// Clear invalid tokens
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');
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
		localStorage.setItem('user', JSON.stringify(response.user));
		localStorage.setItem('token', response.token);
		if (response.refreshToken) {
			localStorage.setItem('refreshToken', response.refreshToken);
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
		localStorage.setItem('user', JSON.stringify(response.user));
		localStorage.setItem('token', response.token);
		if (response.refreshToken) {
			localStorage.setItem('refreshToken', response.refreshToken);
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
		localStorage.setItem('user', JSON.stringify(response.user));
		localStorage.setItem('token', response.token);
		if (response.refreshToken) {
			localStorage.setItem('refreshToken', response.refreshToken);
		}
		return response;
	};

	const signOut = async () => {
		await AuthService.signOut();
		setUser(null);
		setIsAuthenticated(false);
	};

	const refreshAuth = async (): Promise<AuthResponse> => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		// TODO: Implement token refresh with backend
		throw new Error('Token refresh not implemented');
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
