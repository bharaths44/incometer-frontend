'use client';

import { useState, useEffect, useRef } from 'react';
import { User, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/authService';
import { SecureStorage } from '@/lib/secureStorage';

export function useAuth() {
	const [user, setUser] = useState<User | null>(() => {
		// Initialize user from localStorage on mount (SSR-safe)
		if (typeof window !== 'undefined') {
			const storedUser = SecureStorage.getUser();
			return storedUser || null;
		}
		return null;
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		// Initialize auth state from storage to prevent flash of unauthenticated state
		if (typeof window !== 'undefined') {
			const storedUser = SecureStorage.getUser();
			return !!storedUser;
		}
		return false;
	});

	// Prevent concurrent auth checks
	const authCheckInProgress = useRef(false);

	useEffect(() => {
		// Check if user is already authenticated on mount
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		// If auth check is already in progress, skip this call
		if (authCheckInProgress.current) {
			console.log(
				'Auth check already in progress, skipping duplicate call'
			);
			return;
		}

		authCheckInProgress.current = true;

		try {
			// Backend reads token from httpOnly cookie automatically
			// and auto-refreshes if needed using refreshToken cookie
			const currentUser = await AuthService.getCurrentUser();
			SecureStorage.setUser(currentUser);
			setUser(currentUser);
			setIsAuthenticated(true);
		} catch (error: any) {
			// Auth check failed - cookies invalid or expired
			console.log('Auth check failed:', error);
			SecureStorage.clearAll();
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
			authCheckInProgress.current = false;
		}
	};

	const signIn = async (
		email: string,
		password: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signIn({ email, password });
		SecureStorage.setUser(response.user);
		setUser(response.user);
		setIsAuthenticated(true);
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
		SecureStorage.setUser(response.user);
		setUser(response.user);
		setIsAuthenticated(true);
		return response;
	};

	const signInWithOAuth = async (
		provider: 'github' | 'google',
		code: string
	): Promise<AuthResponse> => {
		const response = await AuthService.signInWithOAuth(provider, code);
		SecureStorage.setUser(response.user);
		setUser(response.user);
		setIsAuthenticated(true);
		return response;
	};

	const signOut = async () => {
		await AuthService.signOut();
		setUser(null);
		setIsAuthenticated(false);
	};

	return {
		user,
		isLoading,
		isAuthenticated,
		signIn,
		signUp,
		signInWithOAuth,
		signOut,
	};
}
