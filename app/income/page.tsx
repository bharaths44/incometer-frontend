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
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

interface IncomeEntry {
	id: number;
	source: string;
	amount: number;
	date: string;
	category: string;
	notes: string;
}

export default function IncomePage() {
	const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
		{
			id: 1,
			source: 'Salary',
			amount: 5000,
			date: '2024-11-01',
			category: 'Employment',
			notes: 'Monthly salary',
		},
		{
			id: 2,
			source: 'Freelance',
			amount: 800,
			date: '2024-11-05',
			category: 'Business',
			notes: 'Web design project',
		},
	]);

	const [formData, setFormData] = useState({
		source: '',
		amount: '',
		date: new Date().toISOString().split('T')[0],
		category: '',
		notes: '',
	});

	const categories = [
		'Employment',
		'Business',
		'Investment',
		'Bonus',
		'Other',
	];

	const handleAddIncome = () => {
		if (formData.source && formData.amount && formData.category) {
			const newEntry: IncomeEntry = {
				id: Date.now(),
				source: formData.source,
				amount: Number.parseFloat(formData.amount),
				date: formData.date,
				category: formData.category,
				notes: formData.notes,
			};
			setIncomeEntries([newEntry, ...incomeEntries]);
			setFormData({
				source: '',
				amount: '',
				date: new Date().toISOString().split('T')[0],
				category: '',
				notes: '',
			});
		}
	};

	const handleDelete = (id: number) => {
		setIncomeEntries(incomeEntries.filter((entry) => entry.id !== id));
	};

	const totalIncome = incomeEntries.reduce(
		(sum, entry) => sum + entry.amount,
		0
	);

	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Income Management
					</h1>
					<p className='text-muted-foreground mt-1'>
						Track and manage all your income sources
					</p>
				</div>

				{/* Stats Card */}
				<Card className='bg-gradient-to-br from-lime-50 to-lime-50/50 dark:from-lime-950/20 dark:to-lime-950/10 border-lime-200 dark:border-lime-800'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-4'>
							<div className='p-3 rounded-lg bg-lime-100 dark:bg-lime-900'>
								<TrendingUp className='h-8 w-8 text-lime-600 dark:text-lime-400' />
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>
									Total Income
								</p>
								<h3 className='text-3xl font-bold text-lime-600 dark:text-lime-400'>
									${totalIncome.toFixed(2)}
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
								Add Income
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<Label htmlFor='source'>Income Source</Label>
								<Input
									id='source'
									placeholder='e.g., Salary, Freelance'
									value={formData.source}
									onChange={(e) =>
										setFormData({
											...formData,
											source: e.target.value,
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
								onClick={handleAddIncome}
								className='w-full'
							>
								<Plus className='h-4 w-4 mr-2' />
								Add Income
							</Button>
						</CardContent>
					</Card>

					{/* Table */}
					<Card className='lg:col-span-2'>
						<CardHeader>
							<CardTitle>Income History</CardTitle>
							<CardDescription>
								All your income entries
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Source</TableHead>
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
										{incomeEntries.map((entry) => (
											<TableRow key={entry.id}>
												<TableCell className='font-medium'>
													{entry.source}
												</TableCell>
												<TableCell>
													{entry.category}
												</TableCell>
												<TableCell>
													{entry.date}
												</TableCell>
												<TableCell className='text-right font-semibold text-lime-600 dark:text-lime-400'>
													+${entry.amount.toFixed(2)}
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
