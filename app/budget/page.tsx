'use client';

import { AppLayout } from '@/components/layout/app-layout';
import BudgetList from '@/components/budget/BudgetList';

export default function BudgetPage() {
	return (
		<AppLayout>
			<div className='space-y-6'>
				<div>
					<h1 className='text-3xl font-bold'>Budgets</h1>
					<p className='text-muted-foreground'>
						Manage your budget goals and track your spending limits
					</p>
				</div>

				<BudgetList />
			</div>
		</AppLayout>
	);
}
