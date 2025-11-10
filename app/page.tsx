'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	ArrowRight,
	TrendingUp,
	PieChart,
	Shield,
	Smartphone,
} from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function LandingPage() {
	const { isAuthenticated, user } = useAuthContext();

	return (
		<div className='min-h-screen bg-linear-to-br from-background to-muted/20'>
			{/* Header */}
			<header className='border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
				<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Image
							src='/logo.svg'
							alt='Incometer Logo'
							width={40}
							height={40}
							className='w-10 h-10'
						/>
						<span className='font-semibold text-xl'>Incometer</span>
					</div>
					<div className='flex items-center gap-4'>
						{isAuthenticated ? (
							<>
								<span className='text-sm text-muted-foreground'>
									Welcome back, {user?.name || 'User'}!
								</span>
								<Link href='/dashboard'>
									<Button>Go to Dashboard</Button>
								</Link>
							</>
						) : (
							<>
								<Link href='/auth/sign-in'>
									<Button variant='ghost'>Sign In</Button>
								</Link>
								<Link href='/auth/sign-in'>
									<Button>Get Started</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className='container mx-auto px-4 py-20 text-center'>
				<div className='max-w-4xl mx-auto'>
					{isAuthenticated ? (
						<>
							<Badge variant='secondary' className='mb-4'>
								� Welcome back!
							</Badge>
							<h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
								Ready to manage your{' '}
								<span className='text-primary'>finances</span>?
							</h1>
							<p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
								Continue tracking your income and expenses. Your
								financial dashboard is waiting for you.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/dashboard'>
									<Button
										size='lg'
										className='w-full sm:w-auto'
									>
										Go to Dashboard
										<ArrowRight className='ml-2 h-5 w-5' />
									</Button>
								</Link>
								<Link href='/income'>
									<Button
										variant='outline'
										size='lg'
										className='w-full sm:w-auto'
									>
										Add Income
									</Button>
								</Link>
							</div>
						</>
					) : (
						<>
							<Badge variant='secondary' className='mb-4'>
								�🚀 Now in Production
							</Badge>
							<h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
								Track Your Finances with{' '}
								<span className='text-primary'>Precision</span>
							</h1>
							<p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
								Manage your income and expenses effortlessly.
								Get insights into your spending patterns and
								make informed financial decisions.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/auth/sign-in'>
									<Button
										size='lg'
										className='w-full sm:w-auto'
									>
										Start Tracking Free
										<ArrowRight className='ml-2 h-5 w-5' />
									</Button>
								</Link>
								<Link href='/auth/sign-in'>
									<Button
										variant='outline'
										size='lg'
										className='w-full sm:w-auto'
									>
										Sign In
									</Button>
								</Link>
							</div>
						</>
					)}
				</div>
			</section>

			{/* Features Section */}
			<section className='container mx-auto px-4 py-20'>
				<div className='text-center mb-16'>
					<h2 className='text-3xl font-bold mb-4'>
						Everything you need to manage your money
					</h2>
					<p className='text-muted-foreground max-w-2xl mx-auto'>
						Powerful features designed to give you complete control
						over your financial life.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<Card>
						<CardContent className='p-6 text-center'>
							<TrendingUp className='h-12 w-12 text-primary mx-auto mb-4' />
							<h3 className='font-semibold mb-2'>
								Income Tracking
							</h3>
							<p className='text-sm text-muted-foreground'>
								Monitor all your income sources in one place
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6 text-center'>
							<PieChart className='h-12 w-12 text-primary mx-auto mb-4' />
							<h3 className='font-semibold mb-2'>
								Expense Analytics
							</h3>
							<p className='text-sm text-muted-foreground'>
								Visualize your spending patterns with detailed
								charts
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6 text-center'>
							<Shield className='h-12 w-12 text-primary mx-auto mb-4' />
							<h3 className='font-semibold mb-2'>
								Secure & Private
							</h3>
							<p className='text-sm text-muted-foreground'>
								Your financial data is protected with
								enterprise-grade security
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className='p-6 text-center'>
							<Smartphone className='h-12 w-12 text-primary mx-auto mb-4' />
							<h3 className='font-semibold mb-2'>Mobile Ready</h3>
							<p className='text-sm text-muted-foreground'>
								Access your finances anywhere, anytime
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className='bg-muted/50 py-20'>
				<div className='container mx-auto px-4 text-center'>
					<h2 className='text-3xl font-bold mb-4'>
						Ready to take control of your finances?
					</h2>
					<p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
						Join thousands of users who are already managing their
						money smarter with Incometer.
					</p>
					<Link href='/auth/sign-in'>
						<Button size='lg'>
							Get Started Today
							<ArrowRight className='ml-2 h-5 w-5' />
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className='border-t py-8'>
				<div className='container mx-auto px-4 text-center text-muted-foreground'>
					<div className='flex items-center justify-center gap-2 mb-4'>
						<Image
							src='/logo.svg'
							alt='Incometer Logo'
							width={24}
							height={24}
							className='w-6 h-6'
						/>
						<span className='font-semibold'>Incometer</span>
					</div>
					<p>&copy; 2025 Incometer. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
