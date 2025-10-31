import { Calendar } from 'lucide-react';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';

export default function Dashboard() {
	// Assuming userId is 1 for now - this should come from auth context
	const userId = 1;

	return (
		<div className='page-transition space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-4xl font-bold mb-2'>Dashboard</h1>
					<p className='text-gray-600 flex items-center gap-2'>
						<Calendar className='w-4 h-4' />
						{new Date().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>
			</div>

			<DashboardStats userId={userId} />

			<div className='grid lg:grid-cols-3 gap-6'>
				<RecentTransactions userId={userId} />
				<CategoryBreakdown userId={userId} />
			</div>

			<FinancialHealthScore userId={userId} />
		</div>
	);
}
