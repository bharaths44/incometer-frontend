'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	TrendingUp,
	TrendingDown,
	BarChart3,
	User,
	Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
	open: boolean;
	onToggle: () => void;
}

const navItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/income', label: 'Income', icon: TrendingUp },
	{ href: '/expense', label: 'Expense', icon: TrendingDown },
	{ href: '/analytics', label: 'Analytics', icon: BarChart3 },
	{ href: '/profile', label: 'Profile', icon: User },
	{ href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onToggle }: SidebarProps) {
	const pathname = usePathname();

	return (
		<TooltipProvider>
			<aside
				className={cn(
					'bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0',
					open ? 'w-64' : 'w-20'
				)}
			>
				{/* Logo */}
				<div className='p-4 border-b border-sidebar-border flex items-center justify-center'>
					<div className='w-10 h-10 rounded-lg bg-linear-to-br from-sidebar-primary to-accent flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg'>
						I
					</div>
					{open && (
						<span className='ml-3 font-bold text-lg text-sidebar-foreground'>
							Incometer
						</span>
					)}
				</div>

				{/* Navigation */}
				<nav className='flex-1 p-3 space-y-2'>
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							pathname.startsWith(item.href);

						return (
							<div key={item.href}>
								{!open ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={item.href}
												className='block'
											>
												<Button
													variant='ghost'
													size='icon'
													className={cn(
														'w-full transition-colors',
														isActive
															? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent'
															: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
													)}
												>
													<Icon className='h-5 w-5' />
												</Button>
											</Link>
										</TooltipTrigger>
										<TooltipContent
											side='right'
											className='ml-2'
										>
											{item.label}
										</TooltipContent>
									</Tooltip>
								) : (
									<Link href={item.href}>
										<Button
											variant='ghost'
											className={cn(
												'w-full justify-start gap-3 transition-colors',
												isActive
													? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent'
													: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
											)}
										>
											<Icon className='h-5 w-5 shrink-0' />
											<span className='text-sm font-medium'>
												{item.label}
											</span>
										</Button>
									</Link>
								)}
							</div>
						);
					})}
				</nav>

				{/* Toggle Button at top - Hamburger in collapsed state, X in expanded */}
				<div className='p-3 border-t border-sidebar-border flex justify-center'>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								onClick={onToggle}
								className='text-sidebar-foreground hover:bg-sidebar-accent w-full'
							>
								{open ? (
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M15 19l-7-7 7-7'
										/>
									</svg>
								) : (
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' className='ml-2'>
							{open ? 'Collapse' : 'Expand'}
						</TooltipContent>
					</Tooltip>
				</div>
			</aside>
		</TooltipProvider>
	);
}
