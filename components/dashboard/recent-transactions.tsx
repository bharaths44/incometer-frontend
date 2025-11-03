'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
	createExpenseService,
	createIncomeService,
} from '@/services/transactionService';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/lib/iconUtils';
import { formatDistanceToNow } from 'date-fns';

export function RecentTransactions() {
	// Hardcoded userId (auth not implemented yet)
	const userId = 1;

	// Fetch both expenses and income
	const { data: expenses = [], isLoading: expensesLoading } = useQuery({
		queryKey: ['transactions', userId, 'expense'],
		queryFn: async () => {
			const service = createExpenseService();
			return service.getAll(userId);
		},
	});

	const { data: income = [], isLoading: incomeLoading } = useQuery({
		queryKey: ['transactions', userId, 'income'],
		queryFn: async () => {
			const service = createIncomeService();
			return service.getAll(userId);
		},
	});

	const isLoading = expensesLoading || incomeLoading;

	// Combine and sort by date (most recent first)
	const allTransactions = [...expenses, ...income]
		.sort((a, b) => {
			const dateA = new Date(a.transactionDate).getTime();
			const dateB = new Date(b.transactionDate).getTime();
			return dateB - dateA;
		})
		.slice(0, 5); // Get latest 5 transactions

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			return formatDistanceToNow(date, { addSuffix: true });
		} catch {
			return dateString;
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
					<CardDescription>Your latest transactions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5].map((i) => (
							<Skeleton key={i} className='h-16 w-full' />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (allTransactions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
					<CardDescription>Your latest transactions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='text-center py-8 text-muted-foreground'>
						<p>No transactions yet</p>
						<p className='text-sm mt-1'>
							Start by adding an expense or income
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>
					Your latest {allTransactions.length} transactions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{allTransactions.map((transaction) => {
						const isIncome =
							transaction.transactionType === 'INCOME';
						const categoryIcon =
							transaction.category.icon || 'circle';

						return (
							<div
								key={transaction.transactionId}
								className='flex items-center justify-between pb-4 border-b last:pb-0 last:border-0'
							>
								<div className='flex items-center gap-3 flex-1 min-w-0'>
									<div
										className={`p-2 rounded-lg shrink-0 ${isIncome ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-red-50 dark:bg-red-950/50'}`}
									>
										<Icon
											name={categoryIcon}
											size={16}
											className={`${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
										/>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='font-medium text-sm truncate'>
											{transaction.description}
										</p>
										<p className='text-xs text-muted-foreground truncate'>
											{transaction.category.name} •{' '}
											{formatDate(
												transaction.transactionDate
											)}
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
