'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Bell, Lock, LogOut, Trash2, Moon } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { useState } from 'react';

export default function SettingsPage() {
	const [settings, setSettings] = useState({
		emailNotifications: true,
		pushNotifications: false,
		monthlyReport: true,
		darkMode: false,
		currency: 'USD',
		language: 'EN',
	});

	const handleToggle = (key: string) => {
		setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSelectChange = (key: string, value: string) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Settings
					</h1>
					<p className='text-muted-foreground mt-1'>
						Manage your application preferences and security
					</p>
				</div>

				<Tabs defaultValue='general' className='w-full'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='general'>General</TabsTrigger>
						<TabsTrigger value='notifications'>
							Notifications
						</TabsTrigger>
						<TabsTrigger value='security'>Security</TabsTrigger>
					</TabsList>

					{/* General Settings */}
					<TabsContent value='general' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle>Display Preferences</CardTitle>
								<CardDescription>
									Customize how the app looks and feels
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								{/* Dark Mode */}
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<Moon className='h-5 w-5 text-muted-foreground' />
										<div>
											<Label className='text-base font-medium'>
												Dark Mode
											</Label>
											<p className='text-sm text-muted-foreground'>
												Enable dark theme for the
												application
											</p>
										</div>
									</div>
									<Switch
										checked={settings.darkMode}
										onCheckedChange={() =>
											handleToggle('darkMode')
										}
									/>
								</div>

								{/* Currency */}
								<div>
									<Label
										htmlFor='currency'
										className='text-base font-medium'
									>
										Currency
									</Label>
									<p className='text-sm text-muted-foreground mb-2'>
										Select your preferred currency
									</p>
									<Select
										value={settings.currency}
										onValueChange={(value) =>
											handleSelectChange(
												'currency',
												value
											)
										}
									>
										<SelectTrigger id='currency'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='USD'>
												USD - US Dollar
											</SelectItem>
											<SelectItem value='EUR'>
												EUR - Euro
											</SelectItem>
											<SelectItem value='GBP'>
												GBP - British Pound
											</SelectItem>
											<SelectItem value='JPY'>
												JPY - Japanese Yen
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Language */}
								<div>
									<Label
										htmlFor='language'
										className='text-base font-medium'
									>
										Language
									</Label>
									<p className='text-sm text-muted-foreground mb-2'>
										Choose your preferred language
									</p>
									<Select
										value={settings.language}
										onValueChange={(value) =>
											handleSelectChange(
												'language',
												value
											)
										}
									>
										<SelectTrigger id='language'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='EN'>
												English
											</SelectItem>
											<SelectItem value='ES'>
												Español
											</SelectItem>
											<SelectItem value='FR'>
												Français
											</SelectItem>
											<SelectItem value='DE'>
												Deutsch
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Notifications */}
					<TabsContent value='notifications' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Bell className='h-5 w-5' />
									Notification Settings
								</CardTitle>
								<CardDescription>
									Control how you receive notifications
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								{/* Email Notifications */}
								<div className='flex items-center justify-between'>
									<div>
										<Label className='text-base font-medium'>
											Email Notifications
										</Label>
										<p className='text-sm text-muted-foreground'>
											Receive important updates via email
										</p>
									</div>
									<Switch
										checked={settings.emailNotifications}
										onCheckedChange={() =>
											handleToggle('emailNotifications')
										}
									/>
								</div>

								{/* Push Notifications */}
								<div className='flex items-center justify-between'>
									<div>
										<Label className='text-base font-medium'>
											Push Notifications
										</Label>
										<p className='text-sm text-muted-foreground'>
											Receive real-time alerts on your
											device
										</p>
									</div>
									<Switch
										checked={settings.pushNotifications}
										onCheckedChange={() =>
											handleToggle('pushNotifications')
										}
									/>
								</div>

								{/* Monthly Report */}
								<div className='flex items-center justify-between'>
									<div>
										<Label className='text-base font-medium'>
											Monthly Report
										</Label>
										<p className='text-sm text-muted-foreground'>
											Get a monthly summary of your
											finances
										</p>
									</div>
									<Switch
										checked={settings.monthlyReport}
										onCheckedChange={() =>
											handleToggle('monthlyReport')
										}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Security */}
					<TabsContent value='security' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Lock className='h-5 w-5' />
									Security & Privacy
								</CardTitle>
								<CardDescription>
									Manage your account security
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Change Password */}
								<div className='flex items-center justify-between py-4 border-b'>
									<div>
										<Label className='text-base font-medium'>
											Change Password
										</Label>
										<p className='text-sm text-muted-foreground'>
											Update your password regularly
										</p>
									</div>
									<Button variant='outline'>Change</Button>
								</div>

								{/* Two Factor Authentication */}
								<div className='flex items-center justify-between py-4 border-b'>
									<div>
										<Label className='text-base font-medium'>
											Two-Factor Authentication
										</Label>
										<p className='text-sm text-muted-foreground'>
											Add an extra layer of security
										</p>
									</div>
									<Button variant='outline'>Enable</Button>
								</div>

								{/* Logout */}
								<div className='flex items-center justify-between py-4 border-b'>
									<div>
										<Label className='text-base font-medium flex items-center gap-2'>
											<LogOut className='h-4 w-4' />
											Logout
										</Label>
										<p className='text-sm text-muted-foreground'>
											Sign out from all devices
										</p>
									</div>
									<Button variant='outline'>
										Logout All
									</Button>
								</div>

								{/* Delete Account */}
								<div className='flex items-center justify-between py-4'>
									<div>
										<Label className='text-base font-medium text-destructive flex items-center gap-2'>
											<Trash2 className='h-4 w-4' />
											Delete Account
										</Label>
										<p className='text-sm text-muted-foreground'>
											Permanently delete your account and
											data
										</p>
									</div>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant='destructive'>
												Delete
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogTitle>
												Delete Account
											</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to
												permanently delete your account?
												This action cannot be undone.
											</AlertDialogDescription>
											<div className='flex gap-2 justify-end'>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction className='bg-destructive hover:bg-destructive/90'>
													Delete
												</AlertDialogAction>
											</div>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</AppLayout>
	);
}
