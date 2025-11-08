'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { SecureStorage } from '@/lib/secureStorage';

export default function AuthCallbackPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading'
	);
	const [message, setMessage] = useState<string>(
		'Processing authentication...'
	);

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const hashParams = new URLSearchParams(
					window.location.hash.substring(1)
				);
				const allParams = Object.fromEntries(urlParams.entries());
				const allHashParams = Object.fromEntries(hashParams.entries());

				console.log('Full OAuth callback URL:', window.location.href);
				console.log('URL search parameters:', allParams);
				console.log('URL hash parameters:', allHashParams);

				// Check both search params and hash params for tokens
				const code = searchParams.get('code') || hashParams.get('code');
				const provider =
					(searchParams.get('provider') as 'github' | 'google') ||
					(hashParams.get('provider') as 'github' | 'google') ||
					'google'; // Default to google
				const error =
					searchParams.get('error') || hashParams.get('error');
				const errorDescription =
					searchParams.get('error_description') ||
					hashParams.get('error_description');
				const accessToken =
					searchParams.get('token') || // Backend sends 'token' parameter
					hashParams.get('token') ||
					searchParams.get('access_token') ||
					hashParams.get('access_token') ||
					searchParams.get('accessToken') ||
					hashParams.get('accessToken');
				const refreshToken =
					searchParams.get('refresh_token') ||
					hashParams.get('refresh_token') ||
					searchParams.get('refreshToken') ||
					hashParams.get('refreshToken');

				console.log('OAuth callback params:', {
					code: code ? 'present' : 'missing',
					provider,
					error,
					errorDescription,
					accessToken: accessToken ? 'present' : 'missing',
					refreshToken: refreshToken ? 'present' : 'missing',
				});

				// If no parameters at all, this might be a redirect loop
				if (!code && !error && !accessToken) {
					console.warn(
						'No OAuth parameters received - possible redirect loop'
					);
					setStatus('error');
					setMessage(
						'OAuth redirect loop detected. Check backend OAuth configuration.'
					);
					return;
				}

				if (error) {
					console.error('OAuth error:', error, errorDescription);
					setStatus('error');
					setMessage(
						`Authentication failed: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`
					);
					return;
				}

				// Handle direct token response (if backend redirects with tokens)
				if (accessToken) {
					console.log('Storing access token from OAuth redirect');
					const user =
						AuthService.decodeUserFromTokenPublic(accessToken);
					SecureStorage.setUser(user);
					SecureStorage.setToken(accessToken);
					if (refreshToken) {
						SecureStorage.setRefreshToken(refreshToken);
					}

					console.log('Token stored, user:', user);
					console.log(
						'Verification - Token from storage:',
						SecureStorage.getToken() ? 'present' : 'missing'
					);

					setStatus('success');
					setMessage('Authentication successful! Redirecting...');

					// Use a shorter delay and force a full reload to ensure localStorage is persisted
					setTimeout(() => {
						console.log('Redirecting to dashboard');
						// Force a full page reload to ensure AuthProvider picks up the new tokens
						window.location.replace('/dashboard');
					}, 1000);
					return;
				}

				// Handle authorization code flow
				if (!code) {
					setStatus('error');
					setMessage('Missing authentication parameters');
					return;
				}

				// Process OAuth callback
				const response = await AuthService.signInWithOAuth(
					provider,
					code
				);
				console.log('OAuth callback successful:', response);

				// Store user data in securestorage
				SecureStorage.setUser(response.user);
				SecureStorage.setToken(response.token);
				if (response.refreshToken) {
					SecureStorage.setRefreshToken(response.refreshToken);
				}

				console.log('Token stored, user:', response.user);
				console.log(
					'Verification - Token from storage:',
					SecureStorage.getToken() ? 'present' : 'missing'
				);

				setStatus('success');
				setMessage('Authentication successful! Redirecting...');

				// Redirect to dashboard after a short delay using window.location.replace for full reload
				setTimeout(() => {
					console.log('Redirecting to dashboard');
					// Force a full page reload to ensure AuthProvider picks up the new tokens
					window.location.replace('/dashboard');
				}, 1000);
			} catch (err) {
				setStatus('error');
				setMessage(
					err instanceof Error ? err.message : 'Authentication failed'
				);
			}
		};

		handleCallback();
	}, [searchParams, router]);

	return (
		<div className='min-h-screen flex items-center justify-center bg-background px-4'>
			<Card className='w-full max-w-md mx-auto'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						{status === 'loading' && 'Authenticating...'}
						{status === 'success' && 'Success!'}
						{status === 'error' && 'Authentication Failed'}
					</CardTitle>
					<CardDescription className='text-center'>
						{message}
					</CardDescription>
				</CardHeader>
				<CardContent className='flex justify-center'>
					{status === 'loading' && (
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					)}
					{status === 'success' && (
						<CheckCircle className='h-8 w-8 text-green-500' />
					)}
					{status === 'error' && (
						<XCircle className='h-8 w-8 text-red-500' />
					)}
				</CardContent>
				{status === 'error' && (
					<CardContent>
						<Alert variant='destructive'>
							<AlertDescription>{message}</AlertDescription>
						</Alert>
						<div className='mt-4 text-center'>
							<a
								href='/auth/sign-in'
								className='text-sm text-primary hover:underline'
							>
								Return to sign in
							</a>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
