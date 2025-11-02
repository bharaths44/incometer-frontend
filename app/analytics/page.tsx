'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
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
import { AppLayout } from '@/components/layout/app-layout';

const monthlyData = [
	{ month: 'Jan', income: 4000, expenses: 2400, savings: 1600 },
	{ month: 'Feb', income: 3000, expenses: 1398, savings: 1602 },
	{ month: 'Mar', income: 5000, expenses: 2000, savings: 3000 },
	{ month: 'Apr', income: 4780, expenses: 3908, savings: 872 },
	{ month: 'May', income: 5890, expenses: 4800, savings: 1090 },
	{ month: 'Jun', income: 6390, expenses: 3800, savings: 2590 },
];

const categoryExpenses = [
	{ name: 'Food', value: 30 },
	{ name: 'Transportation', value: 20 },
	{ name: 'Entertainment', value: 20 },
	{ name: 'Utilities', value: 15 },
	{ name: 'Healthcare', value: 10 },
	{ name: 'Other', value: 5 },
];

const incomeCategories = [
	{ name: 'Employment', value: 70 },
	{ name: 'Freelance', value: 20 },
	{ name: 'Investment', value: 10 },
];

const COLORS = [
	'hsl(var(--color-chart-1))',
	'hsl(var(--color-chart-2))',
	'hsl(var(--color-chart-3))',
	'hsl(var(--color-chart-4))',
	'hsl(var(--color-chart-5))',
];

export default function AnalyticsPage() {
	return (
		<AppLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Analytics & Insights
					</h1>
					<p className='text-muted-foreground mt-1'>
						Analyze your financial data and trends
					</p>
				</div>

				{/* Tabs */}
				<Tabs defaultValue='overview' className='w-full'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='overview'>Overview</TabsTrigger>
						<TabsTrigger value='expenses'>Expenses</TabsTrigger>
						<TabsTrigger value='income'>Income</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value='overview' className='space-y-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Monthly Trend */}
							<Card>
								<CardHeader>
									<CardTitle>Monthly Trend</CardTitle>
									<CardDescription>
										Income, expenses, and savings over time
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<LineChart data={monthlyData}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type='monotone'
												dataKey='income'
												stroke='hsl(var(--color-chart-2))'
												strokeWidth={2}
											/>
											<Line
												type='monotone'
												dataKey='expenses'
												stroke='hsl(var(--color-chart-3))'
												strokeWidth={2}
											/>
											<Line
												type='monotone'
												dataKey='savings'
												stroke='hsl(var(--color-chart-1))'
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Monthly Comparison */}
							<Card>
								<CardHeader>
									<CardTitle>Monthly Comparison</CardTitle>
									<CardDescription>
										Bar chart comparison by month
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<BarChart data={monthlyData}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar
												dataKey='income'
												fill='hsl(var(--color-chart-2))'
											/>
											<Bar
												dataKey='expenses'
												fill='hsl(var(--color-chart-3))'
											/>
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Expenses Tab */}
					<TabsContent value='expenses' className='space-y-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Expense Categories */}
							<Card>
								<CardHeader>
									<CardTitle>Expense Distribution</CardTitle>
									<CardDescription>
										Breakdown by category
									</CardDescription>
								</CardHeader>
								<CardContent className='flex items-center justify-center'>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<PieChart>
											<Pie
												data={categoryExpenses}
												cx='50%'
												cy='50%'
												labelLine={false}
												label={(entry) =>
													`${entry.name}: ${entry.value}%`
												}
												outerRadius={80}
												fill='#8884d8'
												dataKey='value'
											>
												{categoryExpenses.map(
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
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Expense Trends */}
							<Card>
								<CardHeader>
									<CardTitle>Expense Trends</CardTitle>
									<CardDescription>
										Monthly expense analysis
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<LineChart data={monthlyData}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type='monotone'
												dataKey='expenses'
												stroke='hsl(var(--color-chart-3))'
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Income Tab */}
					<TabsContent value='income' className='space-y-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Income Sources */}
							<Card>
								<CardHeader>
									<CardTitle>Income Distribution</CardTitle>
									<CardDescription>
										Breakdown by source
									</CardDescription>
								</CardHeader>
								<CardContent className='flex items-center justify-center'>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<PieChart>
											<Pie
												data={incomeCategories}
												cx='50%'
												cy='50%'
												labelLine={false}
												label={(entry) =>
													`${entry.name}: ${entry.value}%`
												}
												outerRadius={80}
												fill='#8884d8'
												dataKey='value'
											>
												{incomeCategories.map(
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
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Income Trends */}
							<Card>
								<CardHeader>
									<CardTitle>Income Trends</CardTitle>
									<CardDescription>
										Monthly income analysis
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer
										width='100%'
										height={300}
									>
										<LineChart data={monthlyData}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line
												type='monotone'
												dataKey='income'
												stroke='hsl(var(--color-chart-2))'
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AppLayout>
	);
}
