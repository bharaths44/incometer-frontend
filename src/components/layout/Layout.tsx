import { ReactNode, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import ChatBot from '@/components/shared/ChatBot';

interface LayoutProps {
	children: ReactNode;
	currentPage: string;
	onNavigate: (page: string) => void;
	onLogout: () => void;
}

export default function Layout({
	children,
	currentPage,
	onNavigate,
	onLogout,
}: LayoutProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 flex'>
			<Sidebar
				currentPage={currentPage}
				onNavigate={onNavigate}
				onLogout={onLogout}
				isCollapsed={isSidebarCollapsed}
				onToggleCollapse={setIsSidebarCollapsed}
				isMobileMenuOpen={isMobileMenuOpen}
				onToggleMobileMenu={setIsMobileMenuOpen}
			/>

			{/* Top Bar */}
			<div className='flex-1 flex flex-col'>
				<TopBar
					onNavigate={onNavigate}
					onLogout={onLogout}
					onToggleMobileMenu={() =>
						setIsMobileMenuOpen(!isMobileMenuOpen)
					}
					isMobileMenuOpen={isMobileMenuOpen}
				/>

				<main
					className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} px-6 py-8`}
				>
					{children}
				</main>
			</div>

			<ChatBot />
		</div>
	);
}
