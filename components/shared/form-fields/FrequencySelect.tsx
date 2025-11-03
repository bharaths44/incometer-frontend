'use client';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { BudgetFrequency } from '@/types/budget';

interface FrequencySelectProps {
	value: BudgetFrequency;
	onChange: (value: BudgetFrequency) => void;
	error?: string;
}

export function FrequencySelect({
	value,
	onChange,
	error,
}: FrequencySelectProps) {
	return (
		<div>
			<Label className='block text-sm font-medium text-foreground mb-2'>
				Frequency
			</Label>
			<Select
				value={value}
				onValueChange={(value: BudgetFrequency) => onChange(value)}
			>
				<SelectTrigger className='w-full'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={BudgetFrequency.ONE_TIME}>
						One Time
					</SelectItem>
					<SelectItem value={BudgetFrequency.WEEKLY}>
						Weekly
					</SelectItem>
					<SelectItem value={BudgetFrequency.MONTHLY}>
						Monthly
					</SelectItem>
					<SelectItem value={BudgetFrequency.YEARLY}>
						Yearly
					</SelectItem>
				</SelectContent>
			</Select>
			{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
		</div>
	);
}
