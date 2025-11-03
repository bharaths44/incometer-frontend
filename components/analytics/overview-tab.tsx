'use client';

import {
	AnalyticsLineChart,
	AnalyticsBarChart,
} from '@/components/analytics/analytics-charts';

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
	savings: number;
}

interface OverviewTabProps {
	monthlyData: MonthlyData[];
	isLoading: boolean;
	timePeriod: 'all' | 'year' | 'month';
}

export function OverviewTab({
	monthlyData,
	isLoading,
	timePeriod,
}: OverviewTabProps) {
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
			<AnalyticsLineChart
				data={monthlyData}
				xAxisKey='month'
				yAxisKeys={['income', 'expenses', 'savings']}
				title={`${periodLabel} Trend`}
				description={`Income, expenses, and savings over ${periodLabel.toLowerCase()} periods`}
				isLoading={isLoading}
				emptyMessage='No transaction data available'
			/>

			<AnalyticsBarChart
				data={monthlyData}
				xAxisKey='month'
				yAxisKeys={['income', 'expenses']}
				title={`${periodLabel} Comparison`}
				description={`${periodLabel} bar chart comparison`}
				isLoading={isLoading}
				emptyMessage='No transaction data available'
			/>
		</div>
	);
}
