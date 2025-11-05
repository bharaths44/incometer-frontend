'use client';

import { AuthPage } from '@/components/auth/AuthPage';

export default function SignUpPage() {
	const handleAuthSuccess = () => {
		// Redirect to dashboard or home page after successful authentication
		window.location.href = '/dashboard';
	};

	return <AuthPage initialMode='sign-up' onAuthSuccess={handleAuthSuccess} />;
}
