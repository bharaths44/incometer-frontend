import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	}).format(amount);
};

export const getFrequencyLabel = (frequency: string) => {
	switch (frequency) {
		case 'ONE_TIME':
			return 'One Time';
		case 'MONTHLY':
			return 'Monthly';
		case 'WEEKLY':
			return 'Weekly';
		case 'YEARLY':
			return 'Yearly';
		default:
			return frequency;
	}
};
