'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/app-layout';
import { ExpenseSummaryCards } from '@/components/analytics/expense-summary-cards';
import { AnalyticsHeader } from '@/components/analytics/analytics-header';
import { AnalyticsTabs } from '@/components/analytics/analytics-tabs';
import { useBudgetAnalytics } from '@/hooks/useAnalytics';
import { useBudgets } from '@/hooks/useBudgets';
import { useQuery } from '@tanstack/react-query';
import {
	createExpenseService,
	createIncomeService,
} from '@/services/transactionService';
import { useAuthContext } from '@/components/auth/AuthProvider';
import {
	eachDayOfInterval,
	eachMonthOfInterval,
	endOfDay,
	endOfMonth,
	endOfYear,
	format,
	parseISO,
	startOfDay,
	startOfMonth,
	startOfYear,
	subMonths,
} from 'date-fns';

export default function AnalyticsPage() {
	// Hardcoded userId (auth not implemented yet)
	const { user } = useAuthContext();
	const userId = user ? user.userId : '1';

	// Time period selection
	const [timePeriod, setTimePeriod] = React.useState<
		'all' | 'year' | 'month'
	>('all');

	// Calculate date range based on selected period
	const getDateRange = () => {
		const now = new Date();
		switch (timePeriod) {
			case 'month':
				return {
					startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
					endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
				};
			case 'year':
				return {
					startDate: format(startOfYear(now), 'yyyy-MM-dd'),
					endDate: format(endOfYear(now), 'yyyy-MM-dd'),
				};
			case 'all':
			default:
				return null; // No date filter for all time
		}
	};

	const dateRange = getDateRange();

	// Fetch transactions for monthly trends
	const { data: expenses = [], isLoading: expensesLoading } = useQuery({
		queryKey: ['transactions', userId, 'expense', dateRange],
		queryFn: async () => {
			const service = createExpenseService();
			if (dateRange) {
				return service.getByDateRange(
					userId,
					dateRange.startDate,
					dateRange.endDate
				);
			}
			return service.getAll(userId);
		},
		staleTime: 30000, // Cache for 30 seconds
	});

	const { data: income = [], isLoading: incomeLoading } = useQuery({
		queryKey: ['transactions', userId, 'income', dateRange],
		queryFn: async () => {
			const service = createIncomeService();
			if (dateRange) {
				return service.getByDateRange(
					userId,
					dateRange.startDate,
					dateRange.endDate
				);
			}
			return service.getAll(userId);
		},
		staleTime: 30000, // Cache for 30 seconds
	});

	// Calculate expense summary from filtered transactions
	const calculatedExpenseSummary = React.useMemo(() => {
		if (!expenses.length && !income.length) return undefined;

		const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
		const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
		const netSavings = totalIncome - totalExpense;

		// Calculate percentage changes (simplified - in real app would compare with previous period)
		const incomePercentageChange = null; // Would need previous period data
		const expensePercentageChange = null; // Would need previous period data
		const savingsPercentageChange = null; // Would need previous period data

		const currentMonthIncome = income
			.filter((t) => {
				const date = parseISO(t.transactionDate);
				const now = new Date();
				return (
					date.getMonth() === now.getMonth() &&
					date.getFullYear() === now.getFullYear()
				);
			})
			.reduce((sum, t) => sum + t.amount, 0);

		const currentMonthExpense = expenses
			.filter((t) => {
				const date = parseISO(t.transactionDate);
				const now = new Date();
				return (
					date.getMonth() === now.getMonth() &&
					date.getFullYear() === now.getFullYear()
				);
			})
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			totalIncome,
			totalExpense,
			netSavings,
			currentMonthExpense,
			currentMonthIncome,
			incomePercentageChange,
			expensePercentageChange,
			savingsPercentageChange,
		};
	}, [expenses, income]);

	// Calculate category breakdown from filtered transactions

	// Use calculated data instead of API calls
	const categoryData = React.useMemo(() => {
		const categoryTotals: { [key: string]: number } = {};
		let totalExpense = 0;

		expenses.forEach((transaction) => {
			const categoryName = transaction.category.name;
			categoryTotals[categoryName] =
				(categoryTotals[categoryName] || 0) + transaction.amount;
			totalExpense += transaction.amount;
		});

		return Object.entries(categoryTotals).map(
			([categoryName, totalSpent]) => ({
				categoryName,
				totalSpent,
				percentageOfTotal:
					totalExpense > 0 ? (totalSpent / totalExpense) * 100 : 0,
			})
		);
	}, [expenses]);
	const expenseSummary = calculatedExpenseSummary;
	const { error: budgetError } = useBudgetAnalytics(userId);

	// Fetch budgets and transform to analytics format
	const { data: budgets = [], isLoading: budgetsLoading } =
		useBudgets(userId);
	const transformedBudgetAnalytics = React.useMemo(() => {
		return budgets
			.filter((budget) => budget.type === 'LIMIT' && budget.active)
			.map((budget) => ({
				categoryName: budget.categoryName,
				spent: budget.spent,
				limit: budget.amount,
				remaining: Math.max(0, budget.amount - budget.spent),
				usagePercentage:
					budget.amount > 0
						? (budget.spent / budget.amount) * 100
						: 0,
				exceeded: budget.spent > budget.amount,
			}));
	}, [budgets]);

	// Process monthly data for charts
	const monthlyData = React.useMemo(() => {
		const now = new Date();

		let intervals: Date[];
		let formatKey: string;

		switch (timePeriod) {
			case 'month':
				// Show daily data for current month
				const daysInMonth = eachDayOfInterval({
					start: startOfMonth(now),
					end: endOfMonth(now),
				});
				intervals = daysInMonth;
				formatKey = 'dd';
				break;
			case 'year':
				// Show monthly data for current year
				const monthsInYear = eachMonthOfInterval({
					start: startOfYear(now),
					end: now,
				});
				intervals = monthsInYear;
				formatKey = 'MMM';
				break;
			case 'all':
			default:
				// Show last 6 months for all time
				const sixMonthsAgo = subMonths(now, 5);
				const months = eachMonthOfInterval({
					start: sixMonthsAgo,
					end: now,
				});
				intervals = months;
				formatKey = 'MMM';
				break;
		}

		return intervals.map((interval) => {
			let intervalStart: Date;
			let intervalEnd: Date;

			switch (timePeriod) {
				case 'month':
					intervalStart = startOfDay(interval);
					intervalEnd = endOfDay(interval);
					break;
				case 'year':
				case 'all':
				default:
					intervalStart = startOfMonth(interval);
					intervalEnd = endOfMonth(interval);
					break;
			}

			const monthlyIncome = income
				.filter((t) => {
					const date = parseISO(t.transactionDate);
					return date >= intervalStart && date <= intervalEnd;
				})
				.reduce((sum, t) => sum + t.amount, 0);

			const monthlyExpenses = expenses
				.filter((t) => {
					const date = parseISO(t.transactionDate);
					return date >= intervalStart && date <= intervalEnd;
				})
				.reduce((sum, t) => sum + t.amount, 0);

			const savings = monthlyIncome - monthlyExpenses;

			return {
				month: format(interval, formatKey),
				income: monthlyIncome,
				expenses: monthlyExpenses,
				savings: savings,
			};
		});
	}, [income, expenses, timePeriod]);

	const isLoading = budgetsLoading || expensesLoading || incomeLoading;

	if (budgetError) {
		return (
			<AppLayout>
				<div className='space-y-6'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Analytics & Insights
						</h1>
						<p className='text-muted-foreground mt-1'>
							Analyze your financial data and trends
						</p>
					</div>
					<Card>
						<CardContent className='flex items-center justify-center h-[200px]'>
							<div className='text-center'>
								<p className='text-muted-foreground mb-2'>
									Failed to load analytics data
								</p>
								<p className='text-sm text-muted-foreground'>
									Please try refreshing the page
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<AnalyticsHeader
					timePeriod={timePeriod}
					onTimePeriodChange={setTimePeriod}
				/>

				{/* Summary Cards */}
				<ExpenseSummaryCards
					expenseSummary={expenseSummary}
					isLoading={isLoading}
				/>

				{/* Tabs */}
				<AnalyticsTabs
					monthlyData={monthlyData}
					categoryChartData={categoryData}
					incomeTransactions={income}
					budgetAnalytics={transformedBudgetAnalytics}
					isLoading={isLoading}
					timePeriod={timePeriod}
				/>
			</div>
		</AppLayout>
	);
}
