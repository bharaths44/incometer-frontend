'use client';

import Image from 'next/image';
import {
	Sidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarFooterMenu } from '@/components/layout/sidebar-footer-menu';
import { SidebarContents } from './sidebar-contents';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// Placeholder user data - replace with actual user data when authentication is implemented
	const user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: '', // Empty string will use the AvatarFallback
	};

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<div className='flex items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'>
					<Image
						src='/logo.svg'
						alt='Incometer Logo'
						width={40}
						height={40}
						className='w-10 h-10 shrink-0'
					/>
					<span className='font-semibold text-base group-data-[collapsible=icon]:hidden'>
						Incometer
					</span>
				</div>
			</SidebarHeader>

			<SidebarContents />

			<SidebarFooter>
				<SidebarFooterMenu user={user} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
