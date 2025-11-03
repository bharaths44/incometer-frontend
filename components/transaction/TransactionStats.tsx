import { TransactionResponseDTO } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionStatsProps {
	transactions: TransactionResponseDTO[];
	type: 'expense' | 'income';
	title: string;
}

export default function TransactionStats({
	transactions,
	type,
	title,
}: TransactionStatsProps) {
	// Get current month transactions
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const currentMonthTransactions = transactions.filter((transaction) => {
		const transactionDate = new Date(transaction.transactionDate);
		return (
			transactionDate.getMonth() === currentMonth &&
			transactionDate.getFullYear() === currentYear
		);
	});

	const totalAmount = currentMonthTransactions.reduce(
		(sum, transaction) => sum + transaction.amount,
		0
	);

	const Icon = type === 'income' ? TrendingUp : TrendingDown;

	return (
		<Card>
			<CardContent className='pt-4 pb-4'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-muted-foreground mb-2'>
							Total {title} This Month
						</p>
						<h3 className='text-4xl font-bold'>
							₹{totalAmount.toFixed(2)}
						</h3>
					</div>
					<div
						className={`p-4 rounded-lg ${type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}
					>
						<Icon
							className={`w-8 h-8 ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
