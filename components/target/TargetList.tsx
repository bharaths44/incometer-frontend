'use client';

import { useState } from 'react';
import { BudgetResponseDTO, BudgetType } from '@/types/budget';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
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

export default function TargetList() {
	const { user } = useAuthContext();
	const userId = user?.userId || '1'; // Fallback to '1' if not authenticated
	const { data: targets = [] } = useBudgets(userId);
	const deleteBudgetMutation = useDeleteBudget();

	// Filter to only show TARGET type budgets and sort by newest start date first
	const targetBudgets = targets
		.filter((target) => target.type === 'TARGET')
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime()
		);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTarget, setEditingTarget] =
		useState<BudgetResponseDTO | null>(null);
	const [deletingTarget, setDeletingTarget] =
		useState<BudgetResponseDTO | null>(null);

	const handleAddTarget = () => {
		setEditingTarget(null);
		setIsModalOpen(true);
	};

	const handleEditTarget = (target: BudgetResponseDTO) => {
		setEditingTarget(target);
		setIsModalOpen(true);
	};

	const handleDeleteTarget = (target: BudgetResponseDTO) => {
		setDeletingTarget(target);
	};

	const confirmDelete = async () => {
		if (deletingTarget) {
			try {
				await deleteBudgetMutation.mutateAsync({
					id: deletingTarget.budgetId,
					userId,
				});
				setDeletingTarget(null);
			} catch (error) {
				console.error('Failed to delete target:', error);
			}
		}
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setEditingTarget(null);
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold'>Your Targets</h2>
				<Button onClick={handleAddTarget}>
					<Plus className='h-4 w-4 mr-2' />
					Add Target
				</Button>
			</div>

			{targetBudgets.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center justify-center py-12'>
						<Target className='h-12 w-12 text-muted-foreground mb-4' />
						<p className='text-muted-foreground mb-4'>
							No targets set yet
						</p>
						<Button onClick={handleAddTarget}>
							<Plus className='h-4 w-4 mr-2' />
							Set Your First Target
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{targetBudgets.map((target) => (
						<BudgetCard
							key={target.budgetId}
							budget={target}
							onEdit={handleEditTarget}
							onDelete={handleDeleteTarget}
						/>
					))}
				</div>
			)}

			{/* Budget Form Modal */}
			<BudgetFormModal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				budget={editingTarget}
				userId={userId}
				defaultType={BudgetType.TARGET}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={!!deletingTarget}
				onOpenChange={() => setDeletingTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Target</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete the target for &#34;
							{deletingTarget?.categoryName}&#34;? This action
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
