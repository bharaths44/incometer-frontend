'use client';

import {
	Sidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/layout/nav-user';
import { SidebarContents } from './sidebar-contents';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// Placeholder user data - replace with actual user data when authentication is implemented
	const user = {
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: '/avatars/john-doe.jpg',
	};

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<div className='flex items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'>
					<div className='w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-100 dark:text-zinc-900 font-bold text-sm shrink-0'>
						I
					</div>
					<span className='font-semibold text-base group-data-[collapsible=icon]:hidden'>
						Incometer
					</span>
				</div>
			</SidebarHeader>

			<SidebarContents />

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
