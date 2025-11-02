'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

interface ExpenseEntry {
	id: number;
	description: string;
	amount: number;
	date: string;
	category: string;
	notes: string;
}

export default function ExpensePage() {
	const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([
		{
			id: 1,
			description: 'Grocery Shopping',
			amount: 85.5,
			date: '2024-11-01',
			category: 'Food',
			notes: 'Weekly groceries',
		},
		{
			id: 2,
			description: 'Gas',
			amount: 45.0,
			date: '2024-11-02',
			category: 'Transportation',
			notes: 'Car fuel',
		},
	]);

	const [formData, setFormData] = useState({
		description: '',
		amount: '',
		date: new Date().toISOString().split('T')[0],
		category: '',
		notes: '',
	});

	const categories = [
		'Food',
		'Transportation',
		'Entertainment',
		'Utilities',
		'Healthcare',
		'Shopping',
		'Other',
	];

	const handleAddExpense = () => {
		if (formData.description && formData.amount && formData.category) {
			const newEntry: ExpenseEntry = {
				id: Date.now(),
				description: formData.description,
				amount: Number.parseFloat(formData.amount),
				date: formData.date,
				category: formData.category,
				notes: formData.notes,
			};
			setExpenseEntries([newEntry, ...expenseEntries]);
			setFormData({
				description: '',
				amount: '',
				date: new Date().toISOString().split('T')[0],
				category: '',
				notes: '',
			});
		}
	};

	const handleDelete = (id: number) => {
		setExpenseEntries(expenseEntries.filter((entry) => entry.id !== id));
	};

	const totalExpense = expenseEntries.reduce(
		(sum, entry) => sum + entry.amount,
		0
	);

	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Expense Management
					</h1>
					<p className='text-muted-foreground mt-1'>
						Track and manage all your expenses
					</p>
				</div>

				{/* Stats Card */}
				<Card className='bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border-red-200 dark:border-red-800'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-4'>
							<div className='p-3 rounded-lg bg-red-100 dark:bg-red-900'>
								<TrendingDown className='h-8 w-8 text-red-600 dark:text-red-400' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>
									Total Expenses
								</p>
								<h3 className='text-3xl font-bold text-red-600 dark:text-red-400'>
									${totalExpense.toFixed(2)}
								</h3>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Form */}
					<Card className='lg:col-span-1'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Plus className='h-5 w-5' />
								Add Expense
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<Label htmlFor='description'>Description</Label>
								<Input
									id='description'
									placeholder='e.g., Grocery Shopping'
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor='amount'>Amount</Label>
								<Input
									id='amount'
									type='number'
									placeholder='0.00'
									value={formData.amount}
									onChange={(e) =>
										setFormData({
											...formData,
											amount: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor='date'>Date</Label>
								<Input
									id='date'
									type='date'
									value={formData.date}
									onChange={(e) =>
										setFormData({
											...formData,
											date: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor='category'>Category</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({
											...formData,
											category: value,
										})
									}
								>
									<SelectTrigger id='category'>
										<SelectValue placeholder='Select category' />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor='notes'>Notes</Label>
								<Textarea
									id='notes'
									placeholder='Additional notes...'
									value={formData.notes}
									onChange={(e) =>
										setFormData({
											...formData,
											notes: e.target.value,
										})
									}
								/>
							</div>
							<Button
								onClick={handleAddExpense}
								className='w-full'
							>
								<Plus className='h-4 w-4 mr-2' />
								Add Expense
							</Button>
						</CardContent>
					</Card>

					{/* Table */}
					<Card className='lg:col-span-2'>
						<CardHeader>
							<CardTitle>Expense History</CardTitle>
							<CardDescription>
								All your expense entries
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Description</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className='text-right'>
												Amount
											</TableHead>
											<TableHead className='w-20'>
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{expenseEntries.map((entry) => (
											<TableRow key={entry.id}>
												<TableCell className='font-medium'>
													{entry.description}
												</TableCell>
												<TableCell>
													{entry.category}
												</TableCell>
												<TableCell>
													{entry.date}
												</TableCell>
												<TableCell className='text-right font-semibold text-red-600 dark:text-red-400'>
													-${entry.amount.toFixed(2)}
												</TableCell>
												<TableCell>
													<Button
														variant='ghost'
														size='sm'
														onClick={() =>
															handleDelete(
																entry.id
															)
														}
													>
														<Trash2 className='h-4 w-4 text-red-500' />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AppLayout>
	);
}
