'use client';

import Link from 'next/link';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AuthLandingPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background px-4'>
			<div className='w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card className='p-6'>
					<CardHeader>
						<CardTitle className='text-lg'>Sign in</CardTitle>
						<CardDescription>
							Access your account and manage your finances.
						</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col items-start gap-4 mt-4'>
						<p className='text-sm text-muted-foreground'>
							Already have an account? Use your email or continue
							with OAuth providers.
						</p>
						<div className='w-full flex gap-3'>
							<Link href='/auth/sign-in' className='w-full'>
								<Button className='w-full' variant='default'>
									Go to Sign in
									<ArrowRight className='ml-2 h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className='p-6'>
					<CardHeader>
						<CardTitle className='text-lg'>
							Create account
						</CardTitle>
						<CardDescription>
							Sign up with email and start tracking income &
							expenses.
						</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col items-start gap-4 mt-4'>
						<p className='text-sm text-muted-foreground'>
							New here? Create an account to save your data and
							view analytics.
						</p>
						<div className='w-full flex gap-3'>
							<Link href='/auth/sign-up' className='w-full'>
								<Button className='w-full' variant='secondary'>
									Create Account
									<ArrowRight className='ml-2 h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
