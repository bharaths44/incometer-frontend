export enum BudgetFrequency {
	ONE_TIME = 'ONE_TIME',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}

export enum BudgetType {
	LIMIT = 'LIMIT',
	TARGET = 'TARGET',
}

export interface BudgetRequestDTO {
	userId: number;
	categoryId: number;
	amount: number;
	startDate: string;
	endDate: string;
	frequency: BudgetFrequency;
	type: BudgetType;
}

export interface BudgetResponseDTO {
	budgetId: number;
	userId: number;
	categoryId: number;
	categoryName: string;
	amount: number;
	startDate: string;
	endDate: string;
	frequency: BudgetFrequency;
	type: BudgetType;
	active: boolean;
	createdAt: string;
}