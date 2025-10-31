import { CategoryDto } from './category';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Transaction {
	transactionId: number;
	userId: number;
	category: CategoryDto;
	amount: number;
	description: string;
	paymentMethod: PaymentMethodDto;
	transactionDate: string;
	transactionType: TransactionType;
	createdAt: string;
}

export interface TransactionRequestDTO {
	userId: number;
	categoryId: number;
	amount: number;
	description: string;
	paymentMethodId: number;
	transactionDate: string;
	transactionType: TransactionType;
}

export interface TransactionResponseDTO {
	transactionId: number;
	userUserId: number;
	category: CategoryDto;
	amount: number;
	description: string;
	paymentMethod: PaymentMethodDto;
	transactionDate: string;
	transactionType: TransactionType;
	createdAt: string;
}

export interface PaymentMethodDto {
	paymentMethodId: number;
	name: string;
	displayName: string;
	type: string;
}

export interface TransactionConfig {
	type: 'expense' | 'income';
	title: string;
	description: string;
	addButtonText: string;
	formTitle: string;
	tableHeaders: {
		category: string;
		description: string;
		amount: string;
		paymentMethod: string;
		date: string;
		actions: string;
	};
	formLabels: {
		description: string;
		amount: string;
		category: string;
		paymentMethod: string;
		date: string;
	};
	api: {
		baseUrl: string;
		create: string;
		getAll: string;
		update: string;
		delete: string;
		getById: string;
		getByDateRange: string;
	};
}
