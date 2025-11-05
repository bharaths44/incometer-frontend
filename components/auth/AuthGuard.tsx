'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';

const protectedRoutes = [
	'/dashboard',
	'/expense',
	'/income',
	'/analytics',
	'/budget',
	'/target',
	'/profile',
	'/settings',
];

const authRoutes = ['/auth'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuthContext();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (isLoading) return; // Still loading auth state

		const isProtectedRoute = protectedRoutes.some((route) =>
			pathname.startsWith(route)
		);
		const isAuthRoute = authRoutes.some((route) =>
			pathname.startsWith(route)
		);

		if (isProtectedRoute && !isAuthenticated) {
			// Redirect to auth page if trying to access protected route without auth
			router.push('/auth');
		} else if (isAuthRoute && isAuthenticated) {
			// Redirect to dashboard if trying to access auth pages while authenticated
			router.push('/dashboard');
		}
	}, [isAuthenticated, isLoading, pathname, router]);

	// Show loading spinner while checking auth
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
			</div>
		);
	}

	return <>{children}</>;
}
