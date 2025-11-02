'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroup,
	SidebarGroupContent,
	useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{/* User Info */}
					<SidebarMenuItem>
						<div className='flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'>
							<Avatar className='h-8 w-8 rounded-lg shrink-0'>
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className='rounded-lg'>
									{user.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
								<p className='truncate font-medium'>
									{user.name}
								</p>
								<p className='truncate text-xs text-muted-foreground'>
									{user.email}
								</p>
							</div>
						</div>
					</SidebarMenuItem>

					<Separator className='my-2' />

					{/* Profile */}
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={pathname === '/profile'}
						>
							<Link href='/profile'>
								<User className='h-4 w-4' />
								<span>Profile</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>

					{/* Settings */}
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={pathname === '/settings'}
						>
							<Link href='/settings'>
								<Settings className='h-4 w-4' />
								<span>Settings</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>

					{/* Logout */}
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={() => {
								// TODO: Implement logout logic
								console.log('Logout clicked');
							}}
						>
							<LogOut className='h-4 w-4' />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
