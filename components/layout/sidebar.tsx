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
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/layout/nav-user';

const navItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/income', label: 'Income', icon: TrendingUp },
	{ href: '/expense', label: 'Expense', icon: TrendingDown },
	{ href: '/analytics', label: 'Analytics', icon: BarChart3 },
	{ href: '/profile', label: 'Profile', icon: User },
	{ href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	// Placeholder user data - replace with actual user data when authentication is implemented
	const user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: '/avatars/john-doe.jpg',
	};

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<div className='flex items-center justify-center p-4 border-b border-sidebar-border'>
					<div className='w-10 h-10 rounded-lg bg-linear-to-br from-sidebar-primary to-accent flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg'>
						I
					</div>
					<span className='ml-3 font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden'>
						Incometer
					</span>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							pathname.startsWith(item.href);

						return (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link href={item.href}>
										<Icon
											className='h-5 w-5'
											suppressHydrationWarning
										/>
										<span>{item.label}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
