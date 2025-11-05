'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { OAuthProvider } from '@/types/auth';
import { AuthService } from '@/services/authService';

const signInSchema = z.object({
	email: z.email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
	onSuccess?: () => void;
	onSwitchToSignUp?: () => void;
}

const oauthProviders: OAuthProvider[] = [
	{ name: 'github', displayName: 'GitHub', icon: 'github' },
	{ name: 'google', displayName: 'Google', icon: 'chrome' },
];

export function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [oauthLoading, setOauthLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { signIn } = useAuthContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (data: SignInFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			await signIn(data.email, data.password);
			reset();
			onSuccess?.();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'An error occurred during sign in'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOAuthSignIn = async (provider: 'github' | 'google') => {
		setOauthLoading(provider);
		setError(null);

		try {
			// Initiate OAuth flow by redirecting to backend
			AuthService.initiateOAuth(provider);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: `An error occurred during ${provider} sign in`
			);
			setOauthLoading(null);
		}
	};

	const getProviderIcon = (iconName: string) => {
		switch (iconName) {
			case 'github':
				return <Github className='h-4 w-4' />;
			case 'chrome':
				return <Chrome className='h-4 w-4' />;
			default:
				return null;
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-bold text-center'>
					Welcome Back
				</CardTitle>
				<CardDescription className='text-center'>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{/* OAuth Buttons */}
					<div className='space-y-2'>
						{oauthProviders.map((provider) => (
							<Button
								key={provider.name}
								variant='outline'
								className='w-full'
								onClick={() => handleOAuthSignIn(provider.name)}
								disabled={oauthLoading !== null}
							>
								{oauthLoading === provider.name && (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								)}
								{!oauthLoading &&
									getProviderIcon(provider.icon)}
								<span className='ml-2'>
									{oauthLoading === provider.name
										? 'Connecting...'
										: `Continue with ${provider.displayName}`}
								</span>
							</Button>
						))}
					</div>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>
								Or continue with email
							</span>
						</div>
					</div>

					{/* Email/Password Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<div className='relative'>
								<Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
								<Input
									id='email'
									type='email'
									placeholder='Enter your email'
									className='pl-10'
									{...register('email')}
								/>
							</div>
							{errors.email && (
								<p className='text-sm text-destructive'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
								<Input
									id='password'
									type='password'
									placeholder='Enter your password'
									className='pl-10'
									{...register('password')}
								/>
							</div>
							{errors.password && (
								<p className='text-sm text-destructive'>
									{errors.password.message}
								</p>
							)}
						</div>

						{error && (
							<Alert variant='destructive'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
						>
							{isLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Sign In
						</Button>
					</form>

					<div className='text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Button
							variant='link'
							className='p-0 h-auto font-normal'
							onClick={onSwitchToSignUp}
						>
							Sign up
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
