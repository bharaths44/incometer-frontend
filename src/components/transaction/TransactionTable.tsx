import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionResponseDTO, TransactionConfig } from '@/types/transaction';
import Icon from '@/lib/iconUtils';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface TransactionTableProps {
	transactions: TransactionResponseDTO[];
	onEdit: (transaction: TransactionResponseDTO) => void;
	onDelete: (transaction: TransactionResponseDTO) => void;
	loading: boolean;
	config: TransactionConfig;
}

export default function TransactionTable({
	transactions,
	onEdit,
	onDelete,
	loading,
	config,
}: TransactionTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(transactions.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedTransactions = transactions.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (loading) {
		return (
			<div className='text-center py-8'>Loading {config.type}s...</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								{config.tableHeaders.category}
							</TableHead>
							<TableHead>
								{config.tableHeaders.description}
							</TableHead>
							<TableHead>{config.tableHeaders.amount}</TableHead>
							<TableHead>
								{config.tableHeaders.paymentMethod}
							</TableHead>
							<TableHead>{config.tableHeaders.date}</TableHead>
							<TableHead className='text-center'>
								{config.tableHeaders.actions}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedTransactions.map((transaction) => (
							<TableRow key={transaction.transactionId}>
								<TableCell>
									<div className='flex items-center gap-3'>
										<div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
											<Icon
												name={transaction.category.icon}
												size={16}
												className='text-gray-600'
											/>
										</div>
										<span className='text-sm font-medium'>
											{transaction.category.name}
										</span>
									</div>
								</TableCell>
								<TableCell>{transaction.description}</TableCell>
								<TableCell className='font-semibold'>
									₹{transaction.amount.toFixed(2)}
								</TableCell>
								<TableCell>
									{transaction.paymentMethod.displayName}
								</TableCell>
								<TableCell>
									{new Date(
										transaction.transactionDate
									).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</TableCell>
								<TableCell className='text-center'>
									<div className='flex gap-2 justify-center'>
										<Button
											onClick={() => onEdit(transaction)}
											variant='ghost'
											size='icon'
										>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button
											onClick={() =>
												onDelete(transaction)
											}
											variant='ghost'
											size='icon'
											className='text-red-600 hover:text-red-700 hover:bg-red-50'
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<div className='flex items-center justify-between'>
					<div className='text-sm text-muted-foreground'>
						Showing {startIndex + 1} to{' '}
						{Math.min(
							startIndex + itemsPerPage,
							transactions.length
						)}{' '}
						of {transactions.length} {config.type}s
					</div>
					<div className='flex items-center gap-2'>
						<Button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							variant='outline'
							size='icon'
						>
							<ChevronLeft className='w-4 h-4' />
						</Button>
						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1
						).map((page) => (
							<Button
								key={page}
								onClick={() => handlePageChange(page)}
								variant={
									currentPage === page ? 'default' : 'outline'
								}
								size='sm'
							>
								{page}
							</Button>
						))}
						<Button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							variant='outline'
							size='icon'
						>
							<ChevronRight className='w-4 h-4' />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
