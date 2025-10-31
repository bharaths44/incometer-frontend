import { Calendar } from 'lucide-react';
import SpendingByCategory from '../components/analytics/SpendingByCategory';
import FinancialOverview from '../components/analytics/FinancialOverview';
import BudgetOverview from '../components/analytics/BudgetOverview';
import ProjectedBalance from '../components/analytics/ProjectedBalance';
import {
	useCategoryBreakdown,
	useBudgetAnalytics,
	useExpenseSummary,
} from '../hooks/useAnalytics';

export default function Analytics() {
	const userId = 1; // TODO: Get from auth context

	const { data: categoryBreakdown = [], isLoading: categoryLoading } =
		useCategoryBreakdown(userId);
	const { data: expenseSummary, isLoading: expenseLoading } =
		useExpenseSummary(userId);
	const { data: budgetAnalytics = [], isLoading: budgetLoading } =
		useBudgetAnalytics(userId);

	const loading = categoryLoading || expenseLoading || budgetLoading;

	if (loading) {
		return (
			<div className='page-transition space-y-8'>
				<div className='flex items-center justify-center h-64'>
					<div className='text-xl'>Loading analytics...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='page-transition space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-4xl font-bold mb-2'>Analytics</h1>
					<p className='text-gray-600 flex items-center gap-2'>
						<Calendar className='w-4 h-4' />
						{new Date().toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
						})}
					</p>
				</div>
				<div className='flex gap-3'>
					<button className='btn-secondary text-sm'>
						Last 30 Days
					</button>
					<button className='btn-secondary text-sm'>
						Last 6 Months
					</button>
				</div>
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				<SpendingByCategory categoryBreakdown={categoryBreakdown} />
				{expenseSummary && (
					<FinancialOverview expenseSummary={expenseSummary} />
				)}
			</div>

			<ProjectedBalance />

			<BudgetOverview budgetAnalytics={budgetAnalytics} />
		</div>
	);
}
