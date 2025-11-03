'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	TrendingUp,
	TrendingDown,
	BarChart3,
	Wallet,
	Goal,
} from 'lucide-react';
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/income', label: 'Income', icon: TrendingUp },
	{ href: '/expense', label: 'Expense', icon: TrendingDown },
	{ href: '/budget', label: 'Budget', icon: Wallet },
	{ href: '/target', label: 'Target', icon: Goal },
	{ href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function SidebarContents() {
	const pathname = usePathname();

	return (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive =
								pathname === item.href ||
								pathname.startsWith(item.href);

							return (
								<SidebarMenuItem
									key={item.href}
									className='flex items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'
								>
									<SidebarMenuButton
										asChild
										isActive={isActive}
										tooltip={item.label}
										size='lg'
									>
										<Link href={item.href}>
											<Icon className='h-5 w-5' />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}
