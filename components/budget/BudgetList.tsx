'use client';

import { useState, useEffect } from 'react';
import { BudgetResponseDTO, BudgetType } from '@/types/budget';
import { getBudgetsByUser } from '@/services/budgetService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetCard from '@/components/shared/BudgetCard';
import { formatCurrency } from '@/lib/utils';

// Calculate real spending for a budget based on transaction data
const calculateRealSpending = (
	budget: BudgetResponseDTO,
	transactions: any[]
) => {
	const budgetStartDate = new Date(budget.startDate);
	const budgetEndDate = new Date(budget.endDate);

	// Filter transactions for this budget's category and date range
	const relevantTransactions = transactions.filter((transaction) => {
		const transactionDate = new Date(transaction.transactionDate);
		const isInDateRange =
			transactionDate >= budgetStartDate &&
			transactionDate <= budgetEndDate;
		const isInCategory = transaction.category?.name === budget.categoryName;

		return isInDateRange && isInCategory;
	});

	// Sum the amounts of relevant transactions
	return relevantTransactions.reduce(
		(total, transaction) => total + transaction.amount,
		0
	);
};

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
					{budgets.map((budget) => (
						<BudgetCard key={budget.budgetId} budget={budget} />
					))}
				</div>
			)}
		</div>
	);
}
