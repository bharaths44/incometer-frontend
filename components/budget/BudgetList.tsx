'use client';

import { useState, useEffect } from 'react';
import { BudgetResponseDTO, BudgetFrequency, BudgetType } from '@/types/budget';
import { getBudgetsByUser } from '@/services/budgetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function BudgetList() {
	const [budgets, setBudgets] = useState<BudgetResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = 1; // TODO: Get from auth context

	useEffect(() => {
		loadBudgets();
	}, []);

	const loadBudgets = async () => {
		try {
			const data = await getBudgetsByUser(userId);
			// Filter to only show LIMIT type budgets (TARGET type budgets are shown on target page)
			const limitBudgets = data.filter(
				(budget) => budget.type === 'LIMIT'
			);
			setBudgets(limitBudgets);
		} catch (error) {
			console.error('Failed to load budgets:', error);
			setBudgets([]); // Show empty state on error
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	const getFrequencyLabel = (frequency: string) => {
		switch (frequency) {
			case 'ONE_TIME':
				return 'One Time';
			case 'MONTHLY':
				return 'Monthly';
			case 'WEEKLY':
				return 'Weekly';
			case 'YEARLY':
				return 'Yearly';
			default:
				return frequency;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'LIMIT':
				return 'default';
			case 'TARGET':
				return 'secondary';
			default:
				return 'outline';
		}
	};

	if (loading) {
		return <div className='text-center py-8'>Loading budgets...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold'>Your Budgets</h2>
				<Button>
					<Plus className='h-4 w-4 mr-2' />
					Add Budget
				</Button>
			</div>

			{budgets.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center justify-center py-12'>
						<p className='text-muted-foreground mb-4'>
							No budgets created yet
						</p>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Create Your First Budget
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{budgets.map((budget, index) => {
						// Calculate progress (TODO: Get actual spending from transactions)
						const spendingLevels = [0.4, 0.7, 0.25, 0.9]; // Different spending levels for demo
						const spentAmount = Math.floor(
							budget.amount *
								spendingLevels[index % spendingLevels.length]
						);
						const progress = (spentAmount / budget.amount) * 100;
						const remainingAmount = budget.amount - spentAmount;
						const isOverBudget = progress > 100;

						return (
							<Card key={budget.budgetId}>
								<CardHeader className='pb-3'>
									<div className='flex justify-between items-start'>
										<CardTitle className='text-lg'>
											{budget.categoryName}
										</CardTitle>
										<Badge
											variant={getTypeColor(budget.type)}
										>
											{budget.type}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='space-y-3'>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Budget:
											</span>
											<span className='font-semibold'>
												{formatCurrency(budget.amount)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Spent:
											</span>
											<span
												className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}
											>
												{formatCurrency(spentAmount)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Remaining:
											</span>
											<span
												className={`font-semibold ${remainingAmount < 0 ? 'text-red-600' : ''}`}
											>
												{formatCurrency(
													remainingAmount
												)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Frequency:
											</span>
											<span className='text-sm'>
												{getFrequencyLabel(
													budget.frequency
												)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Period:
											</span>
											<span className='text-sm'>
												{new Date(
													budget.startDate
												).toLocaleDateString()}{' '}
												-{' '}
												{new Date(
													budget.endDate
												).toLocaleDateString()}
											</span>
										</div>

										{/* Progress bar */}
										<div className='space-y-1'>
											<div className='flex justify-between text-xs'>
												<span>Progress</span>
												<span>
													{progress.toFixed(0)}%
												</span>
											</div>
											<div className='w-full bg-secondary rounded-full h-2'>
												<div
													className={`h-2 rounded-full transition-all duration-300 ${
														isOverBudget
															? 'bg-red-500'
															: progress > 80
																? 'bg-yellow-500'
																: 'bg-green-500'
													}`}
													style={{
														width: `${Math.min(progress, 100)}%`,
													}}
												/>
											</div>
											{isOverBudget && (
												<p className='text-xs text-red-600 font-medium'>
													Over budget by{' '}
													{formatCurrency(
														spentAmount -
															budget.amount
													)}
												</p>
											)}
										</div>

										<div className='flex justify-between items-center pt-2'>
											<Badge
												variant={
													budget.active
														? 'default'
														: 'secondary'
												}
											>
												{budget.active
													? 'Active'
													: 'Inactive'}
											</Badge>
											<div className='flex gap-1'>
												<Button
													variant='ghost'
													size='sm'
												>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
