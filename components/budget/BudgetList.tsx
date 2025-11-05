'use client';

import { useState } from 'react';
import { BudgetResponseDTO, BudgetType } from '@/types/budget';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetCard from '@/components/shared/BudgetCard';
import BudgetFormModal from '@/components/shared/BudgetFormModal';
import { useBudgets, useDeleteBudget } from '@/hooks/useBudgets';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function BudgetList() {
	const { user } = useAuthContext();
	const userId = user?.userId || '1'; // Fallback to '1' if not authenticated
	const { data: allBudgets = [], isLoading } = useBudgets(userId);
	const deleteBudgetMutation = useDeleteBudget();

	// Filter to only show LIMIT type budgets and sort by newest start date first
	const budgets = allBudgets
		.filter((budget) => budget.type === BudgetType.LIMIT)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime()
		);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingBudget, setEditingBudget] =
		useState<BudgetResponseDTO | null>(null);
	const [deletingBudget, setDeletingBudget] =
		useState<BudgetResponseDTO | null>(null);

	const handleAddBudget = () => {
		setEditingBudget(null);
		setIsModalOpen(true);
	};

	const handleEditBudget = (budget: BudgetResponseDTO) => {
		setEditingBudget(budget);
		setIsModalOpen(true);
	};

	const handleDeleteBudget = (budget: BudgetResponseDTO) => {
		setDeletingBudget(budget);
	};

	const confirmDelete = async () => {
		if (deletingBudget) {
			try {
				await deleteBudgetMutation.mutateAsync({
					id: deletingBudget.budgetId,
					userId,
				});
				setDeletingBudget(null);
			} catch (error) {
				console.error('Failed to delete budget:', error);
			}
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setEditingBudget(null);
	};

	if (isLoading) {
		return <div className='text-center py-8'>Loading budgets...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold'>Your Budgets</h2>
				<Button onClick={handleAddBudget}>
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
						<Button onClick={handleAddBudget}>
							<Plus className='h-4 w-4 mr-2' />
							Create Your First Budget
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{budgets.map((budget) => (
						<BudgetCard
							key={budget.budgetId}
							budget={budget}
							onEdit={handleEditBudget}
							onDelete={handleDeleteBudget}
						/>
					))}
				</div>
			)}

			{/* Budget Form Modal */}
			<BudgetFormModal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				budget={editingBudget}
				userId={userId}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deletingBudget}
				onOpenChange={() => setDeletingBudget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Budget</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete the budget for &#34;
							{deletingBudget?.categoryName}&#34;? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className='bg-red-600 hover:bg-red-700'
							disabled={deleteBudgetMutation.isPending}
						>
							{deleteBudgetMutation.isPending
								? 'Deleting...'
								: 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
