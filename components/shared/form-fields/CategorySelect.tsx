'use client';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';

interface CategorySelectProps {
	value?: number;
	onChange: (value: string) => void;
	categories: Category[];
	error?: string;
}

export function CategorySelect({
	value,
	onChange,
	categories,
	error,
}: CategorySelectProps) {
	return (
		<div>
			<Label className='block text-sm font-medium text-foreground mb-2'>
				Category
			</Label>
			<Select value={value?.toString()} onValueChange={onChange}>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder='Select a category' />
				</SelectTrigger>
				<SelectContent>
					{categories.map((category) => (
						<SelectItem
							key={category.categoryId}
							value={category.categoryId.toString()}
						>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
		</div>
	);
}
