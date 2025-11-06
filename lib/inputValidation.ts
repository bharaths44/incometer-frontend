import * as z from 'zod';

// Input sanitization utilities
export class InputSanitizer {
	/**
	 * Sanitizes string input by removing HTML tags and trimming whitespace
	 */
	static sanitizeString(input: string): string {
		if (typeof input !== 'string') return '';

		// Remove HTML tags
		const withoutHtml = input.replace(/<[^>]*>/g, '');

		// Trim whitespace and normalize
		return withoutHtml.trim().replace(/\s+/g, ' ');
	}

	/**
	 * Sanitizes text input for database safety (removes potentially dangerous characters)
	 */
	static sanitizeForDatabase(input: string): string {
		if (typeof input !== 'string') return '';

		return input
			.replace(/[<>'"&]/g, '') // Remove HTML/SQL injection characters
			.replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
			.trim();
	}

	/**
	 * Validates and sanitizes email addresses
	 */
	static sanitizeEmail(email: string): string {
		if (typeof email !== 'string') return '';

		const sanitized = email.toLowerCase().trim();

		// Basic email validation regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(sanitized)) {
			throw new Error('Invalid email format');
		}

		return sanitized;
	}

	/**
	 * Sanitizes numeric inputs
	 */
	static sanitizeNumber(input: any): number {
		const num = Number(input);
		if (isNaN(num) || !isFinite(num)) {
			throw new Error('Invalid number');
		}
		return num;
	}

	/**
	 * Sanitizes amount values (positive numbers with 2 decimal places max)
	 */
	static sanitizeAmount(amount: any): number {
		const num = this.sanitizeNumber(amount);
		if (num < 0) {
			throw new Error('Amount cannot be negative');
		}
		// Round to 2 decimal places to prevent precision issues
		return Math.round(num * 100) / 100;
	}
}

// Zod schemas with sanitization
export const transactionSchema = z.object({
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description too long')
		.transform(InputSanitizer.sanitizeForDatabase),
	amount: z
		.union([z.string(), z.number()])
		.transform((val) => InputSanitizer.sanitizeAmount(val)),
	categoryId: z
		.union([z.string(), z.number()])
		.transform((val) => InputSanitizer.sanitizeNumber(val)),
	paymentMethodId: z
		.union([z.string(), z.number()])
		.transform((val) => InputSanitizer.sanitizeNumber(val)),
	transactionDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
	userId: z.string().uuid('Invalid user ID'),
	transactionType: z.enum(['EXPENSE', 'INCOME']),
});

export const categorySchema = z.object({
	name: z
		.string()
		.min(1, 'Category name is required')
		.max(50, 'Category name too long')
		.transform(InputSanitizer.sanitizeForDatabase),
	type: z.enum(['EXPENSE', 'INCOME']),
	userId: z.string().uuid('Invalid user ID'),
});

export const paymentMethodSchema = z.object({
	name: z
		.string()
		.min(1, 'Payment method name is required')
		.max(50, 'Payment method name too long')
		.transform(InputSanitizer.sanitizeForDatabase),
	displayName: z
		.string()
		.min(1, 'Display name is required')
		.max(100, 'Display name too long')
		.transform(InputSanitizer.sanitizeForDatabase),
	userId: z.string().uuid('Invalid user ID'),
});

export const userProfileSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(100, 'Name too long')
		.transform(InputSanitizer.sanitizeString),
	email: z
		.string()
		.email('Invalid email')
		.transform(InputSanitizer.sanitizeEmail),
	phoneNumber: z
		.string()
		.regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
		.transform((val) => val.replace(/[^\d\+\-\(\)\s]/g, '')),
});

// Type exports
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
