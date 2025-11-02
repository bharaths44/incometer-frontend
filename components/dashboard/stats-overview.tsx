'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

export function StatsOverview() {
	const stats = [
		{
			label: 'Total Income',
			value: '$45,230.50',
			change: '+12.5%',
			icon: TrendingUp,
			color: 'text-lime-500',
			bgColor: 'bg-lime-50 dark:bg-lime-950',
		},
		{
			label: 'Total Expenses',
			value: '$12,840.75',
			change: '-8.2%',
			icon: TrendingDown,
			color: 'text-red-500',
			bgColor: 'bg-red-50 dark:bg-red-950',
		},
		{
			label: 'Net Balance',
			value: '$32,389.75',
			change: '+18.7%',
			icon: DollarSign,
			color: 'text-lime-500',
			bgColor: 'bg-lime-50 dark:bg-lime-950',
		},
		{
			label: 'Savings',
			value: '$28,450.00',
			change: '+5.3%',
			icon: Wallet,
			color: 'text-lime-500',
			bgColor: 'bg-lime-50 dark:bg-lime-950',
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<Card key={index}>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm text-muted-foreground font-medium'>
										{stat.label}
									</p>
									<h3 className='text-2xl font-bold mt-2'>
										{stat.value}
									</h3>
									<p className='text-xs text-lime-600 dark:text-lime-400 mt-2'>
										{stat.change} from last month
									</p>
								</div>
								<div
									className={`${stat.bgColor} p-3 rounded-lg`}
								>
									<Icon className={`h-6 w-6 ${stat.color}`} />
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
