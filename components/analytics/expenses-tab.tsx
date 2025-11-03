'use client';

import {
	AnalyticsLineChart,
	AnalyticsPieChart,
} from '@/components/analytics/analytics-charts';
import { CategoryAnalytics } from '@/types/analytics';

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
	savings: number;
}

interface ExpensesTabProps {
	categoryChartData: CategoryAnalytics[];
	monthlyData: MonthlyData[];
	isLoading: boolean;
	timePeriod: 'all' | 'year' | 'month';
}

export function ExpensesTab({
	categoryChartData,
	monthlyData,
	isLoading,
	timePeriod,
}: ExpensesTabProps) {
	// Transform category data for pie chart
	const pieChartData = categoryChartData.map((cat) => ({
		name: cat.categoryName,
		value: parseFloat(cat.totalSpent.toFixed(2)),
		percentage: cat.percentageOfTotal,
	}));

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
				data={pieChartData}
				title='Expense Distribution'
				description='Breakdown by category'
				isLoading={isLoading}
				emptyMessage='No expense data available'
			/>

			<AnalyticsLineChart
				data={monthlyData}
				xAxisKey='month'
				yAxisKeys={['expenses']}
				title='Expense Trends'
				description={`${periodLabel} expense analysis`}
				isLoading={isLoading}
				emptyMessage='No expense data available'
			/>
		</div>
	);
}
