'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
	onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
	return (
		<header className='bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-8 gap-4'>
			<Button
				variant='ghost'
				size='icon'
				onClick={onMenuClick}
				className='lg:hidden'
			>
				<Menu className='h-5 w-5' />
			</Button>

			<div className='hidden md:flex flex-1 max-w-md'>
				<div className='relative w-full'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search transactions...'
						className='pl-10 bg-muted border-0 text-sm focus-visible:ring-primary'
					/>
				</div>
			</div>

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
