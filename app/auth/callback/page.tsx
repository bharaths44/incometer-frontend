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
import { API_BASE_URL } from '@/lib/constants';

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

				// If no parameters at all, check if httpOnly cookie was set
				if (!code && !error && !accessToken) {
					console.log(
						'No URL parameters - checking for httpOnly cookie authentication'
					);
					console.log('Current URL:', window.location.href);
					console.log('API_BASE_URL:', API_BASE_URL);

					// Check if frontend and backend are on same domain
					const frontendOrigin = window.location.origin;
					const backendOrigin = new URL(API_BASE_URL).origin;
					const isSameOrigin = frontendOrigin === backendOrigin;

					console.log('Origin check:', {
						frontend: frontendOrigin,
						backend: backendOrigin,
						isSameOrigin,
					});

					if (!isSameOrigin) {
						console.warn(
							'⚠️ CROSS-ORIGIN DETECTED: Frontend and backend are on different domains.'
						);
						console.warn(
							'HttpOnly cookies will not work across origins without proper CORS configuration.'
						);
						console.warn(
							'Backend must set: SameSite=None; Secure; and configure CORS to allow credentials.'
						);
						console.warn(
							'Alternatively, backend should send tokens via URL parameters.'
						);

						setStatus('error');
						setMessage(
							'Authentication callback received no parameters. This may be due to cross-origin cookie restrictions. Please ensure your backend is configured to either: (1) Send tokens via URL parameters, or (2) Set cookies with SameSite=None and Secure attributes with proper CORS configuration.'
						);
						return;
					}

					// Backend may have set httpOnly cookie and redirected without params
					// Try to fetch user data to verify authentication
					try {
						console.log(
							'Making request to /users/me with credentials...'
						);
						const userResponse = await fetch(
							`${API_BASE_URL}/users/me`,
							{
								credentials: 'include', // Send httpOnly cookies
								headers: {
									'Content-Type': 'application/json',
								},
							}
						);

						console.log('Response status:', userResponse.status);
						console.log('Response ok:', userResponse.ok);

						// Log response headers (excluding sensitive ones)
						const headers: Record<string, string> = {};
						userResponse.headers.forEach((value, key) => {
							if (
								!key.toLowerCase().includes('authorization') &&
								!key.toLowerCase().includes('cookie')
							) {
								headers[key] = value;
							}
						});
						console.log('Response headers:', headers);

						if (userResponse.ok) {
							const userData = await userResponse.json();
							console.log(
								'✅ Authenticated via httpOnly cookie, user data:',
								userData
							);

							// Store user data (token is in httpOnly cookie)
							SecureStorage.setUser({
								userId: userData.userId,
								name: userData.name,
								email: userData.email,
								phoneNumber: userData.phoneNumber || '',
								createdAt:
									userData.createdAt ||
									new Date().toISOString(),
								updatedAt:
									userData.updatedAt ||
									new Date().toISOString(),
							});

							setStatus('success');
							setMessage(
								'Authentication successful! Redirecting...'
							);

							setTimeout(() => {
								window.location.replace('/dashboard');
							}, 1000);
							return;
						} else {
							const errorText = await userResponse.text();
							console.error(
								'❌ Authentication failed:',
								userResponse.status,
								errorText
							);
							setStatus('error');
							setMessage(
								`Authentication failed (${userResponse.status}): Cross-origin cookie issue detected. Backend needs to send tokens via URL or configure CORS properly. Error: ${errorText}`
							);
							return;
						}
					} catch (error) {
						console.error(
							'❌ Network error checking httpOnly cookie auth:',
							error
						);
						setStatus('error');
						setMessage(
							`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. If cross-origin, backend must send tokens in URL.`
						);
						return;
					}
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
							<AlertDescription className='space-y-2'>
								<div>{message}</div>
								{message.includes('cross-origin') && (
									<div className='mt-3 p-3 bg-muted/50 rounded-md text-sm'>
										<p className='font-semibold mb-2'>
											🔧 Backend Configuration Required:
										</p>
										<ol className='list-decimal list-inside space-y-1 text-xs'>
											<li>
												Send tokens via URL parameters
												(redirect to
												callback?token=...), OR
											</li>
											<li>
												Change cookie SameSite from
												&quot;Lax&quot; to
												&quot;None&quot; and configure
												CORS
											</li>
										</ol>
										<p className='mt-2 text-xs text-muted-foreground'>
											See OAUTH_CROSS_ORIGIN_ISSUE.md for
											detailed instructions.
										</p>
									</div>
								)}
							</AlertDescription>
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
