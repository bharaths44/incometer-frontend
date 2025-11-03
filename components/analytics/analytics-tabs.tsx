'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from '@/components/analytics/overview-tab';
import { ExpensesTab } from '@/components/analytics/expenses-tab';
import { IncomeTab } from '@/components/analytics/income-tab';
import { BudgetAnalyticsSection } from '@/components/analytics/budget-analytics-section';

interface AnalyticsTabsProps {
	monthlyData: Array<{
		month: string;
		income: number;
		expenses: number;
		savings: number;
	}>;
	categoryChartData: Array<{
		categoryName: string;
		totalSpent: number;
		percentageOfTotal: number;
	}>;
	incomeTransactions: Array<any>;
	budgetAnalytics: Array<{
		categoryName: string;
		spent: number;
		limit: number;
		remaining: number;
		usagePercentage: number;
		exceeded: boolean;
	}>;
	isLoading: boolean;
	timePeriod: 'all' | 'year' | 'month';
}

export function AnalyticsTabs({
	monthlyData,
	categoryChartData,
	incomeTransactions,
	budgetAnalytics,
	isLoading,
	timePeriod,
}: AnalyticsTabsProps) {
	return (
		<Tabs defaultValue='overview' className='w-full'>
			<TabsList className='grid w-full grid-cols-4'>
				<TabsTrigger value='overview'>Overview</TabsTrigger>
				<TabsTrigger value='expenses'>Expenses</TabsTrigger>
				<TabsTrigger value='income'>Income</TabsTrigger>
				<TabsTrigger value='budgets'>Budgets</TabsTrigger>
			</TabsList>

			{/* Overview Tab */}
			<TabsContent value='overview' className='space-y-4'>
				<OverviewTab
					monthlyData={monthlyData}
					isLoading={isLoading}
					timePeriod={timePeriod}
				/>
			</TabsContent>

			{/* Expenses Tab */}
			<TabsContent value='expenses' className='space-y-4'>
				<ExpensesTab
					categoryChartData={categoryChartData}
					monthlyData={monthlyData}
					isLoading={isLoading}
					timePeriod={timePeriod}
				/>
			</TabsContent>

			{/* Income Tab */}
			<TabsContent value='income' className='space-y-4'>
				<IncomeTab
					incomeTransactions={incomeTransactions}
					monthlyData={monthlyData}
					isLoading={isLoading}
					timePeriod={timePeriod}
				/>
			</TabsContent>

			{/* Budgets Tab */}
			<TabsContent value='budgets' className='space-y-4'>
				<BudgetAnalyticsSection
					budgetAnalytics={budgetAnalytics}
					isLoading={isLoading}
				/>
			</TabsContent>
		</Tabs>
	);
}
