'use client';

import React from 'react';
import {
	AnalyticsLineChart,
	AnalyticsPieChart,
} from '@/components/analytics/analytics-charts';
import { TransactionResponseDTO } from '@/types/transaction';

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
	savings: number;
}

interface IncomeTabProps {
	incomeTransactions: TransactionResponseDTO[];
	monthlyData: MonthlyData[];
	isLoading: boolean;
	timePeriod: 'all' | 'year' | 'month';
}

export function IncomeTab({
	incomeTransactions,
	monthlyData,
	isLoading,
	timePeriod,
}: IncomeTabProps) {
	// Process income transactions to create categories by category
	const incomeCategories = React.useMemo(() => {
		if (!incomeTransactions || incomeTransactions.length === 0) {
			return [];
		}

		// Group income by category
		const categoryTotals: { [key: string]: number } = {};
		let totalIncome = 0;

		incomeTransactions.forEach((transaction) => {
			const categoryName = transaction.category.name;
			categoryTotals[categoryName] =
				(categoryTotals[categoryName] || 0) + transaction.amount;
			totalIncome += transaction.amount;
		});

		// Convert to data with actual amounts and percentages for pie chart
		return Object.entries(categoryTotals).map(([name, amount]) => ({
			name,
			value: parseFloat(amount.toFixed(2)),
			percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
		}));
	}, [incomeTransactions]);

	const getPeriodLabel = () => {
		switch (timePeriod) {
			case 'month':
				return 'Daily';
			case 'year':
				return 'Monthly';
			case 'all':
			default:
				return 'Monthly';
		}
	};

	const periodLabel = getPeriodLabel();

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			<AnalyticsPieChart
				data={incomeCategories}
				title='Income Distribution'
				description='Breakdown by category'
				isLoading={isLoading}
				emptyMessage='No income data available'
			/>

			<AnalyticsLineChart
				data={monthlyData}
				xAxisKey='month'
				yAxisKeys={['income']}
				title='Income Trends'
				description={`${periodLabel} income analysis`}
				isLoading={isLoading}
				emptyMessage='No income data available'
			/>
		</div>
	);
}
