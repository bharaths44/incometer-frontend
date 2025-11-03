'use client';

import { BudgetResponseDTO, BudgetType } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { formatCurrency, getFrequencyLabel } from '@/lib/utils';

interface BudgetCardProps {
	budget: BudgetResponseDTO;
	onEdit?: (budget: BudgetResponseDTO) => void;
	onDelete?: (budget: BudgetResponseDTO) => void;
}

export default function BudgetCard({
	budget,
	onEdit,
	onDelete,
}: BudgetCardProps) {
	const isTarget = budget.type === BudgetType.TARGET;
	const currentAmount = budget.spent;
	const progress = Math.min((currentAmount / budget.amount) * 100, 100);
	const remainingAmount = budget.amount - currentAmount;
	const isOverBudget = progress > 100 && !isTarget;
	const isCompleted = progress >= 100 && isTarget;

	const getProgressBarColor = () => {
		if (isTarget) {
			return isCompleted ? 'bg-green-700' : 'bg-primary';
		}
		return isOverBudget
			? 'bg-red-500'
			: progress > 80
				? 'bg-yellow-500'
				: 'bg-green-700';
	};

	const getBadgeVariant = () => {
		if (isTarget) {
			return isCompleted ? 'default' : 'secondary';
		}
		return isOverBudget ? 'destructive' : 'secondary';
	};

	const getBadgeText = () => {
		if (isTarget) {
			return isCompleted ? 'Completed' : `${progress.toFixed(0)}%`;
		}
		return isOverBudget
			? `Over by ${formatCurrency(currentAmount - budget.amount)}`
			: `${progress.toFixed(0)}%`;
	};

	return (
		<Card>
			<CardHeader className='pb-3'>
				<div className='flex justify-between items-start'>
					<CardTitle className='text-lg flex items-center gap-2'>
						{isTarget ? (
							<Target className='h-5 w-5' />
						) : (
							<TrendingUp className='h-5 w-5' />
						)}
						{budget.categoryName} {isTarget ? 'Target' : 'Budget'}
					</CardTitle>
					<Badge variant={getBadgeVariant()}>{getBadgeText()}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>
							{isTarget ? 'Target:' : 'Budget:'}
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
							className={`font-semibold ${
								isOverBudget ? 'text-red-600' : ''
							}`}
						>
							{formatCurrency(currentAmount)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>
							Remaining:
						</span>
						<span
							className={`font-semibold ${
								remainingAmount < 0 ? 'text-red-600' : ''
							}`}
						>
							{formatCurrency(remainingAmount)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>
							Frequency:
						</span>
						<span className='text-sm'>
							{getFrequencyLabel(budget.frequency)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>
							Period:
						</span>
						<span className='text-sm'>
							{new Date(budget.startDate).toLocaleDateString()} -{' '}
							{new Date(budget.endDate).toLocaleDateString()}
						</span>
					</div>

					{/* Progress bar */}
					<div className='space-y-1'>
						<div className='flex justify-between text-xs'>
							<span>Progress</span>
							<span>{progress.toFixed(0)}%</span>
						</div>
						<div className='w-full bg-secondary rounded-full h-2'>
							<div
								className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
								style={{
									width: `${Math.min(progress, 100)}%`,
								}}
							/>
						</div>
					</div>

					{!isTarget && (
						<div className='flex justify-between items-center pt-2'>
							<Badge
								variant={
									budget.active ? 'default' : 'secondary'
								}
							>
								{budget.active ? 'Active' : 'Inactive'}
							</Badge>
							<div className='flex gap-1'>
								{onEdit && (
									<Button
										variant='ghost'
										size='sm'
										onClick={() => onEdit(budget)}
									>
										<Edit className='h-4 w-4' />
									</Button>
								)}
								{onDelete && (
									<Button
										variant='ghost'
										size='sm'
										onClick={() => onDelete(budget)}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
