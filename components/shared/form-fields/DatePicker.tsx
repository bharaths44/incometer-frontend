'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface DatePickerProps {
	label: string;
	value?: Date;
	onChange: (date?: Date) => void;
	error?: string;
}

export function DatePicker({ label, value, onChange, error }: DatePickerProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<Label className='block text-sm font-medium text-foreground mb-2'>
				{label}
			</Label>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{value ? (
							format(value, 'PPP')
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0'>
					<Calendar
						mode='single'
						selected={value}
						onSelect={(date) => {
							onChange(date);
							setIsOpen(false);
						}}
						disabled={(date) => date > new Date()}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
		</div>
	);
}
