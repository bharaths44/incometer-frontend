import { ChevronRight, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
	onNavigate: (page: string) => void;
	onLogout: () => void;
	onToggleMobileMenu: () => void;
	isMobileMenuOpen: boolean;
}

export default function TopBar({
	onNavigate,
	onLogout,
	onToggleMobileMenu,
	isMobileMenuOpen,
}: TopBarProps) {
	return (
		<nav className='bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95'>
			<div className='w-full px-6 py-4'>
				<div className='flex items-center justify-end w-full'>
					<div className='flex items-center gap-4'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className='flex items-center gap-2 border-gray-300'
								>
									<User className='w-4 h-4' />
									Account
									<ChevronRight className='w-3 h-3 rotate-90' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-48 z-[60]'
							>
								<DropdownMenuItem
									onClick={() => onNavigate('profile')}
								>
									<User className='w-4 h-4 mr-2' />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => onNavigate('settings')}
								>
									<Settings className='w-4 h-4 mr-2' />
									Settings
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={onLogout}
									className='text-error focus:text-error'
								>
									<LogOut className='w-4 h-4 mr-2' />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<Button
							onClick={onToggleMobileMenu}
							variant='ghost'
							size='icon'
							className='md:hidden'
						>
							{isMobileMenuOpen ? (
								<X className='w-6 h-6' />
							) : (
								<Menu className='w-6 h-6' />
							)}
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
