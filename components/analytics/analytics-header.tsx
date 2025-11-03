'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalyticsHeaderProps {
	timePeriod: 'all' | 'year' | 'month';
	onTimePeriodChange: (value: 'all' | 'year' | 'month') => void;
}

export function AnalyticsHeader({
	timePeriod,
	onTimePeriodChange,
}: AnalyticsHeaderProps) {
	return (
		<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Analytics & Insights
				</h1>
				<p className='text-muted-foreground mt-1'>
					Analyze your financial data and trends
				</p>
			</div>
			<div className='flex items-center gap-2'>
				<span className='text-sm text-muted-foreground'>
					Time Period:
				</span>
				<Tabs
					value={timePeriod}
					onValueChange={(value) =>
						onTimePeriodChange(value as 'all' | 'year' | 'month')
					}
					className='w-auto'
				>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='all'>All Time</TabsTrigger>
						<TabsTrigger value='year'>This Year</TabsTrigger>
						<TabsTrigger value='month'>This Month</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
		</div>
	);
}
