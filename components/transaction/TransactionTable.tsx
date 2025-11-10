import { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { TransactionConfig, TransactionResponseDTO } from '@/types/transaction';
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
import { Card, CardContent } from '@/components/ui/card';

interface TransactionTableProps {
	transactions: TransactionResponseDTO[];
	onEdit: (transaction: TransactionResponseDTO) => void;
	onDelete: (transaction: TransactionResponseDTO) => void;
	loading: boolean;
	config: TransactionConfig;
}

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
			{/* Mobile Card Layout */}
			<div className='block md:hidden space-y-4'>
				{paginatedTransactions.map((transaction) => (
					<Card
						key={transaction.transactionId}
						className='border shadow-sm'
					>
						<CardContent className='p-4'>
							<div className='flex items-start justify-between'>
								<div className='flex items-center gap-3 flex-1 min-w-0'>
									<div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0'>
										<Icon
											name={transaction.category.icon}
											size={20}
											className='text-muted-foreground'
										/>
									</div>
									<div className='flex-1 min-w-0'>
										<h3 className='font-medium text-sm truncate'>
											{transaction.description}
										</h3>
										<p className='text-xs text-muted-foreground'>
											{transaction.category.name}
										</p>
									</div>
								</div>
								<div className='flex gap-2 shrink-0'>
									<Button
										onClick={() => onEdit(transaction)}
										variant='ghost'
										size='icon'
										className='h-8 w-8'
									>
										<Edit2 className='w-4 h-4' />
									</Button>
									<Button
										onClick={() => onDelete(transaction)}
										variant='ghost'
										size='icon'
										className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
									>
										<Trash2 className='w-4 h-4' />
									</Button>
								</div>
							</div>
							<div className='mt-3 flex items-center justify-between'>
								<div className='flex flex-col'>
									<span className='text-lg font-semibold'>
										₹{transaction.amount.toFixed(2)}
									</span>
									<span className='text-xs text-muted-foreground'>
										{transaction.paymentMethod.displayName}
									</span>
								</div>
								<div className='text-right'>
									<p className='text-sm text-muted-foreground'>
										{new Date(
											transaction.transactionDate
										).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Desktop Table Layout */}
			<div className='hidden md:block rounded-md border'>
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
										<div className='w-8 h-8 bg-muted rounded-lg flex items-center justify-center'>
											<Icon
												name={transaction.category.icon}
												size={16}
												className='text-muted-foreground'
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
											className='text-destructive hover:text-destructive hover:bg-destructive/10'
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
				<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
					<div className='text-sm text-muted-foreground text-center sm:text-left'>
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
						<div className='flex items-center gap-1'>
							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1
							).map((page) => (
								<Button
									key={page}
									onClick={() => handlePageChange(page)}
									variant={
										currentPage === page
											? 'default'
											: 'outline'
									}
									size='sm'
									className='hidden sm:flex'
								>
									{page}
								</Button>
							))}
							{/* Mobile pagination - show current page and total */}
							<div className='flex sm:hidden items-center gap-2 text-sm text-muted-foreground'>
								<span>{currentPage}</span>
								<span>of</span>
								<span>{totalPages}</span>
							</div>
						</div>
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
