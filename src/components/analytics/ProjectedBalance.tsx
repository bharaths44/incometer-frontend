import { Card, CardContent } from '@/components/ui/card';

export default function ProjectedBalance() {
	return (
		<Card className='bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white'>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div className='flex-1'>
						<h2 className='text-2xl font-bold mb-3'>
							Projected Year-End Balance
						</h2>
						<div className='text-5xl font-bold mb-2'>₹95,400</div>
						<p className='text-green-50'>
							Based on your current spending and income trends,
							you're on track to exceed your savings goal by 22%.
						</p>
					</div>
					<div className='text-8xl'>🎯</div>
				</div>
			</CardContent>
		</Card>
	);
}
