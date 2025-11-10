'use client';
import { Button } from '@/components/ui/button';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

export default function DashboardPage() {
	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
					<div>
						<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
							Dashboard
						</h1>
						<p className='text-muted-foreground mt-1'>
							Welcome back! Here&apos;s your financial overview.
						</p>
					</div>
					<div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
						<Button
							variant='outline'
							size='sm'
							className='w-full sm:w-auto'
						>
							<Plus
								className='h-4 w-4 mr-2'
								suppressHydrationWarning
							/>
							Add Income
						</Button>
						<Button size='sm' className='w-full sm:w-auto'>
							<Plus
								className='h-4 w-4 mr-2'
								suppressHydrationWarning
							/>
							Add Expense
						</Button>
					</div>
				</div>

				{/* Stats Overview */}
				<StatsOverview />

				{/* Charts and Recent */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<div className='lg:col-span-2'>
						<DashboardCharts />
					</div>
					<div>
						<RecentTransactions />
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
