import { cn, formatCurrency, getFrequencyLabel } from '@/lib/utils';

describe('cn utility', () => {
	it('should merge class names correctly', () => {
		expect(cn('class1', 'class2')).toBe('class1 class2');
		expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
		expect(cn('class1', null, 'class2')).toBe('class1 class2');
	});

	it('should handle conflicting Tailwind classes', () => {
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});

	it('should handle conditional classes', () => {
		const isActive = true;
		expect(cn('base-class', isActive && 'active-class')).toBe(
			'base-class active-class'
		);
		expect(cn('base-class', !isActive && 'inactive-class')).toBe(
			'base-class'
		);
	});
});

describe('formatCurrency', () => {
	it('should format currency in INR', () => {
		expect(formatCurrency(100)).toBe('₹100.00');
		expect(formatCurrency(1000.5)).toBe('₹1,000.50');
		expect(formatCurrency(0)).toBe('₹0.00');
	});

	it('should handle negative amounts', () => {
		expect(formatCurrency(-100)).toBe('-₹100.00');
	});
});

describe('getFrequencyLabel', () => {
	it('should return correct labels for frequency types', () => {
		expect(getFrequencyLabel('ONE_TIME')).toBe('One Time');
		expect(getFrequencyLabel('MONTHLY')).toBe('Monthly');
		expect(getFrequencyLabel('WEEKLY')).toBe('Weekly');
		expect(getFrequencyLabel('YEARLY')).toBe('Yearly');
	});

	it('should return the input if frequency type is unknown', () => {
		expect(getFrequencyLabel('DAILY')).toBe('DAILY');
		expect(getFrequencyLabel('')).toBe('');
	});
});
