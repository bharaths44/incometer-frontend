import * as z from 'zod';
import { BudgetType, BudgetFrequency } from '@/types/budget';

export const budgetFormSchema = z.object({
	categoryId: z.number().min(1, 'Please select a category'),
	amount: z.number().min(0.01, 'Amount must be greater than 0'),
	startDate: z.date(),
	endDate: z.date(),
	frequency: z.nativeEnum(BudgetFrequency),
	type: z.nativeEnum(BudgetType),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;
