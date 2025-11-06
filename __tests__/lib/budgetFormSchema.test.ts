import { budgetFormSchema, BudgetFormData } from '@/lib/budgetFormSchema';
import { BudgetType, BudgetFrequency } from '@/types/budget';

describe('budgetFormSchema', () => {
	describe('valid data', () => {
		it('should validate correct expense budget data', () => {
			const validData = {
				categoryId: 1,
				amount: 500.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it('should validate correct income budget data', () => {
			const validData = {
				categoryId: 2,
				amount: 3000.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.YEARLY,
				type: BudgetType.TARGET,
			};

			const result = budgetFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it('should validate minimum amount', () => {
			const validData = {
				categoryId: 1,
				amount: 0.01,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should validate all budget frequencies', () => {
			const frequencies = Object.values(BudgetFrequency);

			frequencies.forEach((frequency) => {
				const validData = {
					categoryId: 1,
					amount: 100.0,
					startDate: new Date('2024-01-01'),
					endDate: new Date('2024-12-31'),
					frequency,
					type: BudgetType.LIMIT,
				};

				const result = budgetFormSchema.safeParse(validData);
				expect(result.success).toBe(true);
			});
		});

		it('should validate all budget types', () => {
			const types = Object.values(BudgetType);

			types.forEach((type) => {
				const validData = {
					categoryId: 1,
					amount: 100.0,
					startDate: new Date('2024-01-01'),
					endDate: new Date('2024-12-31'),
					frequency: BudgetFrequency.MONTHLY,
					type,
				};

				const result = budgetFormSchema.safeParse(validData);
				expect(result.success).toBe(true);
			});
		});
	});

	describe('invalid data', () => {
		it('should reject invalid categoryId', () => {
			const invalidData = {
				categoryId: 0, // Must be >= 1
				amount: 500.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('categoryId');
				expect(result.error.issues[0].message).toBe(
					'Please select a category'
				);
			}
		});

		it('should reject negative amount', () => {
			const invalidData = {
				categoryId: 1,
				amount: -100.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('amount');
				expect(result.error.issues[0].message).toBe(
					'Amount must be greater than 0'
				);
			}
		});

		it('should reject zero amount', () => {
			const invalidData = {
				categoryId: 1,
				amount: 0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('amount');
				expect(result.error.issues[0].message).toBe(
					'Amount must be greater than 0'
				);
			}
		});

		it('should reject invalid frequency', () => {
			const invalidData = {
				categoryId: 1,
				amount: 500.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: 'INVALID_FREQUENCY',
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('frequency');
			}
		});

		it('should reject invalid type', () => {
			const invalidData = {
				categoryId: 1,
				amount: 500.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: 'INVALID_TYPE',
			};

			const result = budgetFormSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('type');
			}
		});

		it('should reject missing required fields', () => {
			const incompleteData = {
				categoryId: 1,
				amount: 500.0,
				// Missing startDate, endDate, frequency, type
			};

			const result = budgetFormSchema.safeParse(incompleteData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});
	});

	describe('type inference', () => {
		it('should correctly infer BudgetFormData type', () => {
			const validData = {
				categoryId: 1,
				amount: 500.0,
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				frequency: BudgetFrequency.MONTHLY,
				type: BudgetType.LIMIT,
			};

			const result = budgetFormSchema.safeParse(validData);
			if (result.success) {
				// TypeScript should infer this as BudgetFormData
				const data: BudgetFormData = result.data;
				expect(data.categoryId).toBe(1);
				expect(data.amount).toBe(500.0);
				expect(data.frequency).toBe(BudgetFrequency.MONTHLY);
				expect(data.type).toBe(BudgetType.LIMIT);
			}
		});
	});
});
