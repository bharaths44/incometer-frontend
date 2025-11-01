import { PieChart } from 'lucide-react';
import { CategoryAnalytics } from '@/types/analytics.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpendingByCategoryProps {
	categoryBreakdown: CategoryAnalytics[];
}

export default function SpendingByCategory({
	categoryBreakdown,
}: SpendingByCategoryProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<PieChart className='w-6 h-6 text-green-600' />
					Spending by Category
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-6'>
					{categoryBreakdown.map((item, index) => (
						<div key={index} className='space-y-3'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<span className='font-medium'>
										{item.categoryName}
									</span>
								</div>
								<div className='text-right'>
									<div className='font-bold'>
										₹{item.totalSpent}
									</div>
								</div>
							</div>
							<div className='flex items-center gap-3'>
								<div className='flex-1 h-3 bg-muted rounded-full overflow-hidden'>
									<div
										className='h-full bg-green-500 rounded-full transition-all duration-1000 ease-out'
										style={{
											width: `${item.percentageOfTotal}%`,
											animationDelay: `${index * 100}ms`,
										}}
									/>
								</div>
								<span className='text-sm font-semibold w-12 text-right'>
									{item.percentageOfTotal}%
								</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
