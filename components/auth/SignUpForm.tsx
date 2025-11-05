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
import { Loader2, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

const signUpSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		phoneNumber: z
			.string()
			.min(10, 'Phone number must be at least 10 digits'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
	onSuccess?: () => void;
	onSwitchToSignIn?: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { signUp } = useAuthContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = async (data: SignUpFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			await signUp(
				data.name,
				data.email,
				data.phoneNumber,
				data.password
			);
			reset();
			onSuccess?.();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'An error occurred during sign up'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-bold text-center'>
					Create Account
				</CardTitle>
				<CardDescription className='text-center'>
					Enter your information to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Full Name</Label>
						<div className='relative'>
							<User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
							<Input
								id='name'
								type='text'
								placeholder='Enter your full name'
								className='pl-10'
								{...register('name')}
							/>
						</div>
						{errors.name && (
							<p className='text-sm text-destructive'>
								{errors.name.message}
							</p>
						)}
					</div>

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
						<Label htmlFor='phoneNumber'>Phone Number</Label>
						<div className='relative'>
							<Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
							<Input
								id='phoneNumber'
								type='tel'
								placeholder='Enter your phone number'
								className='pl-10'
								{...register('phoneNumber')}
							/>
						</div>
						{errors.phoneNumber && (
							<p className='text-sm text-destructive'>
								{errors.phoneNumber.message}
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

					<div className='space-y-2'>
						<Label htmlFor='confirmPassword'>
							Confirm Password
						</Label>
						<div className='relative'>
							<Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
							<Input
								id='confirmPassword'
								type='password'
								placeholder='Confirm your password'
								className='pl-10'
								{...register('confirmPassword')}
							/>
						</div>
						{errors.confirmPassword && (
							<p className='text-sm text-destructive'>
								{errors.confirmPassword.message}
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
						Create Account
					</Button>
				</form>

				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Button
						variant='link'
						className='p-0 h-auto font-normal'
						onClick={onSwitchToSignIn}
					>
						Sign in
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
