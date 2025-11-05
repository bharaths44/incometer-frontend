'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (email: string, password: string) => Promise<AuthResponse>;
	signUp: (
		name: string,
		email: string,
		phoneNumber: string,
		password: string
	) => Promise<AuthResponse>;
	signInWithOAuth: (
		provider: 'github' | 'google',
		code: string
	) => Promise<AuthResponse>;
	signOut: () => Promise<void>;
	refreshAuth: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = useAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}
