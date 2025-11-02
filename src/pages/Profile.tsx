import {
	Bell,
	Calendar,
	CreditCard,
	Edit2,
	MapPin,
	Shield,
	User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CategoryManagement from '../components/profile/CategoryManagement';
import PaymentMethodManagement from '../components/profile/PaymentMethodManagement';
import { getAllLucideIconNames } from '../lib/iconUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Profile() {
	const [activeTab, setActiveTab] = useState<
		'profile' | 'categories' | 'payment-methods'
	>('profile');
	const [allLucideIcons, setAllLucideIcons] = useState<string[]>([]);

	useEffect(() => {
		const loadIcons = async () => {
			const icons = await getAllLucideIconNames();
			setAllLucideIcons(icons);
		};
		loadIcons();
	}, []);

	const user = {
		name: 'Alex Morgan',
		email: 'alex.morgan@example.com',
		joinedDate: 'January 2025',
		location: 'San Francisco, CA',
		avatar: '👤',
	};

	const stats = [
		{
			label: 'Total Transactions',
			value: '247',
			icon: CreditCard,
			color: 'bg-green-100 text-green-600',
		},
		{
			label: 'Active Days',
			value: '89',
			icon: Calendar,
			color: 'bg-blue-100 text-blue-600',
		},
		{
			label: 'Categories',
			value: '12',
			icon: Bell,
			color: 'bg-orange-100 text-orange-600',
		},
	];

	const achievements = [
		{
			title: 'Early Adopter',
			description: 'Joined in the first month',
			icon: '🌟',
			earned: true,
		},
		{
			title: 'Savings Streak',
			description: '30 days of positive balance',
			icon: '🔥',
			earned: true,
		},
		{
			title: 'Budget Master',
			description: 'Stayed under budget for 3 months',
			icon: '🎯',
			earned: true,
		},
		{
			title: 'Transaction Guru',
			description: 'Logged 100+ transactions',
			icon: '💎',
			earned: true,
		},
		{
			title: 'Category King',
			description: 'Used all expense categories',
			icon: '👑',
			earned: false,
		},
		{
			title: 'Year Champion',
			description: 'Active for a full year',
			icon: '🏆',
			earned: false,
		},
	];

	return (
		<div className='page-transition space-y-8'>
			<div>
				<h1 className='text-4xl font-bold mb-2'>Profile</h1>
				<p className='text-surface-variant-foreground'>
					Manage your account and preferences
				</p>
			</div>

			{/* Tabs */}
			<div className='border-b border-gray-200'>
				<nav className='flex space-x-8'>
					<button
						onClick={() => setActiveTab('profile')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'profile'
								? 'border-green-500 text-green-600'
								: 'border-transparent text-surface-variant-foreground hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Profile
					</button>
					<button
						onClick={() => setActiveTab('categories')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'categories'
								? 'border-green-500 text-green-600'
								: 'border-transparent text-surface-variant-foreground hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Categories
					</button>
					<button
						onClick={() => setActiveTab('payment-methods')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'payment-methods'
								? 'border-green-500 text-green-600'
								: 'border-transparent text-surface-variant-foreground hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						Payment Methods
					</button>
				</nav>
			</div>

			{/* Tab Content */}
			{activeTab === 'profile' && (
				<div className='grid lg:grid-cols-3 gap-6'>
					<Card className='lg:col-span-1'>
						<CardContent className='text-center pt-6'>
							<div className='w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg'>
								{user.avatar}
							</div>
							<h2 className='text-2xl font-bold mb-1'>
								{user.name}
							</h2>
							<p className='text-surface-variant-foreground mb-6'>
								{user.email}
							</p>
							<Button className='w-full flex items-center justify-center gap-2'>
								<Edit2 className='w-4 h-4' />
								Edit Profile
							</Button>

							<div className='mt-6 pt-6 border-t border-gray-100 space-y-4'>
								<div className='flex items-center gap-3 text-gray-700'>
									<Calendar className='w-5 h-5 text-gray-400' />
									<div>
										<div className='text-sm text-surface-variant-foreground'>
											Member since
										</div>
										<div className='font-medium'>
											{user.joinedDate}
										</div>
									</div>
								</div>
								<div className='flex items-center gap-3 text-gray-700'>
									<MapPin className='w-5 h-5 text-gray-400' />
									<div>
										<div className='text-sm text-surface-variant-foreground'>
											Location
										</div>
										<div className='font-medium'>
											{user.location}
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className='lg:col-span-2 space-y-6'>
						<div className='grid sm:grid-cols-3 gap-4'>
							{stats.map((stat, index) => (
								<Card
									key={index}
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<CardContent className='pt-6'>
										<div
											className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-3`}
										>
											<stat.icon className='w-6 h-6' />
										</div>
										<div className='text-3xl font-bold mb-1'>
											{stat.value}
										</div>
										<div className='text-sm text-surface-variant-foreground'>
											{stat.label}
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Account Settings</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background transition-colors'>
										<div className='flex items-center gap-3'>
											<User className='w-5 h-5 text-surface-variant-foreground' />
											<div className='text-left'>
												<div className='font-medium'>
													Personal Information
												</div>
												<div className='text-sm text-surface-variant-foreground'>
													Update your name and email
												</div>
											</div>
										</div>
										<Edit2 className='w-5 h-5 text-gray-400' />
									</button>

									<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background transition-colors'>
										<div className='flex items-center gap-3'>
											<Shield className='w-5 h-5 text-surface-variant-foreground' />
											<div className='text-left'>
												<div className='font-medium'>
													Security
												</div>
												<div className='text-sm text-surface-variant-foreground'>
													Password and authentication
												</div>
											</div>
										</div>
										<Edit2 className='w-5 h-5 text-gray-400' />
									</button>

									<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background transition-colors'>
										<div className='flex items-center gap-3'>
											<Bell className='w-5 h-5 text-surface-variant-foreground' />
											<div className='text-left'>
												<div className='font-medium'>
													Notifications
												</div>
												<div className='text-sm text-surface-variant-foreground'>
													Email and push notifications
												</div>
											</div>
										</div>
										<Edit2 className='w-5 h-5 text-gray-400' />
									</button>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Achievements</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid sm:grid-cols-2 gap-4'>
									{achievements.map((achievement, index) => (
										<div
											key={index}
											className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
												achievement.earned
													? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
													: 'bg-background border-gray-200 opacity-60'
											}`}
										>
											<div className='text-4xl mb-2'>
												{achievement.icon}
											</div>
											<div className='font-bold mb-1'>
												{achievement.title}
											</div>
											<div className='text-sm text-surface-variant-foreground'>
												{achievement.description}
											</div>
											{achievement.earned && (
												<div className='mt-2 text-xs font-semibold text-green-600'>
													Earned ✓
												</div>
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			)}

			{activeTab === 'categories' && (
				<Card>
					<CardContent className='pt-6'>
						{allLucideIcons.length > 0 ? (
							<CategoryManagement
								userId={1}
								allLucideIcons={allLucideIcons}
							/>
						) : (
							<div className='flex items-center justify-center py-8'>
								<div className='text-surface-variant-foreground'>
									Loading icons...
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{activeTab === 'payment-methods' && (
				<Card>
					<CardContent className='pt-6'>
						{allLucideIcons.length > 0 ? (
							<PaymentMethodManagement
								userId={1}
								allLucideIcons={allLucideIcons}
							/>
						) : (
							<div className='flex items-center justify-center py-8'>
								<div className='text-surface-variant-foreground'>
									Loading icons...
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
