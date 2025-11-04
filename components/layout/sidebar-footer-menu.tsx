'use client';

import { LogOut } from 'lucide-react';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroup,
	SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserDropdownMenu } from './user-dropdown-menu';

export function SidebarFooterMenu({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{/* User Info */}
					<UserDropdownMenu user={user} />

					<Separator className='my-2' />

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
