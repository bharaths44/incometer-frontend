'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	AnalyticsBarChart,
	COLORS,
} from '@/components/analytics/analytics-charts';
import { BudgetAnalytics } from '@/types/analytics';

interface BudgetAnalyticsSectionProps {
	budgetAnalytics: BudgetAnalytics[];
	isLoading: boolean;
}

export function BudgetAnalyticsSection({
	budgetAnalytics,
	isLoading,
}: BudgetAnalyticsSectionProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Budget Performance */}
			<Card>
				<CardHeader>
					<CardTitle>Budget Performance</CardTitle>
					<CardDescription>
						Current budget usage by category
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='space-y-4'>
							{[...Array(3)].map((_, i) => (
								<div key={i} className='space-y-2'>
									<div className='flex justify-between text-sm'>
										<span className='text-muted-foreground'>
											Loading...
										</span>
										<span className='text-muted-foreground'>
											0% / ₹0
										</span>
									</div>
									<div className='w-full bg-muted rounded-full h-2'>
										<div className='bg-primary h-2 rounded-full w-0'></div>
									</div>
								</div>
							))}
						</div>
					) : budgetAnalytics.length > 0 ? (
						<div className='space-y-4'>
							{budgetAnalytics
								.filter((budget) => (budget.limit ?? 0) > 0) // Only show budgets with valid limits
								.map((budget) => (
									<div
										key={`${budget.categoryName}-${budget.spent}-${budget.limit}`}
										className='space-y-2'
									>
										<div className='flex justify-between text-sm'>
											<span className='font-medium'>
												{budget.categoryName}
											</span>
											<span className='text-muted-foreground'>
												₹
												{(budget.spent ?? 0).toFixed(2)}
												/ ₹
												{(budget.limit ?? 0).toFixed(2)}
											</span>
										</div>
										<div className='w-full bg-muted rounded-full h-2'>
											<div
												className={`h-2 rounded-full ${
													(budget.usagePercentage ??
														0) > 100
														? 'bg-red-500'
														: (budget.usagePercentage ??
																	0) > 80
															? 'bg-yellow-500'
															: 'bg-green-500'
												}`}
												style={{
													width: `${Math.min(budget.usagePercentage ?? 0, 100)}%`,
												}}
											></div>
										</div>
									</div>
								))}
						</div>
					) : (
						<div className='flex items-center justify-center h-[200px] text-muted-foreground'>
							<p>No budget data available</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Budget vs Actual */}
			<AnalyticsBarChart
				data={budgetAnalytics
					.filter((budget) => (budget.limit ?? 0) > 0)
					.map((budget) => ({
						category: budget.categoryName,
						spent: budget.spent ?? 0,
						limit: budget.limit ?? 0,
					}))}
				xAxisKey='category'
				yAxisKeys={['spent', 'limit']}
				colors={[COLORS[1], COLORS[0]]} // red for spent, green for limit
				title='Budget vs Actual Spending'
				description='Comparison of budgeted amounts vs actual spending'
				isLoading={isLoading}
				emptyMessage='No budget data available'
			/>
		</div>
	);
}
