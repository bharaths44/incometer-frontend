'use client';

import { useState, useEffect } from 'react';
import { BudgetResponseDTO } from '@/types/budget';
import { getTargetsByUser } from '@/services/budgetService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import BudgetCard from '@/components/shared/BudgetCard';

export default function TargetList() {
	const [targets, setTargets] = useState<BudgetResponseDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = 1; // TODO: Get from auth context

	useEffect(() => {
		loadTargets();
	}, []);

	const loadTargets = async () => {
		try {
			const data = await getTargetsByUser(userId);
			setTargets(data);
		} catch (error) {
			console.error('Failed to load targets:', error);
			setTargets([]); // Show empty state on error
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold'>Your Targets</h2>
				<Button>
					<Plus className='h-4 w-4 mr-2' />
					Add Target
				</Button>
			</div>

			{targets.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center justify-center py-12'>
						<Target className='h-12 w-12 text-muted-foreground mb-4' />
						<p className='text-muted-foreground mb-4'>
							No targets set yet
						</p>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							Set Your First Target
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{targets.map((target) => (
						<BudgetCard key={target.budgetId} budget={target} />
					))}
				</div>
			)}
		</div>
	);
}
