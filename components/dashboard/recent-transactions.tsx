'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ArrowUpRight, ShoppingCart, Zap, Utensils } from 'lucide-react';

const transactions = [
	{
		id: 1,
		description: 'Grocery Shopping',
		amount: 85.5,
		type: 'expense',
		icon: ShoppingCart,
		date: 'Today',
	},
	{
		id: 2,
		description: 'Salary Deposit',
		amount: 5000,
		type: 'income',
		icon: ArrowUpRight,
		date: 'Yesterday',
	},
	{
		id: 3,
		description: 'Electricity Bill',
		amount: 120,
		type: 'expense',
		icon: Zap,
		date: '2 days ago',
	},
	{
		id: 4,
		description: 'Dining Out',
		amount: 45.75,
		type: 'expense',
		icon: Utensils,
		date: '3 days ago',
	},
];

export function RecentTransactions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>Your latest 4 transactions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{transactions.map((transaction) => {
						const Icon = transaction.icon;
						const isIncome = transaction.type === 'income';

						return (
							<div
								key={transaction.id}
								className='flex items-center justify-between pb-4 border-b last:pb-0 last:border-0'
							>
								<div className='flex items-center gap-3'>
									<div
										className={`p-2 rounded-lg ${isIncome ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-red-50 dark:bg-red-950/50'}`}
									>
										<Icon
											className={`h-4 w-4 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
											suppressHydrationWarning
										/>
									</div>
									<div>
										<p className='font-medium text-sm'>
											{transaction.description}
										</p>
										<p className='text-xs text-muted-foreground'>
											{transaction.date}
										</p>
									</div>
								</div>
								<div className='text-right'>
									<p
										className={`font-semibold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
									>
										{isIncome ? '+' : '-'}$
										{transaction.amount.toFixed(2)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
