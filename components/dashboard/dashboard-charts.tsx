'use client';

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

const incomeData = [
	{ month: 'Jan', income: 4000, expenses: 2400 },
	{ month: 'Feb', income: 3000, expenses: 1398 },
	{ month: 'Mar', income: 2000, expenses: 9800 },
	{ month: 'Apr', income: 2780, expenses: 3908 },
	{ month: 'May', income: 1890, expenses: 4800 },
	{ month: 'Jun', income: 2390, expenses: 3800 },
];

const categoryData = [
	{ name: 'Groceries', value: 35 },
	{ name: 'Transport', value: 20 },
	{ name: 'Entertainment', value: 25 },
	{ name: 'Utilities', value: 20 },
];

const COLORS = [
	'hsl(var(--color-chart-1))',
	'hsl(var(--color-chart-2))',
	'hsl(var(--color-chart-3))',
	'hsl(var(--color-chart-4))',
];

export function DashboardCharts() {
	return (
		<div className='space-y-6'>
			{/* Income vs Expenses */}
			<Card>
				<CardHeader>
					<CardTitle>Income vs Expenses</CardTitle>
					<CardDescription>
						Monthly comparison of income and expenses
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={incomeData}>
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
						</LineChart>
					</ResponsiveContainer>
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
					<div className='flex items-center justify-center'>
						<ResponsiveContainer width='100%' height={250}>
							<PieChart>
								<Pie
									data={categoryData}
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
									{categoryData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
