'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	BudgetRequestDTO,
	BudgetResponseDTO,
	BudgetType,
	BudgetFrequency,
} from '@/types/budget';
import { useCategories } from '@/hooks/useCategories';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets';
import { budgetFormSchema, BudgetFormData } from '@/lib/budgetFormSchema';
import {
	TypeSelect,
	CategorySelect,
	AmountInput,
	FrequencySelect,
	DatePicker,
} from './form-fields';

interface BudgetFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	budget?: BudgetResponseDTO | null;
	userId: number;
	defaultType?: BudgetType;
}

export default function BudgetFormModal({
	isOpen,
	onClose,
	budget,
	userId,
	defaultType = BudgetType.LIMIT,
}: BudgetFormModalProps) {
	const isEditing = !!budget;
	const { data: categories = [] } = useCategories(userId);
	const createBudgetMutation = useCreateBudget();
	const updateBudgetMutation = useUpdateBudget();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<BudgetFormData>({
		resolver: zodResolver(budgetFormSchema),
		defaultValues: {
			type: defaultType,
			frequency: BudgetFrequency.MONTHLY,
		},
	});

	const watchedType = useWatch({ control, name: 'type' });
	const watchedStartDate = useWatch({ control, name: 'startDate' });
	const watchedEndDate = useWatch({ control, name: 'endDate' });
	const watchedFrequency = useWatch({ control, name: 'frequency' });
	const watchedCategoryId = useWatch({ control, name: 'categoryId' });
	const watchedAmount = useWatch({ control, name: 'amount' });

	// Auto-calculate end date based on frequency and start date
	useEffect(() => {
		if (
			watchedStartDate &&
			watchedFrequency &&
			watchedFrequency !== BudgetFrequency.ONE_TIME
		) {
			const startDate = new Date(watchedStartDate);
			let endDate: Date;

			switch (watchedFrequency) {
				case BudgetFrequency.WEEKLY:
					endDate = new Date(startDate);
					endDate.setDate(startDate.getDate() + 6); // 7 days total (including start date)
					break;
				case BudgetFrequency.MONTHLY:
					endDate = new Date(
						startDate.getFullYear(),
						startDate.getMonth() + 1,
						0
					); // Last day of the month
					break;
				case BudgetFrequency.YEARLY:
					endDate = new Date(startDate.getFullYear(), 11, 31); // December 31st of the year
					break;
				default:
					return; // Don't auto-calculate for ONE_TIME
			}

			setValue('endDate', endDate);
		}
	}, [watchedStartDate, watchedFrequency, setValue]);

	useEffect(() => {
		if (isOpen) {
			if (isEditing && budget) {
				// Populate form with existing budget data
				setValue('categoryId', budget.categoryId);
				setValue('amount', budget.amount);
				setValue('startDate', new Date(budget.startDate));
				setValue('endDate', new Date(budget.endDate));
				setValue('frequency', budget.frequency);
				setValue('type', budget.type);
			} else {
				// Reset form for new budget
				reset({
					type: defaultType,
					frequency: BudgetFrequency.MONTHLY,
				});
			}
		}
	}, [isOpen, isEditing, budget, setValue, reset, defaultType]);

	const onSubmit = async (data: BudgetFormData) => {
		try {
			const budgetData: BudgetRequestDTO = {
				userId,
				categoryId: data.categoryId,
				amount: data.amount,
				startDate: data.startDate.toISOString().split('T')[0],
				endDate: data.endDate.toISOString().split('T')[0],
				frequency: data.frequency,
				type: data.type,
			};

			if (isEditing && budget) {
				await updateBudgetMutation.mutateAsync({
					id: budget.budgetId,
					budget: budgetData,
				});
			} else {
				await createBudgetMutation.mutateAsync(budgetData);
			}

			onClose();
		} catch (error) {
			console.error('Failed to save budget:', error);
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const getTitle = () => {
		if (isEditing) {
			return `Edit ${budget?.type === BudgetType.TARGET ? 'Target' : 'Budget'}`;
		}
		return `Create New ${watchedType === BudgetType.TARGET ? 'Target' : 'Budget'}`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>{getTitle()}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* Type Selection */}
					<TypeSelect
						value={watchedType}
						onChange={(value: BudgetType) =>
							setValue('type', value)
						}
						error={errors.type?.message}
					/>

					{/* Category Selection */}
					<CategorySelect
						value={watchedCategoryId}
						onChange={(value) =>
							setValue('categoryId', parseInt(value))
						}
						categories={categories}
						error={errors.categoryId?.message}
					/>

					{/* Amount */}
					<AmountInput
						value={watchedAmount}
						onChange={(e) =>
							setValue('amount', parseFloat(e.target.value) || 0)
						}
						type={watchedType}
						error={errors.amount?.message}
					/>

					{/* Frequency */}
					<FrequencySelect
						value={watchedFrequency}
						onChange={(value: BudgetFrequency) =>
							setValue('frequency', value)
						}
						error={errors.frequency?.message}
					/>

					{/* Start Date */}
					<DatePicker
						label='Start Date'
						value={watchedStartDate}
						onChange={(date) => date && setValue('startDate', date)}
						error={errors.startDate?.message}
					/>

					{/* End Date */}
					<DatePicker
						label='End Date'
						value={watchedEndDate}
						onChange={(date) => date && setValue('endDate', date)}
						error={errors.endDate?.message}
					/>

					{/* Actions */}
					<div className='flex gap-3 pt-4'>
						<Button
							type='button'
							onClick={handleClose}
							variant='secondary'
							className='flex-1'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={
								createBudgetMutation.isPending ||
								updateBudgetMutation.isPending
							}
							className='flex-1'
						>
							{createBudgetMutation.isPending ||
							updateBudgetMutation.isPending
								? 'Saving...'
								: isEditing
									? 'Update'
									: 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
