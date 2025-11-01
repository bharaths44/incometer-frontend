import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useExpenseSummary } from '@/hooks/useAnalytics.ts';
import { ExpenseSummary } from '@/types/analytics.ts';

interface FinancialHealthScoreProps {
	userId: number;
}

export default function FinancialHealthScore({
	userId,
}: FinancialHealthScoreProps) {
	const { data: summary, isLoading: loading } = useExpenseSummary(userId);
	const [score, setScore] = useState(0);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (summary) {
			calculateHealthScore(summary);
		}
	}, [summary]);

	const calculateHealthScore = (data: ExpenseSummary) => {
		let calculatedScore = 0;

		// Savings rate (30% of score)
		const savingsRate =
			data.totalIncome > 0
				? (data.netSavings / data.totalIncome) * 100
				: 0;
		if (savingsRate >= 20) calculatedScore += 30;
		else if (savingsRate >= 10) calculatedScore += 20;
		else if (savingsRate >= 5) calculatedScore += 10;
		else if (savingsRate > 0) calculatedScore += 5;

		// Expense to income ratio (40% of score)
		const expenseRatio =
			data.totalIncome > 0
				? (data.totalExpense / data.totalIncome) * 100
				: 100;
		if (expenseRatio <= 50) calculatedScore += 40;
		else if (expenseRatio <= 70) calculatedScore += 30;
		else if (expenseRatio <= 90) calculatedScore += 20;
		else if (expenseRatio <= 100) calculatedScore += 10;

		// Net positive savings (30% of score)
		if (data.netSavings > 0) {
			calculatedScore += 30;
		} else if (data.netSavings === 0) {
			calculatedScore += 15;
		}

		// Cap at 100
		calculatedScore = Math.min(calculatedScore, 100);

		setScore(calculatedScore);

		// Set message based on score
		if (calculatedScore >= 90) {
			setMessage('Excellent! Keep up the great work.');
		} else if (calculatedScore >= 80) {
			setMessage("Very good! You're on the right track.");
		} else if (calculatedScore >= 70) {
			setMessage('Good progress! Room for improvement.');
		} else if (calculatedScore >= 60) {
			setMessage('Fair. Focus on increasing savings.');
		} else {
			setMessage('Needs attention. Review your spending habits.');
		}
	};

	if (loading) {
		return (
			<div className='card bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white animate-pulse'>
				<div className='flex items-center justify-between'>
					<div>
						<div className='text-green-100 mb-2'>
							Financial Health Score
						</div>
						<div className='w-24 h-12 bg-white/20 rounded mb-2'></div>
						<div className='w-48 h-4 bg-white/20 rounded'></div>
					</div>
					<div className='w-32 h-32 bg-white/20 rounded-full'></div>
				</div>
			</div>
		);
	}

	if (!summary) {
		return (
			<div className='card bg-gradient-to-br from-gray-500 to-gray-600 border-0 text-white'>
				<div className='text-center py-8'>
					Failed to load financial health score
				</div>
			</div>
		);
	}

	return (
		<div className='card bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white'>
			<div className='flex items-center justify-between'>
				<div>
					<div className='text-green-100 mb-2'>
						Financial Health Score
					</div>
					<div className='text-5xl font-bold mb-2'>{score}/100</div>
					<div className='text-green-50'>{message}</div>
				</div>
				<div className='w-32 h-32 relative'>
					<svg className='transform -rotate-90' viewBox='0 0 120 120'>
						<circle
							cx='60'
							cy='60'
							r='54'
							stroke='rgba(255,255,255,0.2)'
							strokeWidth='12'
							fill='none'
						/>
						<circle
							cx='60'
							cy='60'
							r='54'
							stroke='white'
							strokeWidth='12'
							fill='none'
							strokeDasharray={`${2 * Math.PI * 54 * (score / 100)} ${2 * Math.PI * 54}`}
							className='transition-all duration-1000'
						/>
					</svg>
					<div className='absolute inset-0 flex items-center justify-center'>
						<DollarSign className='w-12 h-12' />
					</div>
				</div>
			</div>
		</div>
	);
}
