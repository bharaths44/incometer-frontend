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
			const currentUser = await AuthService.getCurrentUser();
			setUser(currentUser);
			setIsAuthenticated(true);
		} catch {
			// If API call fails, user is not authenticated
			setUser(null);
			setIsAuthenticated(false);
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
		// Tokens are now stored in httpOnly cookies, not localStorage
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
		// Tokens are now stored in httpOnly cookies, not localStorage
		return response;
	};

	const signInWithOAuth = async (
		provider: 'github' | 'google',
		code: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signInWithOAuth(provider, code);
		setUser(response.user);
		setIsAuthenticated(true);
		// Tokens are now stored in httpOnly cookies, not localStorage
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
		// Tokens are now stored in httpOnly cookies, not localStorage
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
