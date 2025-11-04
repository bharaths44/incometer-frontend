'use client';

import { type ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator
							orientation='vertical'
							className='mr-2 data-[orientation=vertical]:h-4'
						/>
					</div>
				</header>
				{/* Page Content */}
				<main className='flex-1 overflow-y-auto p-6 lg:p-8 bg-muted/10'>
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
