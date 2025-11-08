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
		} else if (pathname === '/' && isAuthenticated) {
			// Redirect from root to dashboard if authenticated
			router.push('/dashboard');
		} else if (pathname === '/' && !isAuthenticated) {
			// Redirect from root to auth if not authenticated
			router.push('/auth');
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

	// Check if we need to redirect (don't render children during redirect)
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Show loading during redirect to prevent flash of content
	// Only for protected routes when not authenticated
	if (isProtectedRoute && !isAuthenticated) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
			</div>
		);
	}

	// Show loading when authenticated user tries to access auth pages (redirect to dashboard)
	if (isAuthRoute && isAuthenticated) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
			</div>
		);
	}

	// Show loading on root path (needs redirect)
	if (pathname === '/') {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
			</div>
		);
	}

	// Allow auth pages to render when not authenticated
	// Allow protected pages to render when authenticated
	return <>{children}</>;
}
