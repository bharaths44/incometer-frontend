import { AlertTriangle, CheckCircle, IndianRupee } from 'lucide-react';
import { BudgetAnalytics } from '../../types/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetOverviewProps {
	budgetAnalytics: BudgetAnalytics[];
}

export default function BudgetOverview({
	budgetAnalytics,
}: BudgetOverviewProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<IndianRupee className='w-6 h-6 text-green-600' />
					Budget Overview
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{budgetAnalytics.map((budget, index) => (
						<div
							key={index}
							className='p-4 bg-muted rounded-2xl border'
						>
							<div className='flex items-center justify-between mb-2'>
								<span className='font-medium'>
									{budget.categoryName}
								</span>
								{budget.exceeded ? (
									<AlertTriangle className='w-5 h-5 text-red-600' />
								) : (
									<CheckCircle className='w-5 h-5 text-green-600' />
								)}
							</div>
							<div className='flex items-center justify-between mb-1'>
								<span className='text-sm text-muted-foreground'>
									Spent: ₹{budget.spent}
								</span>
								<span className='text-sm text-muted-foreground'>
									Limit: ₹{budget.limit}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									Remaining: ₹{budget.remaining}
								</span>
								<span
									className={`text-sm font-semibold ${budget.exceeded ? 'text-red-600' : 'text-green-600'}`}
								>
									{budget.usagePercentage}%
								</span>
							</div>
							<div className='mt-2 h-2 bg-muted rounded-full overflow-hidden'>
								<div
									className={`h-full ${budget.exceeded ? 'bg-red-500' : 'bg-green-500'} rounded-full transition-all duration-1000 ease-out`}
									style={{
										width: `${Math.min(budget.usagePercentage, 100)}%`,
										animationDelay: `${index * 100}ms`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
