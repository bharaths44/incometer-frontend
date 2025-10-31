import { useState } from 'react';
import { ArrowRight, Lock, Mail, TrendingUp, User } from 'lucide-react';

interface SignupProps {
	onSignup: () => void;
	onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSignup();
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 flex items-center justify-center px-6 page-transition'>
			<div className='w-full max-w-md'>
				<div className='text-center mb-10'>
					<div className='flex items-center justify-center gap-3 mb-6'>
						<div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center'>
							<TrendingUp className='w-7 h-7 text-white' />
						</div>
						<span className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
							Incometer
						</span>
					</div>
					<h1 className='text-4xl font-bold mb-3'>
						Create your account
					</h1>
					<p className='text-gray-600'>
						Start managing your finances in minutes
					</p>
				</div>

				<div className='card'>
					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Full Name
							</label>
							<div className='relative'>
								<User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='input-field pl-12'
									placeholder='John Doe'
									required
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Email
							</label>
							<div className='relative'>
								<Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='input-field pl-12'
									placeholder='you@example.com'
									required
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className='input-field pl-12'
									placeholder='••••••••'
									required
								/>
							</div>
							<p className='text-xs text-gray-500 mt-2'>
								Must be at least 8 characters long
							</p>
						</div>

						<div className='flex items-start gap-2'>
							<input
								type='checkbox'
								id='terms'
								className='w-4 h-4 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500'
								required
							/>
							<label
								htmlFor='terms'
								className='text-sm text-gray-600'
							>
								I agree to the{' '}
								<button
									type='button'
									className='text-green-600 hover:text-green-700 font-medium'
								>
									Terms of Service
								</button>{' '}
								and{' '}
								<button
									type='button'
									className='text-green-600 hover:text-green-700 font-medium'
								>
									Privacy Policy
								</button>
							</label>
						</div>

						<button
							type='submit'
							className='btn-primary w-full flex items-center justify-center gap-2'
						>
							Create Account
							<ArrowRight className='w-5 h-5' />
						</button>
					</form>
				</div>

				<p className='text-center text-gray-600 mt-6'>
					Already have an account?{' '}
					<button
						onClick={onSwitchToLogin}
						className='text-green-600 hover:text-green-700 font-semibold'
					>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}
