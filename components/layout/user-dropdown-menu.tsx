'use client';

import Link from 'next/link';
import { User, Settings, Tag, CreditCard, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserDropdownMenuProps {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}

export function UserDropdownMenu({ user }: UserDropdownMenuProps) {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton
						size='lg'
						className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
					>
						<div className='flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center w-full'>
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
							<div className='flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden flex flex-col'>
								<span className='truncate font-medium'>
									{user.name}
								</span>
								<span className='truncate text-xs'>
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4 group-data-[collapsible=icon]:hidden' />
						</div>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
					side={isMobile ? 'bottom' : 'right'}
					align='end'
					sideOffset={4}
				>
					<DropdownMenuLabel className='p-0 font-normal'>
						<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className='rounded-lg'>
									CN
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-medium'>
									{user.name}
								</span>
								<span className='truncate text-xs'>
									{user.email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href='/profile'>
								<User className='mr-2 h-4 w-4' />
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/settings'>
								<Settings className='mr-2 h-4 w-4' />
								Settings
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href='/profile#categories'>
								<Tag className='mr-2 h-4 w-4' />
								Edit Categories
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/profile#payment-methods'>
								<CreditCard className='mr-2 h-4 w-4' />
								Edit Payment Methods
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
