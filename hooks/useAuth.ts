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
			const token = SecureStorage.getToken();
			const storedUser = SecureStorage.getUser();

			if (token) {
				// First try to load user from secure storage
				if (storedUser) {
					setUser(storedUser);
					setIsAuthenticated(true);
					return;
				}

				// Then try to get user from API
				try {
					const user = await AuthService.getCurrentUser();
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
					setUser(user);
					setIsAuthenticated(true);
					SecureStorage.setUser(user); // Store for future use
				}
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
