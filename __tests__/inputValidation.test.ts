import {
	InputSanitizer,
	transactionSchema,
	categorySchema,
	paymentMethodSchema,
	userProfileSchema,
} from '@/lib/inputValidation';

describe('InputSanitizer', () => {
	describe('sanitizeString', () => {
		it('should remove HTML tags and trim whitespace', () => {
			expect(
				InputSanitizer.sanitizeString(
					'<script>alert("xss")</script>Hello World  '
				)
			).toBe('alert("xss")Hello World');
			expect(InputSanitizer.sanitizeString('  Normal text  ')).toBe(
				'Normal text'
			);
		});

		it('should handle non-string inputs', () => {
			expect(InputSanitizer.sanitizeString(123 as any)).toBe('');
			expect(InputSanitizer.sanitizeString(null as any)).toBe('');
			expect(InputSanitizer.sanitizeString(undefined as any)).toBe('');
		});
	});

	describe('sanitizeForDatabase', () => {
		it('should remove dangerous characters', () => {
			expect(InputSanitizer.sanitizeForDatabase('<script>&"\'')).toBe(
				'script'
			);
			expect(InputSanitizer.sanitizeForDatabase('Normal text')).toBe(
				'Normal text'
			);
		});

		it('should remove control characters', () => {
			expect(InputSanitizer.sanitizeForDatabase('Text\x00\x01')).toBe(
				'Text'
			);
		});
	});

	describe('sanitizeEmail', () => {
		it('should validate and sanitize email addresses', () => {
			expect(InputSanitizer.sanitizeEmail('TEST@EXAMPLE.COM')).toBe(
				'test@example.com'
			);
			expect(InputSanitizer.sanitizeEmail('  user@example.com  ')).toBe(
				'user@example.com'
			);
		});

		it('should throw error for invalid emails', () => {
			expect(() => InputSanitizer.sanitizeEmail('invalid-email')).toThrow(
				'Invalid email format'
			);
			expect(() => InputSanitizer.sanitizeEmail('')).toThrow(
				'Invalid email format'
			);
		});
	});

	describe('sanitizeNumber', () => {
		it('should convert valid inputs to numbers', () => {
			expect(InputSanitizer.sanitizeNumber('123')).toBe(123);
			expect(InputSanitizer.sanitizeNumber(456)).toBe(456);
		});

		it('should throw error for invalid numbers', () => {
			expect(() => InputSanitizer.sanitizeNumber('abc')).toThrow(
				'Invalid number'
			);
			expect(() => InputSanitizer.sanitizeNumber(NaN)).toThrow(
				'Invalid number'
			);
			expect(() => InputSanitizer.sanitizeNumber(Infinity)).toThrow(
				'Invalid number'
			);
		});
	});

	describe('sanitizeAmount', () => {
		it('should validate positive amounts and round to 2 decimal places', () => {
			expect(InputSanitizer.sanitizeAmount('100.123')).toBe(100.12);
			expect(InputSanitizer.sanitizeAmount(50.999)).toBe(51);
		});

		it('should throw error for negative amounts', () => {
			expect(() => InputSanitizer.sanitizeAmount('-100')).toThrow(
				'Amount cannot be negative'
			);
		});
	});
});

describe('Zod Schemas', () => {
	describe('transactionSchema', () => {
		it('should validate valid transaction data', () => {
			const validData = {
				description: 'Test transaction',
				amount: '100.50',
				categoryId: '1',
				paymentMethodId: '1',
				transactionDate: '2024-01-01',
				userId: '123e4567-e89b-12d3-a456-426614174000',
				transactionType: 'EXPENSE' as const,
			};

			expect(() => transactionSchema.parse(validData)).not.toThrow();
		});

		it('should sanitize and transform data', () => {
			const inputData = {
				description: '  <script>Test</script>  ',
				amount: '100.123',
				categoryId: '1',
				paymentMethodId: '1',
				transactionDate: '2024-01-01',
				userId: '123e4567-e89b-12d3-a456-426614174000',
				transactionType: 'EXPENSE' as const,
			};

			const result = transactionSchema.parse(inputData);
			expect(result.description).toBe('scriptTest/script');
			expect(result.amount).toBe(100.12);
		});

		it('should reject invalid data', () => {
			const invalidData = {
				description: '',
				amount: '-100',
				categoryId: '1',
				paymentMethodId: '1',
				transactionDate: '2024-01-01',
				userId: 'invalid-uuid',
				transactionType: 'INVALID' as any,
			};

			expect(() => transactionSchema.parse(invalidData)).toThrow();
		});
	});

	describe('categorySchema', () => {
		it('should validate valid category data', () => {
			const validData = {
				name: 'Food',
				type: 'EXPENSE' as const,
				userId: '123e4567-e89b-12d3-a456-426614174000',
			};

			expect(() => categorySchema.parse(validData)).not.toThrow();
		});
	});

	describe('userProfileSchema', () => {
		it('should validate valid user profile data', () => {
			const validData = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1-234-567-8900',
			};

			expect(() => userProfileSchema.parse(validData)).not.toThrow();
		});

		it('should sanitize name using sanitizeString', () => {
			const inputData = {
				name: '  John <script>Doe</script>  ',
				email: 'john@example.com',
				phoneNumber: '+1234567890',
			};

			const result = userProfileSchema.parse(inputData);
			expect(result.name).toBe('John Doe');
		});

		it('should sanitize email using sanitizeEmail', () => {
			const inputData = {
				name: 'John Doe',
				email: 'user@example.com',
				phoneNumber: '+1234567890',
			};

			const result = userProfileSchema.parse(inputData);
			expect(result.email).toBe('user@example.com');
		});

		it('should sanitize phone number by removing invalid characters', () => {
			const inputData = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '+1 (234) 567-8900',
			};

			const result = userProfileSchema.parse(inputData);
			expect(result.phoneNumber).toBe('+1 (234) 567-8900');
		});

		it('should reject invalid phone numbers', () => {
			const invalidData = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: 'invalid-phone',
			};

			expect(() => userProfileSchema.parse(invalidData)).toThrow();
		});
	});

	describe('paymentMethodSchema', () => {
		it('should validate valid payment method data', () => {
			const validData = {
				name: 'Cash',
				displayName: 'Cash Payment',
				userId: '123e4567-e89b-12d3-a456-426614174000',
			};

			expect(() => paymentMethodSchema.parse(validData)).not.toThrow();
		});
	});
});
