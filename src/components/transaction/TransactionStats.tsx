import { TransactionResponseDTO } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

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
	const totalAmount = transactions.reduce(
		(sum, transaction) => sum + transaction.amount,
		0
	);

	return (
		<Card
			className={`bg-gradient-to-br ${type === 'expense' ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500'} border-0 text-white`}
		>
			<CardContent className='flex items-center justify-between'>
				<div>
					<div
						className={`text-${type === 'expense' ? 'orange' : 'green'}-100 mb-2 text-sm`}
					>
						Total {title} This Month
					</div>
					<div className='text-5xl font-bold'>
						₹{totalAmount.toFixed(2)}
					</div>
				</div>
				<div className='w-20 h-20 bg-surface-container/20 rounded-3xl flex items-center justify-center backdrop-blur-sm'>
					<Search className='w-10 h-10' />
				</div>
			</CardContent>
		</Card>
	);
}
