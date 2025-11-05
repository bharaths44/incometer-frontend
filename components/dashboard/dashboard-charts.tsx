'use client';

import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { useCategoryBreakdown } from '@/hooks/useAnalytics';
import { useQuery } from '@tanstack/react-query';
import {
	createExpenseService,
	createIncomeService,
} from '@/services/transactionService';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/components/auth/AuthProvider';
import {
	format,
	parseISO,
	startOfMonth,
	endOfMonth,
	eachMonthOfInterval,
	subMonths,
} from 'date-fns';

const COLORS = [
	'#10b981', // emerald-500
	'#ef4444', // red-500
	'#3b82f6', // blue-500
	'#f59e0b', // amber-500
	'#8b5cf6', // violet-500
	'#ec4899', // pink-500
	'#14b8a6', // teal-500
	'#f97316', // orange-500
];

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
}

export function DashboardCharts() {
	const { user } = useAuthContext();
	const userId = user ? user.userId : '1';

	// Fetch category breakdown
	const { data: categoryData = [], isLoading: categoryLoading } =
		useCategoryBreakdown(userId);

	// Fetch transactions for the last 6 months
	const { data: expenses = [], isLoading: expensesLoading } = useQuery({
		queryKey: ['transactions', userId, 'expense'],
		queryFn: async () => {
			const service = createExpenseService();
			return service.getAll(userId);
		},
	});

	const { data: income = [], isLoading: incomeLoading } = useQuery({
		queryKey: ['transactions', userId, 'income'],
		queryFn: async () => {
			const service = createIncomeService();
			return service.getAll(userId);
		},
	});

	// Process monthly data for the line chart
	const monthlyData: MonthlyData[] = React.useMemo(() => {
		const now = new Date();
		const sixMonthsAgo = subMonths(now, 5);
		const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

		return months.map((month) => {
			const monthStart = startOfMonth(month);
			const monthEnd = endOfMonth(month);

			const monthlyIncome = income
				.filter((t) => {
					const date = parseISO(t.transactionDate);
					return date >= monthStart && date <= monthEnd;
				})
				.reduce((sum, t) => sum + t.amount, 0);

			const monthlyExpenses = expenses
				.filter((t) => {
					const date = parseISO(t.transactionDate);
					return date >= monthStart && date <= monthEnd;
				})
				.reduce((sum, t) => sum + t.amount, 0);

			return {
				month: format(month, 'MMM'),
				income: monthlyIncome,
				expenses: monthlyExpenses,
			};
		});
	}, [income, expenses]);

	// Transform category data for pie chart
	const categoryChartData = categoryData.map((cat) => ({
		name: cat.categoryName,
		value: parseFloat(cat.totalSpent.toFixed(2)),
		percentage: cat.percentageOfTotal,
	}));

	const isLoading = categoryLoading || expensesLoading || incomeLoading;

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<Card>
					<CardHeader>
						<CardTitle>Income vs Expenses</CardTitle>
						<CardDescription>
							Monthly comparison of income and expenses
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[300px] w-full' />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Expense Categories</CardTitle>
						<CardDescription>
							Breakdown of your expenses by category
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[250px] w-full' />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Income vs Expenses */}
			<Card>
				<CardHeader>
					<CardTitle>Income vs Expenses</CardTitle>
					<CardDescription>
						Monthly comparison of income and expenses (Last 6
						months)
					</CardDescription>
				</CardHeader>
				<CardContent>
					{monthlyData.length > 0 ? (
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={monthlyData}>
								<CartesianGrid
									strokeDasharray='3 3'
									className='stroke-muted'
								/>
								<XAxis dataKey='month' className='text-xs' />
								<YAxis
									className='text-xs'
									tickFormatter={(value) => `$${value}`}
								/>
								<Tooltip
									formatter={(value: number) =>
										`$${value.toFixed(2)}`
									}
									contentStyle={{
										backgroundColor: '#ffffff',
										border: '1px solid #e5e7eb',
										borderRadius: '6px',
										padding: '8px 12px',
									}}
									wrapperStyle={{
										outline: 'none',
									}}
								/>
								<Legend />
								<Line
									type='monotone'
									dataKey='income'
									stroke='#10b981'
									strokeWidth={2}
									name='Income'
									dot={{ fill: '#10b981' }}
								/>
								<Line
									type='monotone'
									dataKey='expenses'
									stroke='#ef4444'
									strokeWidth={2}
									name='Expenses'
									dot={{ fill: '#ef4444' }}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className='flex items-center justify-center h-[300px] text-muted-foreground'>
							<p>No transaction data available</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Expense Categories */}
			<Card>
				<CardHeader>
					<CardTitle>Expense Categories</CardTitle>
					<CardDescription>
						Breakdown of your expenses by category
					</CardDescription>
				</CardHeader>
				<CardContent>
					{categoryChartData.length > 0 ? (
						<div className='flex items-center justify-center'>
							<ResponsiveContainer width='100%' height={250}>
								<PieChart>
									<Pie
										data={categoryChartData}
										cx='50%'
										cy='50%'
										labelLine={false}
										label={(entry) => {
											const data = entry as unknown as {
												name: string;
												percentage: number;
											};
											return `${data.name}: ${data.percentage.toFixed(1)}%`;
										}}
										outerRadius={80}
										fill='#8884d8'
										dataKey='value'
									>
										{categoryChartData.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS[
															index %
																COLORS.length
														]
													}
												/>
											)
										)}
									</Pie>
									<Tooltip
										formatter={(value: number) =>
											`$${value.toFixed(2)}`
										}
										contentStyle={{
											backgroundColor: '#ffffff',
											border: '1px solid #e5e7eb',
											borderRadius: '6px',
											padding: '8px 12px',
										}}
										wrapperStyle={{
											outline: 'none',
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className='flex items-center justify-center h-[250px] text-muted-foreground'>
							<p>No expense data available</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
