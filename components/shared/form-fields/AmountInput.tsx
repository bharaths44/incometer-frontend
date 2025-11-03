'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BudgetType } from '@/types/budget';

interface AmountInputProps {
	value?: number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	type: BudgetType;
	error?: string;
}

export function AmountInput({
	value,
	onChange,
	type,
	error,
}: AmountInputProps) {
	return (
		<div>
			<Label
				htmlFor='amount'
				className='block text-sm font-medium text-foreground mb-2'
			>
				{type === BudgetType.TARGET ? 'Target Amount' : 'Budget Amount'}
			</Label>
			<Input
				id='amount'
				type='number'
				step='0.01'
				min='0'
				value={value || ''}
				onChange={onChange}
				placeholder='0.00'
			/>
			{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
		</div>
	);
}
