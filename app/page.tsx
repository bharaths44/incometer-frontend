'use client';

export default function Home() {
	// This page is just a placeholder - AuthGuard will redirect
	// to /dashboard or /auth based on authentication status
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
		</div>
	);
}
