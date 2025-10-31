import {
	Bell,
	Download,
	Globe,
	Lock,
	Moon,
	Shield,
	Sun,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
	const [darkMode, setDarkMode] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [emailNotifications, setEmailNotifications] = useState(true);

	return (
		<div className='page-transition space-y-8'>
			<div>
				<h1 className='text-4xl font-bold mb-2'>Settings</h1>
				<p className='text-gray-600'>
					Customize your Incometer experience
				</p>
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				<div className='space-y-6'>
					<div className='card'>
						<h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
							<Sun className='w-6 h-6 text-green-600' />
							Appearance
						</h3>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
								<div className='flex items-center gap-3'>
									{darkMode ? (
										<Moon className='w-5 h-5 text-gray-600' />
									) : (
										<Sun className='w-5 h-5 text-gray-600' />
									)}
									<div>
										<div className='font-medium'>
											Dark Mode
										</div>
										<div className='text-sm text-gray-600'>
											Toggle dark theme
										</div>
									</div>
								</div>
								<button
									onClick={() => setDarkMode(!darkMode)}
									className={`relative w-14 h-8 rounded-full transition-colors ${
										darkMode
											? 'bg-green-500'
											: 'bg-gray-300'
									}`}
								>
									<div
										className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
											darkMode
												? 'translate-x-7'
												: 'translate-x-1'
										}`}
									/>
								</button>
							</div>

							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
								<div className='flex items-center gap-3'>
									<Globe className='w-5 h-5 text-gray-600' />
									<div>
										<div className='font-medium'>
											Language
										</div>
										<div className='text-sm text-gray-600'>
											Choose your language
										</div>
									</div>
								</div>
								<select className='px-4 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-100'>
									<option>English</option>
									<option>Spanish</option>
									<option>French</option>
									<option>German</option>
								</select>
							</div>

							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
								<div className='flex items-center gap-3'>
									<Globe className='w-5 h-5 text-gray-600' />
									<div>
										<div className='font-medium'>
											Currency
										</div>
										<div className='text-sm text-gray-600'>
											Display currency
										</div>
									</div>
								</div>
								<select className='px-4 py-2 rounded-xl border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-100'>
									<option>INR (₹)</option>
									<option>EUR (€)</option>
									<option>GBP (£)</option>
									<option>JPY (¥)</option>
								</select>
							</div>
						</div>
					</div>

					<div className='card'>
						<h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
							<Bell className='w-6 h-6 text-green-600' />
							Notifications
						</h3>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
								<div>
									<div className='font-medium'>
										Push Notifications
									</div>
									<div className='text-sm text-gray-600'>
										Receive app notifications
									</div>
								</div>
								<button
									onClick={() =>
										setNotifications(!notifications)
									}
									className={`relative w-14 h-8 rounded-full transition-colors ${
										notifications
											? 'bg-green-500'
											: 'bg-gray-300'
									}`}
								>
									<div
										className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
											notifications
												? 'translate-x-7'
												: 'translate-x-1'
										}`}
									/>
								</button>
							</div>

							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl'>
								<div>
									<div className='font-medium'>
										Email Notifications
									</div>
									<div className='text-sm text-gray-600'>
										Weekly summary emails
									</div>
								</div>
								<button
									onClick={() =>
										setEmailNotifications(
											!emailNotifications
										)
									}
									className={`relative w-14 h-8 rounded-full transition-colors ${
										emailNotifications
											? 'bg-green-500'
											: 'bg-gray-300'
									}`}
								>
									<div
										className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
											emailNotifications
												? 'translate-x-7'
												: 'translate-x-1'
										}`}
									/>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className='space-y-6'>
					<div className='card'>
						<h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
							<Shield className='w-6 h-6 text-green-600' />
							Privacy & Security
						</h3>
						<div className='space-y-3'>
							<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left'>
								<div className='flex items-center gap-3'>
									<Lock className='w-5 h-5 text-gray-600' />
									<div>
										<div className='font-medium'>
											Change Password
										</div>
										<div className='text-sm text-gray-600'>
											Update your password
										</div>
									</div>
								</div>
							</button>

							<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left'>
								<div className='flex items-center gap-3'>
									<Shield className='w-5 h-5 text-gray-600' />
									<div>
										<div className='font-medium'>
											Two-Factor Authentication
										</div>
										<div className='text-sm text-gray-600'>
											Add extra security
										</div>
									</div>
								</div>
								<span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold'>
									Recommended
								</span>
							</button>

							<button className='w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left'>
								<div className='flex items-center gap-3'>
									<Globe className='w-5 h-5 text-gray-600' />
									<div>
										<div className='font-medium'>
											Privacy Settings
										</div>
										<div className='text-sm text-gray-600'>
											Manage data sharing
										</div>
									</div>
								</div>
							</button>
						</div>
					</div>

					<div className='card'>
						<h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
							<Download className='w-6 h-6 text-green-600' />
							Data Management
						</h3>
						<div className='space-y-3'>
							<button className='w-full p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border-2 border-blue-200'>
								<div className='flex items-center gap-3'>
									<Download className='w-5 h-5 text-blue-600' />
									<div>
										<div className='font-medium text-blue-900'>
											Export Data
										</div>
										<div className='text-sm text-blue-700'>
											Download all your data
										</div>
									</div>
								</div>
							</button>

							<button className='w-full p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors text-left border-2 border-orange-200'>
								<div className='flex items-center gap-3'>
									<Download className='w-5 h-5 text-orange-600' />
									<div>
										<div className='font-medium text-orange-900'>
											Backup Data
										</div>
										<div className='text-sm text-orange-700'>
											Create a backup
										</div>
									</div>
								</div>
							</button>
						</div>
					</div>

					<div className='card border-2 border-red-200 bg-red-50'>
						<h3 className='text-xl font-bold mb-4 flex items-center gap-2 text-red-900'>
							<Trash2 className='w-6 h-6 text-red-600' />
							Danger Zone
						</h3>
						<p className='text-sm text-red-700 mb-4'>
							Once you delete your account, there is no going
							back. Please be certain.
						</p>
						<button className='w-full p-4 rounded-2xl bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold'>
							Delete Account
						</button>
					</div>
				</div>
			</div>

			<div className='card bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-xl font-bold mb-2'>Need Help?</h3>
						<p className='text-green-50 mb-4'>
							Check out our help center or contact support for
							assistance.
						</p>
						<div className='flex gap-3'>
							<button className='px-6 py-2 bg-white text-green-600 rounded-xl font-semibold hover:shadow-lg transition-all'>
								Help Center
							</button>
							<button className='px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all'>
								Contact Support
							</button>
						</div>
					</div>
					<div className='text-6xl'>💬</div>
				</div>
			</div>
		</div>
	);
}
