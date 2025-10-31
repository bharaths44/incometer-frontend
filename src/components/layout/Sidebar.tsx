import {
	BarChart3,
	ChevronLeft,
	ChevronRight,
	LayoutDashboard,
	LogOut,
	Settings,
	TrendingDown,
	TrendingUp,
	User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
	currentPage: string;
	onNavigate: (page: string) => void;
	onLogout: () => void;
	isCollapsed: boolean;
	onToggleCollapse: (collapsed: boolean) => void;
	isMobileMenuOpen: boolean;
	onToggleMobileMenu: (open: boolean) => void;
}

const mainNavItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ id: 'expenses', label: 'Expenses', icon: TrendingDown },
	{ id: 'income', label: 'Income', icon: TrendingUp },
	{ id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomNavItems = [
	{ id: 'profile', label: 'Profile', icon: User },
	{ id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
	currentPage,
	onNavigate,
	onLogout,
	isCollapsed,
	onToggleCollapse,
	isMobileMenuOpen,
	onToggleMobileMenu,
}: SidebarProps) {
	return (
		<>
			{/* Desktop Sidebar */}
			<aside
				className={`hidden md:flex flex-col bg-white border-r border-gray-100 fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
					isCollapsed ? 'w-16' : 'w-64'
				}`}
			>
				<div
					className={`p-4 border-b border-gray-100 ${isCollapsed ? 'px-2' : 'p-6'}`}
				>
					<div
						className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
					>
						<div className='w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
							<TrendingUp className='w-5 h-5 text-white' />
						</div>
						{!isCollapsed && (
							<span className='text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
								Incometer
							</span>
						)}
					</div>
					<Button
						onClick={() => onToggleCollapse(!isCollapsed)}
						variant='ghost'
						size='icon'
						className='absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50'
					>
						{isCollapsed ? (
							<ChevronRight className='w-3 h-3' />
						) : (
							<ChevronLeft className='w-3 h-3' />
						)}
					</Button>
				</div>

				<nav
					className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-2`}
				>
					{mainNavItems.map((item) => (
						<Button
							key={item.id}
							onClick={() => onNavigate(item.id)}
							variant={
								currentPage === item.id ? 'default' : 'ghost'
							}
							className={`w-full ${isCollapsed ? 'px-3' : 'gap-3'} justify-start ${
								currentPage === item.id
									? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
									: ''
							}`}
							title={isCollapsed ? item.label : undefined}
						>
							<item.icon className='w-4 h-4' />
							{!isCollapsed && item.label}
						</Button>
					))}
				</nav>

				<div
					className={`border-t border-gray-100 ${isCollapsed ? 'p-2' : 'p-4'} space-y-2`}
				>
					{bottomNavItems.map((item) => (
						<Button
							key={item.id}
							onClick={() => onNavigate(item.id)}
							variant='ghost'
							className={`w-full ${isCollapsed ? 'px-3' : 'gap-3'} justify-start`}
							title={isCollapsed ? item.label : undefined}
						>
							<item.icon className='w-4 h-4' />
							{!isCollapsed && item.label}
						</Button>
					))}
					<Button
						onClick={onLogout}
						variant='destructive'
						className={`w-full ${isCollapsed ? 'px-3' : 'gap-3'} justify-start`}
						title={isCollapsed ? 'Logout' : undefined}
					>
						<LogOut className='w-4 h-4' />
						{!isCollapsed && 'Logout'}
					</Button>
				</div>
			</aside>

			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div
					className='md:hidden fixed inset-0 z-50 bg-black/50'
					onClick={() => onToggleMobileMenu(false)}
				>
					<aside className='w-64 bg-white h-full fixed left-0 top-0 shadow-lg'>
						<div className='p-6 border-b border-gray-100'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center'>
									<TrendingUp className='w-6 h-6 text-white' />
								</div>
								<span className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
									Incometer
								</span>
							</div>
						</div>

						<nav className='flex-1 p-4 space-y-2'>
							{mainNavItems.map((item) => (
								<Button
									key={item.id}
									onClick={() => {
										onNavigate(item.id);
										onToggleMobileMenu(false);
									}}
									variant={
										currentPage === item.id
											? 'default'
											: 'ghost'
									}
									className={`w-full flex items-center gap-3 justify-start ${
										currentPage === item.id
											? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
											: ''
									}`}
								>
									<item.icon className='w-4 h-4' />
									{item.label}
								</Button>
							))}
						</nav>

						<div className='p-4 border-t border-gray-100 space-y-2'>
							{bottomNavItems.map((item) => (
								<Button
									key={item.id}
									onClick={() => {
										onNavigate(item.id);
										onToggleMobileMenu(false);
									}}
									variant='ghost'
									className='w-full flex items-center gap-3 justify-start'
								>
									<item.icon className='w-4 h-4' />
									{item.label}
								</Button>
							))}
							<Button
								onClick={() => {
									onLogout();
									onToggleMobileMenu(false);
								}}
								variant='destructive'
								className='w-full flex items-center gap-3 justify-start'
							>
								<LogOut className='w-4 h-4' />
								Logout
							</Button>
						</div>
					</aside>
				</div>
			)}
		</>
	);
}
