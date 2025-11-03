'use client';

import { useState, useEffect } from 'react';
import { BudgetResponseDTO } from '@/types/budget';
import { getTargetsByUser } from '@/services/budgetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, TrendingUp } from 'lucide-react';

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

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	const calculateProgress = (current: number, target: number) => {
		return Math.min((current / target) * 100, 100);
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
					{targets.map((target, index) => {
						// For demo: Use different progress levels for variety
						const progressLevels = [0.3, 0.6, 0.8, 0.95]; // 30%, 60%, 80%, 95%
						const progress =
							progressLevels[index % progressLevels.length] * 100;
						const currentAmount = Math.floor(
							target.amount * (progress / 100)
						);
						const isCompleted = progress >= 100;

						return (
							<Card key={target.budgetId}>
								<CardHeader className='pb-3'>
									<div className='flex justify-between items-start'>
										<CardTitle className='text-lg flex items-center gap-2'>
											<Target className='h-5 w-5' />
											{target.categoryName} Target
										</CardTitle>
										<Badge
											variant={
												isCompleted
													? 'default'
													: 'secondary'
											}
										>
											{isCompleted
												? 'Completed'
												: `${progress.toFixed(0)}%`}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='space-y-3'>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Current:
											</span>
											<span className='font-semibold'>
												{formatCurrency(currentAmount)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Target:
											</span>
											<span className='font-semibold'>
												{formatCurrency(target.amount)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Remaining:
											</span>
											<span className='font-semibold'>
												{formatCurrency(
													target.amount -
														currentAmount
												)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-muted-foreground'>
												Deadline:
											</span>
											<span className='text-sm'>
												{new Date(
													target.endDate
												).toLocaleDateString()}
											</span>
										</div>

										{/* Progress bar */}
										<div className='space-y-1'>
											<div className='flex justify-between text-xs'>
												<span>Progress</span>
												<span>
													{progress.toFixed(0)}%
												</span>
											</div>
											<div className='w-full bg-secondary rounded-full h-2'>
												<div
													className={`h-2 rounded-full transition-all duration-300 ${
														isCompleted
															? 'bg-green-500'
															: 'bg-primary'
													}`}
													style={{
														width: `${progress}%`,
													}}
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
