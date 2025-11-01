import { useCategoryBreakdown } from '@/hooks/useAnalytics.ts';

interface CategoryBreakdownProps {
	userId: number;
}

export default function CategoryBreakdown({ userId }: CategoryBreakdownProps) {
	const { data: categories = [], isLoading: loading } =
		useCategoryBreakdown(userId);

	if (loading) {
		return (
			<div className='card'>
				<h2 className='text-xl font-bold mb-6'>Spending by Category</h2>
				<div className='space-y-5'>
					{[...Array(5)].map((_, i) => (
						<div key={i}>
							<div className='flex items-center justify-between mb-2'>
								<div className='w-24 h-4 bg-gray-200 rounded'></div>
								<div className='w-16 h-4 bg-gray-200 rounded'></div>
							</div>
							<div className='h-3 bg-gray-100 rounded-full overflow-hidden'>
								<div className='h-full bg-gray-200 rounded-full animate-pulse'></div>
							</div>
							<div className='w-20 h-3 bg-gray-200 rounded mt-1'></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='card'>
			<h2 className='text-xl font-bold mb-6'>Spending by Category</h2>
			<div className='space-y-5'>
				{categories.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						No spending data available
					</div>
				) : (
					categories.map((item, index) => (
						<div key={index}>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm font-medium text-gray-700'>
									{item.categoryName}
								</span>
								<span className='text-sm font-bold text-gray-900'>
									₹{item.totalSpent.toFixed(2)}
								</span>
							</div>
							<div className='h-3 bg-gray-100 rounded-full overflow-hidden'>
								<div
									className='h-full bg-green-500 rounded-full transition-all duration-1000 ease-out'
									style={{
										width: `${item.percentageOfTotal}%`,
										animationDelay: `${index * 100}ms`,
									}}
								/>
							</div>
							<div className='text-xs text-gray-500 mt-1'>
								{item.percentageOfTotal}% of spending
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
