'use client';

import { PanelLeft, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function TopBar() {
	return (
		<header className='bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-5 gap-4'>
			<SidebarTrigger />

			<div className='flex items-center gap-2 ml-auto'>
				<Button
					variant='ghost'
					size='icon'
					className='hover:bg-primary/10 hover:text-primary'
				>
					<Bell className='h-5 w-5' />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon'>
							<Avatar className='h-8 w-8'>
								<AvatarImage src='https://github.com/shadcn.png' />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
