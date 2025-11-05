'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Edit2,
	Save,
	Tag,
	CreditCard,
	Settings,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { CategoryManagement } from '@/components/profile/CategoryManagement';
import { PaymentMethodManagement } from '@/components/profile/PaymentMethodManagement';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState('personal');
	const [profile, setProfile] = useState({
		name: 'John Doe',
		email: 'john@example.com',
		phone: '+1 (555) 123-4567',
		location: 'San Francisco, CA',
		bio: 'Financial enthusiast and budgeting expert',
		joinDate: 'January 2024',
	});

	const [editData, setEditData] = useState(profile);

	// Get userId from auth context
	const { user } = useAuthContext();
	const userId = user ? user.userId : '1';

	useEffect(() => {
		// Handle hash changes for navigation from dropdown menu
		const handleHashChange = () => {
			const hash = window.location.hash.replace('#', '');
			if (hash === 'categories' || hash === 'payment-methods') {
				setActiveTab(hash);
			}
		};

		// Check initial hash
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const handleSave = () => {
		setProfile(editData);
		setIsEditing(false);
	};

	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Profile
						</h1>
						<p className='text-muted-foreground mt-1'>
							Manage your personal information and preferences
						</p>
					</div>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className='space-y-6'
				>
					<TabsList className='w-fit justify-start bg-muted/50'>
						<TabsTrigger
							value='personal'
							className='px-3 py-2 text-sm'
						>
							<User className='h-4 w-4 mr-2' />
							Personal Info
						</TabsTrigger>
						<TabsTrigger
							value='categories'
							className='px-3 py-2 text-sm'
						>
							<Tag className='h-4 w-4 mr-2' />
							Categories
						</TabsTrigger>
						<TabsTrigger
							value='payment-methods'
							className='px-3 py-2 text-sm'
						>
							<CreditCard className='h-4 w-4 mr-2' />
							Payment Methods
						</TabsTrigger>
						<TabsTrigger
							value='account'
							className='px-3 py-2 text-sm'
						>
							<Settings className='h-4 w-4 mr-2' />
							Account
						</TabsTrigger>
					</TabsList>

					<TabsContent value='personal' className='space-y-6 mt-0'>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
							{/* Avatar Card */}
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<User className='h-5 w-5' />
										Avatar
									</CardTitle>
								</CardHeader>
								<CardContent className='flex flex-col items-center'>
									<Avatar className='h-32 w-32 mb-4'>
										<AvatarImage src='https://github.com/shadcn.png' />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
									{isEditing && (
										<Button variant='outline' size='sm'>
											Change Avatar
										</Button>
									)}
								</CardContent>
							</Card>

							{/* Profile Info */}
							<Card className='lg:col-span-2'>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle>
												Personal Information
											</CardTitle>
											<CardDescription>
												Update your profile details
											</CardDescription>
										</div>
										<Button
											variant={
												isEditing
													? 'default'
													: 'outline'
											}
											onClick={() =>
												isEditing
													? handleSave()
													: setIsEditing(true)
											}
										>
											{isEditing ? (
												<>
													<Save className='h-4 w-4 mr-2' />
													Save Changes
												</>
											) : (
												<>
													<Edit2 className='h-4 w-4 mr-2' />
													Edit Profile
												</>
											)}
										</Button>
									</div>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='name'>
												Full Name
											</Label>
											<Input
												id='name'
												value={
													isEditing
														? editData.name
														: profile.name
												}
												onChange={(e) =>
													setEditData({
														...editData,
														name: e.target.value,
													})
												}
												disabled={!isEditing}
											/>
										</div>
										<div>
											<Label
												htmlFor='email'
												className='flex items-center gap-2'
											>
												<Mail className='h-4 w-4' />
												Email
											</Label>
											<Input
												id='email'
												type='email'
												value={
													isEditing
														? editData.email
														: profile.email
												}
												onChange={(e) =>
													setEditData({
														...editData,
														email: e.target.value,
													})
												}
												disabled={!isEditing}
											/>
										</div>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<Label
												htmlFor='phone'
												className='flex items-center gap-2'
											>
												<Phone className='h-4 w-4' />
												Phone
											</Label>
											<Input
												id='phone'
												value={
													isEditing
														? editData.phone
														: profile.phone
												}
												onChange={(e) =>
													setEditData({
														...editData,
														phone: e.target.value,
													})
												}
												disabled={!isEditing}
											/>
										</div>
										<div>
											<Label
												htmlFor='location'
												className='flex items-center gap-2'
											>
												<MapPin className='h-4 w-4' />
												Location
											</Label>
											<Input
												id='location'
												value={
													isEditing
														? editData.location
														: profile.location
												}
												onChange={(e) =>
													setEditData({
														...editData,
														location:
															e.target.value,
													})
												}
												disabled={!isEditing}
											/>
										</div>
									</div>

									<div>
										<Label htmlFor='bio'>Bio</Label>
										<Textarea
											id='bio'
											value={
												isEditing
													? editData.bio
													: profile.bio
											}
											onChange={(e) =>
												setEditData({
													...editData,
													bio: e.target.value,
												})
											}
											disabled={!isEditing}
										/>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value='categories'>
						<CategoryManagement userId={userId} />
					</TabsContent>

					<TabsContent value='payment-methods'>
						<PaymentMethodManagement userId={userId} />
					</TabsContent>

					<TabsContent value='account' className='space-y-6'>
						{/* Account Info */}
						<Card>
							<CardHeader>
								<CardTitle>Account Information</CardTitle>
								<CardDescription>
									Account status and activity
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Account Status
										</p>
										<Badge className='bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300'>
											Active
										</Badge>
									</div>
									<div>
										<p className='text-sm text-muted-foreground mb-1 flex items-center gap-2'>
											<Calendar className='h-4 w-4' />
											Member Since
										</p>
										<p className='font-medium'>
											{profile.joinDate}
										</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Total Transactions
										</p>
										<p className='font-medium'>247</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Account Balance
										</p>
										<p className='font-medium text-emerald-600 dark:text-emerald-400'>
											₹32,389.75
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</AppLayout>
	);
}
