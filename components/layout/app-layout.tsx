'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className='flex h-screen bg-background'>
			<Sidebar
				open={sidebarOpen}
				onToggle={() => setSidebarOpen(!sidebarOpen)}
			/>
			<div className='flex-1 flex flex-col overflow-hidden'>
				<TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className='flex-1 overflow-auto'>
					<div className='p-6 lg:p-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
