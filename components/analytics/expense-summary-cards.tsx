'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { ExpenseSummary } from '@/types/analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseSummaryCardsProps {
	expenseSummary: ExpenseSummary | undefined;
	isLoading: boolean;
}

export function ExpenseSummaryCards({
	expenseSummary,
	isLoading,
}: ExpenseSummaryCardsProps) {
	if (isLoading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='border shadow-sm'>
						<CardContent className='pt-6'>
							<Skeleton className='h-24 w-full' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!expenseSummary) {
		return null;
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	const formatPercentage = (value: number | null) => {
		if (value === null || value === undefined) {
			return 'N/A';
		}
		const sign = value >= 0 ? '+' : '';
		return `${sign}${value.toFixed(1)}%`;
	};

	const stats = [
		{
			label: 'Total Income',
			value: formatCurrency(expenseSummary.totalIncome),
			change: formatPercentage(expenseSummary.incomePercentageChange),
			changeValue: expenseSummary.incomePercentageChange,
			icon: TrendingUp,
			color: 'text-emerald-600 dark:text-emerald-400',
			bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
		},
		{
			label: 'Total Expenses',
			value: formatCurrency(expenseSummary.totalExpense),
			change: formatPercentage(expenseSummary.expensePercentageChange),
			changeValue: expenseSummary.expensePercentageChange,
			icon: TrendingDown,
			color: 'text-red-600 dark:text-red-400',
			bgColor: 'bg-red-50 dark:bg-red-950/50',
		},
		{
			label: 'Net Savings',
			value: formatCurrency(expenseSummary.netSavings),
			change: formatPercentage(expenseSummary.savingsPercentageChange),
			changeValue: expenseSummary.savingsPercentageChange,
			icon: DollarSign,
			color:
				expenseSummary.netSavings >= 0
					? 'text-emerald-600 dark:text-emerald-400'
					: 'text-red-600 dark:text-red-400',
			bgColor:
				expenseSummary.netSavings >= 0
					? 'bg-emerald-50 dark:bg-emerald-950/50'
					: 'bg-red-50 dark:bg-red-950/50',
		},
		{
			label: 'Current Month',
			value: formatCurrency(expenseSummary.currentMonthExpense),
			change: `Income: ${formatCurrency(expenseSummary.currentMonthIncome)}`,
			changeValue: null,
			icon: Wallet,
			color: 'text-zinc-600 dark:text-zinc-400',
			bgColor: 'bg-zinc-100 dark:bg-zinc-800/50',
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				const hasPositiveChange =
					stat.changeValue !== null && stat.changeValue >= 0;
				const changeColor =
					stat.changeValue !== null
						? hasPositiveChange && index !== 1
							? 'text-emerald-600 dark:text-emerald-400'
							: !hasPositiveChange && index === 1
								? 'text-emerald-600 dark:text-emerald-400'
								: 'text-red-600 dark:text-red-400'
						: 'text-muted-foreground';

				return (
					<Card key={index} className='border shadow-sm'>
						<CardContent>
							<div className='flex items-center justify-between'>
								<div className='flex-1 min-w-0'>
									<p className='text-sm text-muted-foreground'>
										{stat.label}
									</p>
									<h3 className='text-2xl font-bold mt-2 truncate'>
										{stat.value}
									</h3>
									<p
										className={`text-xs mt-2 ${stat.changeValue === null ? 'text-muted-foreground' : changeColor}`}
									>
										{stat.change}{' '}
										{stat.changeValue !== null &&
											'from last month'}
									</p>
								</div>
								<div
									className={`${stat.bgColor} p-3 rounded-lg shrink-0`}
								>
									<Icon
										className={`h-6 w-6 ${stat.color}`}
										suppressHydrationWarning
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
