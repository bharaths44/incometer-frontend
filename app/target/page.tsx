'use client';

import { AppLayout } from '@/components/layout/app-layout';
import TargetList from '@/components/target/TargetList';

export default function TargetPage() {
	return (
		<AppLayout>
			<div className='space-y-6'>
				<div>
					<h1 className='text-3xl font-bold'>Targets</h1>
					<p className='text-muted-foreground'>
						Set and track your financial goals and targets
					</p>
				</div>

				<TargetList />
			</div>
		</AppLayout>
	);
}
