'use client';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { BudgetType } from '@/types/budget';

interface TypeSelectProps {
	value: BudgetType;
	onChange: (value: BudgetType) => void;
	error?: string;
}

export function TypeSelect({ value, onChange, error }: TypeSelectProps) {
	return (
		<div>
			<Label className='block text-sm font-medium text-foreground mb-2'>
				Type
			</Label>
			<Select
				value={value}
				onValueChange={(value: BudgetType) => onChange(value)}
			>
				<SelectTrigger className='w-full'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={BudgetType.LIMIT}>Budget</SelectItem>
					<SelectItem value={BudgetType.TARGET}>Target</SelectItem>
				</SelectContent>
			</Select>
			{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
		</div>
	);
}
