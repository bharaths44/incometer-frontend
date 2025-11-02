import {
	ArrowDownRight,
	ArrowUpRight,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useExpenseSummary } from '@/hooks/useAnalytics.ts';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
	userId: number;
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
	const { data: summary, isLoading: loading } = useExpenseSummary(userId);
	const [animatedBalance, setAnimatedBalance] = useState(0);

	useEffect(() => {
		if (summary) {
			// Start animation for net balance
			animateBalance(summary.netSavings);
		}
	}, [summary]);

	const animateBalance = (targetBalance: number) => {
		let start = 0;
		const duration = 1000;
		const increment = targetBalance / (duration / 16);

		const timer = setInterval(() => {
			start += increment;
			if (start >= targetBalance) {
				setAnimatedBalance(targetBalance);
				clearInterval(timer);
			} else {
				setAnimatedBalance(start);
			}
		}, 16);

		return () => clearInterval(timer);
	};

	const formatPercentageChange = (change: number | null): string => {
		if (change === null) return '';
		return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
	};

	const getTrendFromChange = (change: number | null): 'up' | 'down' => {
		if (change === null) return 'up';
		return change >= 0 ? 'up' : 'down';
	};

	if (loading) {
		return (
			<div className='grid md:grid-cols-3 gap-6'>
				{[1, 2, 3].map((i) => (
					<Card key={i} className='animate-pulse'>
						<CardContent className='p-6'>
							<div className='flex items-start justify-between mb-4'>
								<div className='w-12 h-12 bg-gray-200 rounded-2xl'></div>
								<div className='w-16 h-4 bg-gray-200 rounded'></div>
							</div>
							<div className='w-24 h-8 bg-gray-200 rounded mb-1'></div>
							<div className='w-20 h-4 bg-gray-200 rounded'></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!summary) {
		return (
			<div className='text-center py-8'>
				Failed to load dashboard stats
			</div>
		);
	}

	const stats = [
		{
			label: 'Total Income',
			value: `₹${summary.totalIncome.toFixed(2)}`,
			change: formatPercentageChange(summary.incomePercentageChange),
			icon: TrendingUp,
			color: 'text-green-600',
			bgColor: 'bg-green-100',
			trend: getTrendFromChange(summary.incomePercentageChange),
		},
		{
			label: 'Total Expenses',
			value: `₹${summary.totalExpense.toFixed(2)}`,
			change: formatPercentageChange(summary.expensePercentageChange),
			icon: TrendingDown,
			color: 'text-red-600',
			bgColor: 'bg-red-100',
			trend: getTrendFromChange(summary.expensePercentageChange),
		},
		{
			label: 'Net Balance',
			value: `₹${animatedBalance.toFixed(2)}`,
			change: formatPercentageChange(summary.savingsPercentageChange),
			icon: DollarSign,
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
			trend: getTrendFromChange(summary.savingsPercentageChange),
		},
	];

	return (
		<div className='grid md:grid-cols-3 gap-6'>
			{stats.map((stat, index) => (
				<Card
					key={index}
					className='group'
					style={{ animationDelay: `${index * 100}ms` }}
				>
					<CardContent className='p-6'>
						<div className='flex items-start justify-between mb-4'>
							<div
								className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<stat.icon
									className={`w-6 h-6 ${stat.color}`}
								/>
							</div>
							{stat.change && (
								<div
									className={`flex items-center gap-1 text-sm font-medium ${
										stat.trend === 'up'
											? 'text-green-600'
											: 'text-orange-600'
									}`}
								>
									{stat.trend === 'up' ? (
										<ArrowUpRight className='w-4 h-4' />
									) : (
										<ArrowDownRight className='w-4 h-4' />
									)}
									{stat.change}
								</div>
							)}
						</div>
						<div className='text-3xl font-bold mb-1'>
							{stat.value}
						</div>
						<div className='text-gray-600 text-sm'>
							{stat.label}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
