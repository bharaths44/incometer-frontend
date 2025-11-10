'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroup,
	SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserDropdownMenu } from './user-dropdown-menu';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function SidebarFooterMenu({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { signOut } = useAuthContext();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut();
			router.push('/auth/sign-in');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

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
							onClick={handleLogout}
							className='group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full'
						>
							<LogOut className='h-4 w-4' />
							<span className='group-data-[collapsible=icon]:hidden'>
								Logout
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
