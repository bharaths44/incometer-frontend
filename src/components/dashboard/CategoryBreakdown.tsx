import { useCategoryBreakdown } from '@/hooks/useAnalytics.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryBreakdownProps {
	userId: number;
}

export default function CategoryBreakdown({ userId }: CategoryBreakdownProps) {
	const { data: categories = [], isLoading: loading } =
		useCategoryBreakdown(userId);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Spending by Category</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-5'>
						{[...Array(5)].map((_, i) => (
							<div key={i}>
								<div className='flex items-center justify-between mb-2'>
									<div className='w-24 h-4 bg-surface-variant rounded'></div>
									<div className='w-16 h-4 bg-surface-variant rounded'></div>
								</div>
								<div className='h-3 bg-surface-container-high rounded-full overflow-hidden'>
									<div className='h-full bg-surface-variant rounded-full animate-pulse'></div>
								</div>
								<div className='w-20 h-3 bg-surface-variant rounded mt-1'></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Spending by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-5'>
					{categories.length === 0 ? (
						<div className='text-center py-8 text-surface-variant-foreground'>
							No spending data available
						</div>
					) : (
						categories.map((item, index) => (
							<div key={index}>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium text-gray-700'>
										{item.categoryName}
									</span>
									<span className='text-sm font-bold text-foreground'>
										₹{item.totalSpent.toFixed(2)}
									</span>
								</div>
								<div className='h-3 bg-surface-container-high rounded-full overflow-hidden'>
									<div
										className='h-full bg-primary rounded-full transition-all duration-1000 ease-out'
										style={{
											width: `${item.percentageOfTotal}%`,
											animationDelay: `${index * 100}ms`,
										}}
									/>
								</div>
								<div className='text-xs text-surface-variant-foreground mt-1'>
									{item.percentageOfTotal}% of spending
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}
