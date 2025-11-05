'use client';

import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthPageProps {
	initialMode?: AuthMode;
	onAuthSuccess?: () => void;
}

export function AuthPage({
	initialMode = 'sign-in',
	onAuthSuccess,
}: AuthPageProps) {
	const [mode, setMode] = useState<AuthMode>(initialMode);

	const handleAuthSuccess = () => {
		console.log('Authentication successful');
		onAuthSuccess?.();
	};

	const switchToSignIn = () => setMode('sign-in');
	const switchToSignUp = () => setMode('sign-up');

	return (
		<div className='min-h-screen flex items-center justify-center bg-background px-4'>
			<div className='w-full max-w-md'>
				{mode === 'sign-in' ? (
					<SignInForm
						onSuccess={handleAuthSuccess}
						onSwitchToSignUp={switchToSignUp}
					/>
				) : (
					<SignUpForm
						onSuccess={handleAuthSuccess}
						onSwitchToSignIn={switchToSignIn}
					/>
				)}
			</div>
		</div>
	);
}
